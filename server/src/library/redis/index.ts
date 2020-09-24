// import Redis from 'ioredis'
// import redisConfig from '~/src/config/redis'

// const redisClient = new Redis({
//   host: redisConfig.host,
//   port: redisConfig.port,
//   db: redisConfig.db,
//   password: redisConfig.password,
//   retryStrategy: (times) => {
//     // 如果重链接次数在100次以上, 发送消息给相关负责人
//     if (times > 100) {
//       return times * 1000
//     }
//     return Math.min(times * 100, redisConfig.retry_delay)
//   },
//   // 重链接出错时, 发送消息给相关负责人
//   reconnectOnError: (err) => {
//     var targetError = 'READONLY'
//     if (err.message.slice(0, targetError.length) === targetError) {
//       // Only reconnect when the error starts with "READONLY"
//       return true // or `return 1;`
//     }
//     return false
//   },
// })

/**
 * 为了省钱, 自己写了一个简易的redis服务, 仅用于demo展示
 * 可使用第三方或自己搭建redis的服务
 */

import _ from 'lodash'
import moment from 'moment'
import fs from 'fs'
import path from 'path'

// EX: 设置键过期时间second秒
type IExpiryMode = 'EX'
interface ICache {
  value: string
  expiry_mode?: IExpiryMode
  expiry_time?: number
}

const fileDir = path.resolve(__dirname, '../../../logs')
const filePath = `${fileDir}/redis-cache.json`
/**
 * 模拟redis, 可自行替换为redis服务
 */
class redisClient {
  static cacheMap: { [key: string]: ICache } = {}

  static writeCacheToFile() {
    try {
      fs.open(filePath, 'r', (err) => {
        if (err) throw err
        fs.writeFileSync(filePath, JSON.stringify(this.cacheMap, null, 2))
      })
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 读取
   * @param key
   */
  static async get(key: string) {
    const cache = this.cacheMap[key]
    // 不存在
    if (!cache) return undefined
    const { expiry_time, value } = cache
    const now = moment.now()
    if (expiry_time && now > expiry_time) {
      // 已过期
      return undefined
    }

    // 未过期 || 永不过期
    return value
  }

  /**
   * 设置
   * @param key
   * @param value
   * @param expiry_mode
   * @param time
   */
  static async set(key: string, value: string, expiry_mode?: IExpiryMode, time?: number) {
    const now = moment.now()
    const expiry_time = expiry_mode === 'EX' && time ? time * 1000 + now : undefined
    this.cacheMap[key] = {
      value,
      expiry_mode,
      expiry_time,
    }
    this.writeCacheToFile()

    if (expiry_time && time) {
      // 过期之后删除
      setTimeout(() => {
        delete this.cacheMap[key]
        this.writeCacheToFile()
      }, time * 1000 * 1.1)
    }
  }

  /**
   * 删除key
   * @param key
   */
  static async del(key: string) {
    if (this.cacheMap[key] !== undefined) {
      delete this.cacheMap[key]
      this.writeCacheToFile()
    }
  }
}

fs.open(filePath, 'r', (err) => {
  try {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.writeFileSync(filePath, JSON.stringify({}))
      } else {
        console.error(err)
      }
      return
    }

    let buffer = fs.readFileSync(filePath)

    if (buffer) {
      const dataStr = buffer.toString()
      const data = JSON.parse(dataStr)
      if (dataStr && _.isPlainObject(data)) {
        redisClient.cacheMap = data
      }
    }
  } catch (e) {
    console.error(e)
  }
})

export default redisClient
