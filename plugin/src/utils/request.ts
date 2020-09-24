import { store } from '@ice/stark-data'
import Axios, { AxiosRequestConfig } from 'axios'
import _ from 'lodash'
import { pathToRegexp } from 'path-to-regexp'
import Qs from 'query-string'
import Message from '~/utils/message'

// 请求成功状态码
const successCode = 0

//  https://www.npmjs.com/package/axios
export const axiosInstance = Axios.create({
  method: 'get',
  timeout: 1000 * 60 * 3,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  paramsSerializer: function(params: object) {
    return Qs.stringify(params, { arrayFormat: 'comma' })
  },
})

// 这个是给用户看的
const showError = (text: string) => {
  if (_.isString(text)) {
    Message.error(text)
  } else {
    throw text
  }
}

interface CustomError {
  url: string
  method: string
  code: number
  message: string
  params: object
  data: object
}

// 这个是给开发人员看的, 在控制台显示
const createError = (customError: CustomError) => {
  const error = { message: JSON.stringify(customError, null, 2), msg: '' }
  error.msg = customError.message
  return error
}

interface ResponseData {
  code: number
  message: string
  data?: any
}

async function request(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<ResponseData> {
  if (!url) {
    return Promise.reject(new Error('缺少接口请求地址url'))
  }

  let _options = { ...options, url }

  if (window.__POWERED_BY_QIANKUN__) {
    // 使用微前端集成时
    const { headers = {}, ...others } = store.get('hetu-request-config') || {}
    Object.assign(_options, {
      ...others,
      withCredentials: false,
      headers: {
        ...headers,
        'X-UCID': store.get('hetu-ucid'),
        'X-Requested-From': 'qiankun',
      },
    })
  }

  const res = await axiosInstance(_options)

  if (_.get(res, 'data.status') !== undefined) {
    res.data.code = res.data.status
  }

  if (_.get(res, 'data.code') === successCode) {
    return res.data
  }

  const errMsg = _.get(res, 'data.message', '请求异常')
  showError(errMsg)
  const error = createError({
    url,
    method: options.method || 'get',
    code: _.get(res, 'data.code'),
    message: errMsg,
    params: options.params,
    data: options.data,
  })
  throw error
}

/**
 * 自定义请求库
 * @param url
 * @param options
 */
export function customRequest(url: string, options: AxiosRequestConfig = {}) {
  // 允许使用自定义request覆盖
  let requestMap = store.get('hetu-request-map')
  if (_.isPlainObject(requestMap)) {
    for (let key in requestMap) {
      if (Object.prototype.hasOwnProperty.call(requestMap, key)) {
        let reg = pathToRegexp(key)
        if (reg.test(url) && _.isFunction(requestMap[key])) {
          return requestMap[key](url, options)
        }
      }
    }
  }
  return request(url, options)
}

export const get = (url: string, params = {}, config = {}) => {
  const options = { params, method: 'get' as 'get', ...config }
  return customRequest(url, options)
}

export const _delete = (url: string, params = {}, config = {}) => {
  const options = { params, method: 'delete' as 'delete', ...config }
  return customRequest(url, options)
}

export const head = (url: string, params = {}, config = {}) => {
  const options = { params, method: 'head' as 'head', ...config }
  return customRequest(url, options)
}

export const options = (url: string, params = {}, config = {}) => {
  const options = { params, method: 'options' as 'options', ...config }
  return customRequest(url, options)
}

// 方法不完美, 配置麻烦, 直接使用request
export const post = (url: string, data = {}, config = {}) => {
  const options = { data, method: 'post' as 'post', ...config }
  return customRequest(url, options)
}

export const put = (url: string, data = {}, config = {}) => {
  const options = { data, method: 'put' as 'put', ...config }
  return customRequest(url, options)
}

export const patch = (url: string, data = {}, config = {}) => {
  const options = { data, method: 'patch' as 'patch', ...config }
  return customRequest(url, options)
}

export default { get, post, head, options, put, delete: _delete, patch }
