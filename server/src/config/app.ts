/**
 *  === app config ===
 *  项目应用的配置
 *
 */
import prodConfig from '~/src/config/_prod'
import env from '~/src/config/env'
import _ from 'lodash'

const prodPort = _.get(prodConfig, ['server', 'port'], 3012)

// 开发环境配置
const dev = {
  name: '河图后端',
  port: 7001,
  login: {
    env: 'dev',
  },
}

// 开发环境配置
const test = {
  name: '河图后端',
  port: 9536,
  login: {
    env: 'test',
  },
}

// 线上环境配置
const prod = {
  name: '河图后端',
  login: {
    env: 'prod',
  },
  port: prodPort,
}

let config = {
  dev,
  test,
  prod,
}

export default config[env]
