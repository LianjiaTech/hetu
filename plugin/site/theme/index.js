const path = require('path')

const contentTmpl = './template/Content/index'
const redirectTmpl = './template/Redirect'
const appShellTmpl = './template/AppShell'

function pickerGenerator(module) {
  const tester = new RegExp(`^docs/${module}`)
  return markdownData => {
    const { filename } = markdownData.meta
    if (tester.test(filename) && !/\/demo$/.test(path.dirname(filename))) {
      return {
        meta: markdownData.meta,
      }
    }
    return null
  }
}

module.exports = {
  lazyLoad(nodePath, nodeValue) {
    if (typeof nodeValue === 'string') {
      return true
    }
    return nodePath.endsWith('/demo')
  },
  pick: {
    Components(markdownData) {
      const { filename } = markdownData.meta

      let reg = /\.json\.md$/
      if (!/^components/.test(filename) || /[/\\]demo$/.test(path.dirname(filename)) || reg.test(filename)) {
        return null
      }

      if (/^components\/_/.test(filename)) return null

      return {
        meta: markdownData.meta,
      }
    },
    'docs/editor': pickerGenerator('editor'),
    'docs/customize': pickerGenerator('customize'),
    'docs/stark': pickerGenerator('stark'),
  },
  plugins: ['bisheng-plugin-description', 'bisheng-plugin-toc?maxDepth=2&keepElem', 'bisheng-plugin-antd?injectProvider', 'bisheng-plugin-react?lang=__react'],
  routes: {
    path: '/',
    component: './template/Layout/index',
    indexRoute: { component: redirectTmpl },
    childRoutes: [
      {
        path: 'app-shell',
        component: appShellTmpl,
      },
      {
        path: 'index-cn',
        component: redirectTmpl,
      },
      {
        path: 'docs/editor/:children',
        component: contentTmpl,
      },
      {
        path: 'docs/customize/:children',
        component: contentTmpl,
      },
      {
        path: 'docs/stark/:children',
        component: contentTmpl,
      },
      {
        path: 'components/_Chart/:children',
        component: contentTmpl,
      },
      {
        path: 'components/_BChart/:children',
        component: contentTmpl,
      },
      {
        path: 'components/BChart/:children',
        component: contentTmpl,
      },
      {
        path: 'components/:children',
        component: contentTmpl,
      },
      {
        path: 'components/Field/components/:children',
        component: contentTmpl,
      },
    ],
  },
}
