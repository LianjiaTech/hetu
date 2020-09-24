// mysql 配置。 mysql 使用参见 https://dev.mysql.com/doc/refman/8.0/en/
import prodConfig from '~/src/config/_prod'
import mysql_env from '~/src/config/mysql_env'
import _ from 'lodash'

const { host, port, user, password, database } = _.get(prodConfig, 'mysql')

// 开发环境配置
const dev = {
  // host
  host,
  // 端口号
  port,
  // 用户名
  user,
  // 密码
  password,
  // 数据库名
  database,
}

let config = {
  dev,
  test: dev,
  prod: dev,
}

export default config[mysql_env]
