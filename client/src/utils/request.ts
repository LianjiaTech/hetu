import Axios, { AxiosRequestConfig } from 'axios'
import { message as Message } from 'antd'
import { merge } from 'lodash'
import { isString, isPlainObject, toNumber } from 'lodash'

// 默认配置
const DefaultConfig = {
  //  请求通用配置 https://www.npmjs.com/package/axios
  axios: {
    method: 'get',
    timeout: 1000 * 60 * 3,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
  },

  // 请求成功码
  successCode: 0,

  // 错误状态码, 跳转地址
  errorCodeJumpMap: {
    '403': '/exception/403',
    '404': '/exception/404',
    '500': '/exception/500',
  },
}

let requestConfig = merge({}, DefaultConfig)

// 这个是给用户看的
const showError = (text: string) => {
  if (isString(text)) {
    Message.error(text)
  } else {
    throw text
  }
}

interface requestConfig extends AxiosRequestConfig {
  isShowError?: boolean
  isNotJumpOnError?: boolean
}

export const request = (url: string, options: requestConfig) => {
  const { successCode, axios: axiosConfig, errorCodeJumpMap } = requestConfig
  let config: AxiosRequestConfig = {}

  const { isNotJumpOnError = true, isShowError = true, ...rest } = options
  config = Object.assign({}, axiosConfig, rest)
  config.url = url

  return Axios(config)
    .then((res) => {
      let { data } = res

      if (data.status !== undefined) {
        data.code = data.status
      }

      // 请求成功
      if (data.code === successCode) {
        return Promise.resolve(data)
      }

      // 开发环境未登录
      if (data.code === 408) {
        let gotoURL = encodeURIComponent(window.location.href)

        window.location.href = `${window.location.origin}/user/login?gotoURL=${gotoURL}`

        return
      }

      // 其他错误处理
      if (!isNotJumpOnError) {
        // code码错误, 则跳转
        Object.keys(errorCodeJumpMap).some((code: keyof typeof errorCodeJumpMap) => {
          if (toNumber(data.code) === toNumber(code)) {
            window.location.href = errorCodeJumpMap[code]
            return true
          }
        })
      }

      const errorMessage = data.msg || data.message || '接口异常'

      return Promise.reject({ code: data.code, message: errorMessage })
    })
    .catch((e) => {
      const errorMessage = (e && e.message) || '未知错误'

      if (isShowError) {
        showError(errorMessage)
      }

      return Promise.reject(e)
    })
}

// 方法不完美, 配置麻烦, 直接使用request
export const get = (url: string, params = {}, config = {}) => {
  const options = Object.assign({}, { params }, { method: 'get' }, config)
  return request(url, options)
}

// 方法不完美, 配置麻烦, 直接使用request
export const post = (url: string, params = {}, config = {}) => {
  const options = Object.assign({}, { data: params }, { method: 'post' }, config)
  return request(url, options)
}

export const setConfig = (config = {}) => {
  if (isPlainObject(config)) {
    requestConfig = merge({}, DefaultConfig, config)
  }
}

export default { get, post, request }
