import store from 'store'
import { isPlainObject, isNumber } from 'lodash'
import { get, set } from 'lodash'

const stringify = JSON.stringify

class LocalHistory {
  pageId?: number

  init({ pageId }: { pageId: number }) {
    if (!isNumber(pageId)) {
      setTimeout(() => {
        throw new TypeError('pageId must be an number')
      })
      return false
    }

    this.pageId = pageId
  }

  push(pageConfig: dynamicObject) {
    let pageId = this.pageId
    if (!pageId) {
      return false
    }

    if (!isPlainObject(pageConfig)) {
      setTimeout(() => {
        throw new TypeError(`pageConfig:${pageConfig} is not a plain object`)
      })
      return false
    }

    let pageHistoryMap = store.get(process.env.NODE_ENV + '__pageConfigHistory__') || {}

    // 获取历史记录
    let pageHistoryValue = get(pageHistoryMap, [pageId, 'value']) || []
    let pageHistoryIndex = get(pageHistoryMap, [pageId, 'index'])

    let lastPageConfig = get(pageHistoryValue, [pageHistoryIndex])

    if (isPlainObject(lastPageConfig) && stringify(lastPageConfig) === stringify(pageConfig)) {
      return false
    }

    pageHistoryValue.push(pageConfig)
    pageHistoryIndex = pageHistoryValue.length - 1

    set(pageHistoryMap, [pageId, 'value'], pageHistoryValue)
    set(pageHistoryMap, [pageId, 'index'], pageHistoryIndex)

    store.set(process.env.NODE_ENV + '__pageConfigHistory__', pageHistoryMap)
  }

  canBack() {
    let pageId = this.pageId
    if (!pageId) {
      return false
    }
    let pageHistoryMap = store.get(process.env.NODE_ENV + '__pageConfigHistory__') || {}
    // 获取历史记录
    let pageHistoryValue = get(pageHistoryMap, [pageId, 'value']) || []
    let pageHistoryIndex = get(pageHistoryMap, [pageId, 'index'])

    if (pageHistoryValue.length === 0 || pageHistoryIndex <= 0) {
      return false
    }
    return true
  }

  back() {
    let isBack = this.canBack()
    if (!isBack) return false

    let pageId = this.pageId

    let pageHistoryMap = store.get(process.env.NODE_ENV + '__pageConfigHistory__') || {}
    let pageHistoryValue = get(pageHistoryMap, [pageId, 'value']) || []
    let pageHistoryIndex = get(pageHistoryMap, [pageId, 'index'])
    let currentIndex = pageHistoryIndex - 1
    let target = get(pageHistoryValue, currentIndex)

    set(pageHistoryMap, [pageId, 'index'], currentIndex)

    store.set(process.env.NODE_ENV + '__pageConfigHistory__', pageHistoryMap)

    return isPlainObject(target) ? target : false
  }

  canForward() {
    let pageId = this.pageId
    if (!pageId) {
      return false
    }

    let pageHistoryMap = store.get(process.env.NODE_ENV + '__pageConfigHistory__') || {}
    // 获取历史记录
    let pageHistoryValue = get(pageHistoryMap, [pageId, 'value']) || []
    let pageHistoryIndex = get(pageHistoryMap, [pageId, 'index'])

    if (pageHistoryValue.length === 0 || pageHistoryIndex >= pageHistoryValue.length - 1) {
      return false
    }
    return true
  }

  forward() {
    let isForward = this.canForward()
    if (!isForward) return false

    let pageId = this.pageId
    let pageHistoryMap = store.get(process.env.NODE_ENV + '__pageConfigHistory__') || {}
    let pageHistoryValue = get(pageHistoryMap, [pageId, 'value']) || []
    let pageHistoryIndex = get(pageHistoryMap, [pageId, 'index'])
    let currentIndex = pageHistoryIndex + 1
    let target = get(pageHistoryValue, currentIndex)

    set(pageHistoryMap, [pageId, 'index'], currentIndex)

    store.set(process.env.NODE_ENV + '__pageConfigHistory__', pageHistoryMap)

    return isPlainObject(target) ? target : false
  }
}

export default new LocalHistory()
