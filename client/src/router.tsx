import React from 'react'
import { routerRedux, Route, Switch } from 'dva/router'
import { ConfigProvider } from 'antd'
import { RouterAPI } from 'dva'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import Home from '~/routes/Home'
import { getRouterData } from '~/common/router'

const routerData = getRouterData()
const { ConnectedRouter } = routerRedux

type routerDataProperty = keyof (typeof routerData)

function RouterConfig({ history, app }: RouterAPI) {
  return (
    <ConfigProvider locale={zh_CN} prefixCls="ht">
      <ConnectedRouter history={history}>
        <Switch>
          {
            Object.keys(routerData).map((key: routerDataProperty) => (
              <Route key={key} path={key as string} {...routerData[key]} />
            ))
          }
          < Route render={({ history }) => <Home history={history} />} />
        </Switch>
      </ConnectedRouter>
    </ConfigProvider>
  )
}

export default RouterConfig
