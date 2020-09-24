import React from 'react'
import { Spin } from 'antd'
import Loadable from 'react-loadable'

let routerDataCache: RouterData

type WrapperComponent = React.ComponentType<any>

// 异步模块
type AsyncModule = () => Promise<{ default: any }>
// 同步模块
type SyncModule = () => ({ default: any })

// 是否为同步模块
function isSyncModule(component: any): component is SyncModule {
  return component.toString().indexOf('.then(') < 0
}

// wrapper of dynamic
const dynamicWrapper = (component: AsyncModule | SyncModule): WrapperComponent => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (isSyncModule(component)) {
    return (props: any) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData()
      }
      return React.createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      })
    }
  }

  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData()
      }
      return component().then((raw) => {
        const Component = raw.default || raw
        return (props: any) =>
          React.createElement(Component, {
            ...props,
            routerData: routerDataCache,
          })
      })
    },
    loading: (props) => {
      if (props.error) {
        throw props.error
      } else {
        return <Spin size="large" className="g-spin" />
      }
    },
  })
}

type RouterData = {
  [key: string]: {
    component: WrapperComponent
    exact: boolean
  }
}

export function getRouterData() {
  const routerConfig: RouterData = {
    '/templates': {
      component: dynamicWrapper(() => import('~/routes/Templates')),
      exact: true,
    },
    '/guiedit': {
      component: dynamicWrapper(() => import('~/routes/GuiEditor')),
      exact: true,
    },
    '/preview': {
      component: dynamicWrapper(() => import('~/routes/Preview')),
      exact: true,
    },
    '/user/login': {
      component: dynamicWrapper(() => import('~/routes/Admin/Login')),
      exact: true,
    },
    '/user/register': {
      component: dynamicWrapper(() => import('~/routes/Admin/Register')),
      exact: true,
    },
    '/user/password/modify': {
      component: dynamicWrapper(() => import('~/routes/Admin/ModifyPassword')),
      exact: true,
    },
    '/exception/403': {
      component: dynamicWrapper(() => import('~/routes/Exception/403')),
      exact: true,
    },
    '/exception/404': {
      component: dynamicWrapper(() => import('~/routes/Exception/404')),
      exact: true,
    },
    '/exception/500': {
      component: dynamicWrapper(() => import('~/routes/Exception/500')),
      exact: true,
    },
  }
  return routerConfig
}

export default routerDataCache
