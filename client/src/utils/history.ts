// user BrowserHistory
import * as H from 'history'
import { isString, isPlainObject } from 'lodash'
import queryString from 'query-string'

const history = H.createBrowserHistory({})

interface option {
  pathname?: string
  query?: dynamicObject
  state?: any
  search?: string
}

// 增强history push replace 方法, 让其接收query参数
const push = history.push
history.push = (a: string | option, state?: any) => {
  if (isString(a)) {
    return push(a, state)
  }

  if (isPlainObject(a)) {
    let { pathname, query, state, search } = a
    if (query) {
      search = '?' + queryString.stringify(query)
    }
    push({ pathname, search, state })
  }
}

const replace = history.replace
history.replace = (a: string | option, state?: any) => {
  if (isString(a)) {
    return replace(a, state)
  }

  if (isPlainObject(a)) {
    let { pathname, query, state, search } = a
    if (query) {
      search = '?' + queryString.stringify(query)
    }
    replace({ pathname, search, state })
  }
}

export default history
