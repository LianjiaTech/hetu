---
order: 0
title: 介绍
---

尝试了四种方案:

- iframe
- Component(组件)
- [@ice/stark-app(飞冰)](https://github.com/ice-lab/icestark)
- [qiankun(乾坤)](https://qiankun.umijs.org/)

综合比较, 最终选择了最适合河图的方案-qiankun, 集成步骤如下:

## 1. 安装依赖

```
npm i -S qiankun js-cookie
```

## 2. 添加河图配置文件

在`components`文件夹中新建一个`Hetu`文件夹

```
├── Hetu
│   ├── config.js     // 配置文件
│   └── index.jsx     // react组件
```

`config.js` 配置示例:

```jsx
import Cookie from 'js-cookie'
import { prefetchApps } from 'qiankun';

/**
 * 获取河图域名
 */
export function getHost() {
  // ⚠️注意修改这里, 不同项目的环境变量获取方式不一样, 在这个示例中, 是通过window.$ENV获取环境变量
  switch (window.$ENV) {
    case 'development':
    case 'testing':
      return 'http://test-beike.plus'
    default:
      return 'http://139.155.239.172:9536'
  }
}

/**
 * 获取挂载河图页面的dom节点
 */
export function getContainer() {
  const containerId = '__hetu-page-containter__'
  let container = document.getElementById(containerId)

  if (!container) {
    container = document.createElement('div')
    container.setAttribute('id', containerId)
    document.body.appendChild(container)
  }

  return container
}


// axios请求地址
export const requestConfig = {
  baseURL: getHost(),
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // ⚠️注意修改这里
    // 用于校验登录状态的token, 该示例从cookie中获取名为***的cookie
    'X-Custom-Session': Cookie.get('***')
  },
}

// ⚠️注意修改这里
// 因为路径与在河图中配置的路径不一致, 需要映射路径
export const pageconfigsMap = {
  // /path/a 是在当前项目中的路由, /project/***/zoom/list是在河图中的路由
  '/path/a': '/project/***/zoom/list',
  '/path/b': '/project/***/zoom/new'
}

/**
 * 开启河图资源预加载
 */
export function prefetchHetu() {
  prefetchApps([{
    name: 'hetu-editor',
    entry: getHost()
  }])
}

```

`index.jsx` 配置示例:  

```jsx
import React from 'react'
import { loadMicroApp, prefetchApps } from 'qiankun';

// 引入河图配置
import { requestConfig, pageconfigsMap, getHost, getContainer, prefetchHetu } from './config'

prefetchHetu()

let microApp

export default class extends React.Component {

  async componentDidMount() {
    // ⚠️注意修改这里, 不同项目获取的方式不一样
    const userInfo = JSON.parse(document.getElementsByName('user_info')[0].value)

    const commonProps = {
      ucid: userInfo.id,
       // ⚠️注意修改这里, 在河图中的项目唯一code
      projectCode: '***',
      requestConfig,
      pageconfigsMap,
      // ⚠️注意修改这里, history对象, 参考 https://github.com/ReactTraining/history/blob/master/docs/GettingStarted.md
      history: this.props.history
    }

    if (microApp) {
      microApp.update(commonProps)
    } else {
      microApp = loadMicroApp(
        {
          name: 'hetu-editor',
          entry: getHost(),
          container: getContainer(),
          props: commonProps
        },
        {
          sandbox: true,
        }
      );
    }
  }

  render() {
    return (
      <div id="hetu-root" style={{ width: '100%' }} />
    )
  }
}

```

## 3. 修改路由配置

**将所有河图路由, 匹配到刚刚创建的河图组件. 以react项目为例, 配置如下:**

```jsx
import { Switch, Route } from 'react-router-dom'
import Hetu, { pageconfigsMap } from '~/components/Hetu'

<Switch>
  ...
  {
    Object.keys(pageconfigsMap).map(path => (
      <Route
        key={path}
        path={path}
        component={Hetu}
        exact
      />))
  }
  ...
</Switch>
```
