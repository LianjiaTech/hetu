import chart from './chart/line'
import advancedForm from './custom/advanced'
import basicDetail from './custom/basicDetail'
import formCreate from './form/project_template_form_create'
import formEdit from './form/project_template_form_edit'
import list from './list/project_template_list_2'
import tabs from './list/project_template_tabs_1'

export let templateData = [
  {
    category: '列表',
    data: [
      {
        id: '/project/template/list/with/gui',
        desc: '列表',
        imgUrl:
          'https://file.ljcdn.com/hetu-cdn/bf17934885c638c1c32d491cc6dbaad6-1585148288903.png',
        config: list,
      },
      {
        id: '/project/template/tabs/1',
        desc: '多标签列表',
        imgUrl:
          'http://file.ljcdn.com/hetu-cdn/cb764c3033c56d0a669fc7115657619d-1585147386776.png',
        config: tabs,
      },
    ],
  },
  {
    category: '表单',
    data: [
      {
        id: '/project/template/form/add',
        desc: '表单-新增数据',
        imgUrl:
          'https://file.ljcdn.com/hetu-cdn/ba991b81c4db7558abcf29ae3eaaeb41-1592280507964.png',
        config: formCreate,
      },
      {
        id: '/project/template/form/add',
        desc: '表单-编辑数据',
        imgUrl:
          'https://file.ljcdn.com/hetu-cdn/ba991b81c4db7558abcf29ae3eaaeb41-1592280507964.png',
        config: formEdit,
      },
      {
        id: '/project/template/form/advanced',
        desc: '组合区块',
        imgUrl:
          'https://file.ljcdn.com/hetu-cdn/78680937a683a887d904efc2ffb7aab4-1592808714965.png',
        config: advancedForm,
      },
      {
        id: '/project/template/detail/basic',
        desc: '基础详情页',
        imgUrl:
          'https://file.ljcdn.com/hetu-cdn/b796c22df9dee73e8faae14744592421-1592808565944.png',
        config: basicDetail,
      },
    ],
  },
  {
    category: '图表',
    data: [
      {
        id: '/project/template/chart/line',
        title: '图表-多条折线图',
        desc: '折线图',
        imgUrl:
          'https://file.ljcdn.com/hetu-cdn/hetu-display-chart-1599632151.jpeg',
        config: chart,
      },
    ],
  },
]
