/* eslint-disable no-template-curly-in-string */
import mockAxios from 'jest-mock-axios'
import { JsonSchema } from '~/types/jsonSchema'
import {
  parseJsonTemplate,
  resolveDependencies,
  resolveRemote,
} from '../hetuTools'

// @ts-ignore
const pagestate: JsonSchema.Pagestate = { a: 123, b: 'abc' }

it('parseJsonTemplate', () => {
  // eslint-disable-next-line no-template-curly-in-string
  expect(parseJsonTemplate('${ a + 1 }', pagestate)).toBe(
    // @ts-ignore
    pagestate.a + 1
  )

  expect(parseJsonTemplate("${b + 'def'}", pagestate)).toBe('abcdef')

  expect(parseJsonTemplate('${`ab${a}ccc`}', pagestate)).toBe('ab123ccc')
})

describe('resolveRemote', () => {
  const remote: JsonSchema.Remote = {
    data1: {
      url: 'http://xxx.hetu.com/test/data1',
      method: 'get',
      params: {
        a: 1,
      },
      // @ts-ignore
      transform: '${ v => v.id }',
    },
    data2: {
      url: 'http://xxx.hetu.com/test/data2',
      method: 'post',
      params: {
        b: '1324',
      },
    },
  }

  const result = resolveRemote(remote, pagestate)

  it('params & data 自动转换', () => {
    const requestInfo1 = mockAxios.getReqMatching({
      url: 'http://xxx.hetu.com/test/data1',
      method: 'get',
    })
    // @ts-ignore
    expect(requestInfo1.config.params).toMatchObject(remote.data1.params)
    const requestInfo2 = mockAxios.getReqMatching({
      url: 'http://xxx.hetu.com/test/data2',
      method: 'post',
    })
    // @ts-ignore
    expect(requestInfo2.config.data).toMatchObject(remote.data2.params)
  })

  it('transform', () => {
    const response1 = {
      status: 200,
      data: { code: 0, data: { id: 'data1' } },
    }
    const response2 = {
      status: 200,
      data: { code: 0, data: { id: 'data2' } },
    }

    mockAxios.mockResponseFor('http://xxx.hetu.com/test/data1', response1)
    mockAxios.mockResponseFor('http://xxx.hetu.com/test/data2', response2)

    return expect(result).resolves.toMatchObject({
      data1: response1.data.data.id,
      data2: response2.data.data,
    })
  })
})

test('resolveDependencies', () => {
  const ajaxConfig = {
    url: 'http://asdfsd.asdfsd.com',
    params: {
      aaa: 1,
    },
    data: {
      bbb: 1234,
    },
    transform: '${ v => v.list }',
  }
  const dependenceis: JsonSchema.Dependencies = {
    a: 2134,
    detail: {
      type: 'ajax',
      config: ajaxConfig,
    },
    detail1: {
      type: 'data',
      value: ajaxConfig,
    },
  }

  const result = resolveDependencies(dependenceis, pagestate)

  const requestInfo = mockAxios.getReqByUrl(ajaxConfig.url)

  expect(requestInfo.config).toEqual(
    expect.objectContaining({
      method: 'get',
      params: ajaxConfig.params,
      data: ajaxConfig.data,
    })
  )

  const mockResponse = { status: 200, data: { code: 0, data: { list: 'aaa' } } }
  mockAxios.mockResponseFor(ajaxConfig.url, mockResponse)

  return expect(result).resolves.toEqual({
    ...pagestate,
    a: dependenceis.a,
    detail: 'aaa',
    detail1: expect.objectContaining({
      ...ajaxConfig,
      transform: expect.any(Function),
    }),
  })
})
