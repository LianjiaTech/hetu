import prodConfig from '~/src/config/_prod'
import env from '~/src/config/env'
import _ from 'lodash'

const dev = {
  token_name: 'hetu_token',
  token_name_secure: 'hetu_token_secure',
  max_age: 86400 * 1000,
}

export default {
  dev,
  test: dev,
  prod: dev,
}[env]
