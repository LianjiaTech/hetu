/**
 *  === mysql env config ===
 *  默认和env相同, 只有当主动传入NODE_MYSQL_ENV参数时, 才会使用NODE_MYSQL_ENV中的值替代env
 *
 *  通过分离数据库环境配置, 以支持在测试环境中使用线上数据+测试环境接口进行访问
 *
 *  created at: Thu Nov 30 2017 17:35:34 GMT+0800 (CST)
 */

import env from '~/src/config/env'
let mysql_env: 'dev' | 'test' | 'prod' = env
switch (process.env.NODE_MYSQL_ENV) {
  case 'dev':
  case 'test':
  case 'prod':
    mysql_env = process.env.NODE_MYSQL_ENV
    break
  default:
    mysql_env = env
}

export default mysql_env
