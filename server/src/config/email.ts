import _ from 'lodash'
import prodConfig from '~/src/config/_prod'
import env from './env'

const { host, port, user, pass } = _.get(prodConfig, 'email')

const dev = {
  from: user,
  host,
  port,
  user,
  pass,
}

const test = dev
const test1 = dev
const test2 = dev
const test3 = dev
const prod = dev

const config = {
  dev,
  test,
  test1,
  test2,
  test3,
  prod,
}

export default config[env]
