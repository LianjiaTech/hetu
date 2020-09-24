import _ from 'lodash'
import redisClient from '~/src/library/redis'

interface projectConfig {
  [projectCode: string]: {
    proxy_domin: string
    proxy_code_key?: string
    proxy_success_code?: number
    proxy_message_key?: string
    proxy_content_type?: string
    proxy_token_name?: string
    layout?: string
    access_control_allow_origin?: string
  }
}

const defaultProjectConfigMap: projectConfig = {
  mock: {
    // mock接口
    proxy_domin: 'http://mockjs.docway.net/mock/1XhtOi6ISFV',
    proxy_success_code: 0,
    access_control_allow_origin: '*',
  },
}

Object.freeze(defaultProjectConfigMap)

/**
 * 获取所有项目配置
 * @param path
 * @param value
 */
export async function getAllValueFromRedis() {
  // 从redis获取项目的配置
  let projectConfigMapStr = await redisClient.get('projectConfigMap')
  let projectConfigMap = { ...defaultProjectConfigMap }
  try {
    if (projectConfigMapStr) {
      let parseObj = JSON.parse(projectConfigMapStr)
      if (_.isPlainObject(parseObj)) {
        Object.assign(projectConfigMap, parseObj)
      }
    }
  } catch (e) {}
  return projectConfigMap
}

/**
 * 获取项目配置
 * @param path
 * @param value
 */
export async function getValueFromRedis(path: string | string[], defaultValue?: any) {
  // 从redis获取项目的配置
  let projectConfigMapStr = await redisClient.get('projectConfigMap')
  let projectConfigMap = { ...defaultProjectConfigMap }
  try {
    if (projectConfigMapStr) {
      let parseObj = JSON.parse(projectConfigMapStr)
      if (_.isPlainObject(parseObj)) {
        Object.assign(projectConfigMap, parseObj)
      }
    }
    return _.get(projectConfigMap, path, defaultValue)
  } catch (e) {}
  return defaultValue
}

/**
 * 更新项目配置
 * @param path
 * @param value
 */
export async function updateProjectConfigMap(path: string | string[], value: any) {
  // 从redis获取项目的配置
  let projectConfigMapStr = await redisClient.get('projectConfigMap')

  let projectConfigMap = {}
  try {
    if (projectConfigMapStr) {
      projectConfigMap = JSON.parse(projectConfigMapStr)
    }
    _.set(projectConfigMap, path, value)
  } catch (e) {
    console.error(e)
  }

  // 更新redis项目的配置
  await redisClient.set('projectConfigMap', JSON.stringify(projectConfigMap))
}

/**
 * 清空缓存
 * @param projectCode
 */
export const cleanProjectConfig = async (projectCode: string) => {
  await updateProjectConfigMap(projectCode, undefined)
}

/**
 * 获取projectCode
 * @param url
 */
export function getProjectCode(url: string): string {
  const splitUrl = url.replace('//', '/').split('/') // 从url中获取项目唯一标识
  return splitUrl[1] // 项目唯一标识
}
