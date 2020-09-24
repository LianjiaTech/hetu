import _ from 'lodash'
import { IPageConfig } from '~/types/models/global'
import { reac } from './interface'

export const hasChildrenReg = /^([\w.\[\]]+\.(\w+))\[(\d+)\]$/

export function transformReacToStyle(reac: reac) {
  if (_.isObject(reac)) {
    const fields = ['width', 'height', 'top', 'left']

    let result = {} as {
      [key in keyof reac]: string
    }
    fields.map((key: keyof reac) => {
      result[key] = reac[key] + 'px'
    })
    return result
  }
  return {}
}

/**
 * 解析dom元素上data-pageconfig-path属性的值
 *
 * @param {String} dataPageConfigPath dom元素上data-pageconfig-path的值
 * @returns { index, children, childrenParentKey }
 * index:当前元素, 在children中处于第几项;
 * children: 当前元素所在的children中的reactNode节点;
 * childrenParentKey: 当前元素的父级的path;
 *
 * @example
 *
 * let dataPageConfigPath = 'elementConfig.props.content.children[0].children[1]'
 * let { index, children, childrenParentKey } = getDataFromDataPropsKey(dataPageConfigPath)
 * index => 1
 * children => [ReactNode,ReactNode]
 * childrenParentKey => elementConfig.props.content.children[0].children
 */
export function getDataFromDataPropsKey(dataPageConfigPath: string, pageConfig: IPageConfig) {
  if (hasChildrenReg.test(dataPageConfigPath)) {
    // 判断是否以.\w+[x]结尾
    let matchs = dataPageConfigPath.match(hasChildrenReg)

    if (_.isArray(matchs) && matchs[3]) {
      let index = _.toNumber(matchs[3])
      let key = matchs[1]
      let children = _.get(pageConfig, key)
      if (!_.isArray(children)) {
        throw new Error('解析错误')
      }

      return { index, children, childrenParentKey: key }
    }
  }

  return {}
}
