const proxy = require('http-proxy-middleware')

let proxyTargetConfig = {
  target: `http://127.0.0.1:7001/`,
  changeOrigin: true,
  ws: true
}
// 在client/config/paths.js中使用
module.exports = function (app) {
  app.use(proxy('/hetu/api', proxyTargetConfig))
  app.use(proxy('/hetu-cdn', proxyTargetConfig))
  app.use(proxy('/__log__', proxyTargetConfig))
  app.use(proxy('/__hetu_log__', proxyTargetConfig))
  app.use(proxy('/socket.io', proxyTargetConfig))
  app.use(proxy('/api', proxyTargetConfig))
  app.use(proxy('/logout', proxyTargetConfig))
  app.use(proxy('/oauth', proxyTargetConfig))
  app.use(proxy('/mock', proxyTargetConfig))
  app.use(proxy('/test-pyy', proxyTargetConfig))
}
