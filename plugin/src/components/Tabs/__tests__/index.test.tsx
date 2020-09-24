import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { HtForm } from '~/components/Form'
import HtList from '~/components/List'
import {
  ListComponentProps,
  ListComponentState,
} from '~/components/List/interface'
import HtTable from '~/components/Table'
import HtTabs from '~/components/Tabs'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()

const url = '/api/list'
const uniqueKey = 'id'
const method = 'get'
const tabsType = 'line'
const defaultActiveKey = 'tab2'
const pageSize = 2
const cols = 3
const labelCol = { span: 6 }
const wrapperCol = { span: 16 }
const buttons = ['submit', 'reset']
const isAutoSubmit = true
const columnsSetting = true
const tabs = [
  {
    title: 'tab-1',
    value: 'tab1',
    showIndexs: [0],
  },
  {
    title: 'tab-2',
    value: 'tab2',
    showIndexs: [0],
  },
]
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 60,
  },
  {
    title: 'text',
    dataIndex: 'text',
    width: 200,
  },
  {
    title: '预览链接',
    dataIndex: 'preview',
    width: 80,
    renderType: 'a',
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 100,
  },
  {
    title: '开关',
    dataIndex: 'switch',
    renderType: 'switch',
    url: '/api/form/update',
    width: 100,
  },
]
const actionColumn = {
  width: 100,
  operations: [
    {
      text: '查看',
      actionType: 'open',
      url: 'http://aaa.com',
    },
    {
      text: '编辑',
      actionType: 'modalForm',
      url: '/api/form/update',
      fields: [
        {
          field: 'imageUrl',
          title: 'banner',
        },
        {
          field: 'tags',
          title: '标签',
        },
      ],
    },
    {
      text: '删除',
      actionType: 'xhr',
      url: '/api/xxx/delete',
    },
  ],
}
const fields = [
  {
    field: 'id',
    title: 'bannerId',
  },
  {
    field: 'tags',
    title: '标签',
  },
]

const elementConfig = {
  type: 'HtTabs',
  props: {
    tabsType,
    defaultActiveKey,
    tabs,
    content: [
      {
        type: 'HtList',
        props: {
          url,
          uniqueKey,
          fields,
          pageSize,
          columns,
          actionColumn,
          columnsSetting,
        },
      },
    ],
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperList = wrapper.find<
  React.Component<ListComponentProps, ListComponentState>
>(HtList)
let WrapperListInstance = WrapperList.instance()
const WrapperForm = wrapper.find(HtForm)
const WrapperHtTabs = wrapper.find(HtTabs)

describe('正确的props', () => {
  test('tabs', () => {
    expect(wrapper.find(HtTabs)).toHaveLength(1)
  })

  it('props正确传递给HtTabs', () => {
    expect(WrapperHtTabs.prop('tabsType')).toEqual(tabsType)
    expect(WrapperHtTabs.prop('defaultActiveKey')).toEqual(defaultActiveKey)
    expect(WrapperHtTabs.prop('tabs')).toEqual(tabs)
  })

  it('props正确传递给HtTable', () => {
    const WrapperTable = wrapper.find(HtTable)
    expect(WrapperTable.prop('uniqueKey')).toEqual(uniqueKey)
    expect(WrapperTable.prop('pagination')).toHaveProperty('pageSize', pageSize)
    expect(WrapperTable.prop('dataSource')).toEqual([])
    expect(WrapperTable.prop('columns')).toEqual(columns)
    expect(WrapperTable.prop('actionColumn')).toEqual(actionColumn)
    expect(WrapperTable.prop('columnsSetting')).toEqual(columnsSetting)
  })

  it('props正确传递给HtForm', () => {
    expect(WrapperList.prop('url')).toEqual(url)
    expect(WrapperForm.prop('fields')).toEqual(fields)
    expect(WrapperList.prop('cols')).toEqual(cols)
    expect(WrapperForm.prop('labelCol')).toEqual(labelCol)
    expect(WrapperForm.prop('wrapperCol')).toEqual(wrapperCol)
    expect(WrapperForm.prop('buttons')).toEqual(buttons)
    expect(WrapperForm.prop('isAutoSubmit')).toEqual(isAutoSubmit)
    expect(WrapperForm.prop('method')).toEqual(method)
  })
})

describe('HtTabs组件内部方法', () => {
  it('onTabChange', () => {
    const setStoreState = WrapperListInstance.props.pagestate.setStoreState
    setStoreState({
      // @ts-ignore
      [WrapperListInstance.ComponentAlias]: 1,
    })
  })
  it('renderTabs', () => {})
  it('renderContent', () => {})
})
