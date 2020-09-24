/**
 *  === env config ===
 *  环境配置
 *
 *  created at: Thu Nov 30 2017 17:35:34 GMT+0800 (CST)
 */

// 环境变量值=>
// development
// testing
// production
let env: 'dev' | 'test' | 'prod' = 'test'
switch (process.env.NODE_ENV) {
  case 'dev':
  case 'test':
  case 'prod':
    env = process.env.NODE_ENV
    break
  default:
    env = 'test'
}

export default env
