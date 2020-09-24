'use strict'
/**
 * 统一获取http数据
 * Created by yaoze on 2017/2/17.
 */
import axios from 'axios' // 引入axios组件
import { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios/index' // 引入axios组件
import querystring from 'query-string'
import _ from 'lodash'

interface CustomerAxiosInstance extends AxiosInstance {
  postForm<T = any>(url: string, formData?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 创建axios实例
let http = axios.create({
  timeout: 1000 * 60 * 3,
  maxContentLength: 52428890,
}) as CustomerAxiosInstance

// 设置默认请求成功状态码, 目的是将错误透传
http.defaults.validateStatus = function (status) {
  return status >= 200 && status < 600
}

/**
 * post form表单
 * @param {string} url
 * @param {object} formData
 * @param {object} config
 */
function postForm(url: string, formData = {}, config = {}) {
  return http.post(url, querystring.stringify(formData), {
    ...config,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ..._.get(config, ['headers'], {}),
    },
  })
}
http.postForm = postForm

export default http
