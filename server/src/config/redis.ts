import prodConfig from '~/src/config/_prod'
import env from '~/src/config/env'
import _ from 'lodash'

const { host, port, db, password } = _.get(prodConfig, 'redis')

interface RedisConfig {
  host: string
  port: number
  db: number
  password?: string
  retry_delay: number
}

const dev: RedisConfig = {
  host,
  port,
  db,
  password,
  retry_delay: 1000,
}

const config = {
  dev,
  test: dev,
  prod: dev,
}

export default config[env]
