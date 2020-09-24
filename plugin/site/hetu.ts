import { store } from '@ice/stark-data'

// 模拟在乾坤中
// @ts-ignore
window.__POWERED_BY_QIANKUN__ = true

store.set('hetu-request-config', {
  baseURL: 'http://mockjs.docway.net/mock/1XhtOi6ISFV',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // 用于校验登录状态的token
    'X-Custom-Session': 'site',
  },
})
