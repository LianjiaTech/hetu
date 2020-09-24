/**
 *  === app config ===
 *  项目应用的配置
 *
 */
import env from '~/src/config/env'
import path from 'path'
import _ from 'lodash'

let absoluteLogPath = path.resolve(__dirname, '../logs')

const logPathMap = {
  dev: './logs',
  test: absoluteLogPath,
  test2: absoluteLogPath,
  test3: absoluteLogPath,
  prod: absoluteLogPath,
}

export default logPathMap[env]
