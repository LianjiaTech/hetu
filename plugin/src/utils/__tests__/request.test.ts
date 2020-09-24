// import { sleep } from '@test/utils'
import mockAxios from 'jest-mock-axios'
import request, { customRequest } from '../request'

jest.mock('antd')

describe('request', () => {
  test('get', () => {
    const targetUrl = 'get_asdfsdafdsa'
    const params = { asdfas: 'asldkfjaskdfj' }
    request.get(targetUrl, params)

    const requestInfo = mockAxios.getReqByUrl(targetUrl)

    expect(requestInfo.method).toEqual('get')
    expect(requestInfo.config.params).toEqual(params)
  })

  test('post', () => {
    const targetUrl = 'post_asdfasdfxzvzxcvzxcv'
    const params = { aqwer: 'zxvxzcb' }
    request.post(targetUrl, params)

    const requestInfo = mockAxios.getReqByUrl(targetUrl)
    expect(requestInfo.method).toEqual('post')

    expect(requestInfo.config.data).toEqual(params)
  })

  test('options', () => {
    const targetUrl = 'options_asdfasdfxzvzxcvzxcv'
    const params = { aqwer: 'zxvxzcb' }
    request.options(targetUrl, params)

    const requestInfo = mockAxios.getReqByUrl(targetUrl)
    expect(requestInfo.method).toEqual('options')

    expect(requestInfo.config.params).toEqual(params)
  })

  test('head', () => {
    const targetUrl = 'head_asdfasdfxzvzxcvzxcv'
    const params = { aqwer: 'zxvxzcb' }
    request.head(targetUrl, params)

    const requestInfo = mockAxios.getReqByUrl(targetUrl)
    expect(requestInfo.method).toEqual('head')

    expect(requestInfo.config.params).toEqual(params)
  })

  test('delete', () => {
    const targetUrl = 'delete_asdfasdfxzvzxcvzxcv'
    const params = { aqwer: 'zxvxzcb' }
    request.delete(targetUrl, params)

    const requestInfo = mockAxios.getReqByUrl(targetUrl)
    expect(requestInfo.method).toEqual('delete')

    expect(requestInfo.config.params).toEqual(params)
  })

  test('customRequest', () => {
    const targetUrl = 'request_asdfasdfxzvzxcvzxcv'
    const params = { aqwer: 'zxvxzcb' }
    const data = { dsafjasdkf: 'xzkvczxnvcxmcv1234' }
    const options = { params, data }
    customRequest(targetUrl, options)

    const requestInfo = mockAxios.getReqByUrl(targetUrl)

    expect(requestInfo.config.params).toEqual(params)
    expect(requestInfo.config.data).toEqual(data)
  })

  test('request response handle when code === successCode', () => {
    const targetUrl = 'request_then_asdfasdfxzvzxcvzxcv1'
    const res = customRequest(targetUrl)

    const mockResponse = { status: 200, data: { code: 0, data: {} } }
    mockAxios.mockResponseFor(targetUrl, mockResponse)

    return expect(res).resolves.toEqual(mockResponse.data)
  })
})
