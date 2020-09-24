import { sleep } from '@test/utils'
import { createBrowserHistory } from 'history'
import mockAxios from 'jest-mock-axios'
import _ from 'lodash'
import {
  resolveActionRequest,
  ResolveActionRequestConfig,
  _resolveAction,
} from '../actions'
import { emitter } from '../events'

const history = createBrowserHistory()

// @ts-ignore
const pagestate: JsonSchema.Pagestate = {
  history,
  _S(path: string, value: any) {
    _.set(pagestate, path, value)
    return Promise.resolve(pagestate)
  },
}

describe('resolveActionRequest', () => {
  // @ts-ignore
  const pagestate: JsonSchema.Pagestate = {
    _S(path: string, value: any) {
      _.set(pagestate, path, value)
      return Promise.resolve(pagestate)
    },
  }

  it('test1', () => {
    const config: ResolveActionRequestConfig = {
      alias: 'xxx_options',
      url: 'http://xxx.hetu.com/xxx/options',
      method: 'post',
      params: {
        a: 1,
      },
      transform: (v: any) => v.total,
    }

    const res = resolveActionRequest(config, pagestate)

    const requestInfo = mockAxios.getReqByUrl(config.url)

    // @ts-ignore
    expect(requestInfo.config.data).toMatchObject(config.params)

    const mockResponse = {
      status: 200,
      data: { code: 0, data: { total: 1234 } },
    }
    mockAxios.mockResponseFor(config.url, mockResponse)

    const transformResponse = mockResponse.data.data.total

    return expect(res).resolves.toEqual(transformResponse)
  })

  it('test2', async () => {
    await sleep()

    expect(pagestate).toHaveProperty('xxx_options', 1234)
  })
})

describe('_resolveAction', () => {
  it('goBack', () => {
    const goBack = jest.spyOn(history, 'goBack')
    _resolveAction('goBack', null, pagestate)
    expect(goBack).toHaveReturnedTimes(1)
    goBack.mockRestore()
  })

  it('reload', () => {
    const reload = jest.spyOn(window.location, 'reload')
    _resolveAction('reload', null, pagestate)
    expect(reload).toHaveReturnedTimes(1)
    reload.mockRestore()
  })

  it('redirectTo', () => {
    const targetUrl = 'http://pyy.hetu.com/asdfasdf'
    _resolveAction('redirectTo', targetUrl, pagestate)
    expect(window.location.href).toEqual(targetUrl)
  })

  it('trigger1', () => {
    const eventName = 'testEvent'
    const eventParams = 'testxxx'
    const testFn = jest.fn()
    emitter.on(eventName, testFn)
    _resolveAction('trigger', [eventName, eventParams], pagestate)
    expect(testFn).toBeCalledWith(eventParams)
  })

  it('trigger2', () => {
    const eventName = 'testEvent'
    const testFn = jest.fn()
    emitter.on(eventName, testFn)
    _resolveAction('trigger', eventName, pagestate)
    expect(testFn).toHaveReturnedTimes(1)
  })

  it('request', () => {
    const config: ResolveActionRequestConfig = {
      alias: 'testAlias',
      url: 'http://testAlias.hetu.com/asdfsadf',
      method: 'post',
      params: {
        a: 1,
      },
    }
    _resolveAction('request', config, pagestate)

    const requestInfo = mockAxios.getReqByUrl(config.url)

    // @ts-ignore
    expect(requestInfo.config.data).toMatchObject(config.params)
  })
})
