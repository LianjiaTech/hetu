/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import mockAxios from 'jest-mock-axios'
import React from 'react'
import { HtForm } from '~/components/Form'
import HtList from '~/components/List'
import {
  ListComponentProps,
  ListComponentState,
} from '~/components/List/interface'
import HtTable from '~/components/Table'
import { Hetu } from '~/Hetu'
import { EventHandlerMap } from '~/utils/events'

const history = createBrowserHistory()
const alias = '$$HtListTest'
const url = '/api/list'
const method = 'get'
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
const pageSize = 2
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 50,
  },
  {
    title: 'banner',
    dataIndex: 'imageUrl',
    width: 60,
    renderType: 'img',
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
const cols = 2
const labelCol = { span: 12 }
const wrapperCol = { span: 12 }
const buttons = ['submit', 'reset']
const isAutoSubmit = true
const columnsSetting = true
const actionColumn = {
  width: 120,
  operations: [
    {
      text: '查看',
      actionType: 'open',
      url: 'http://aaa.com',
    },
    {
      text: '删除',
      actionType: 'xhr',
      url: '/api/xxx/delete',
    },
  ],
  operations2: {
    text: '编辑',
    url: '/api/form/update',
    width: 600,
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
}

const scroll = {
  x: 2000,
}
const uniqueKey = 'idddd'
const selections = [
  {
    type: 'HtButton',
    props: {
      href:
        "<%:= '/api/list/download?ids=' + $$tableSelectionRowKeys.join() %>",
      text: '批量下载',
    },
    children: [],
  },
  {
    type: 'HtModalForm',
    props: {
      url: '/api/form/update',
      fields: [
        {
          field: 'ids',
          title: '批量id',
          defaultValue: '<%:= $$tableSelectionRowKeys %>',
          required: true,
          disabled: true,
        },
        {
          field: 'name',
          title: '姓名',
        },
        {
          field: 'age',
          title: '年龄',
          type: 'InputNumber',
        },
      ],
      title: '弹框表单',
      triggerButtonText: '批量编辑',
    },
  },
]

const transform = (v: any) => ({ ...v, id: 123 })

const elementConfig = {
  type: 'HtList',
  props: {
    alias,
    url,
    method,
    fields,
    cols,
    labelCol,
    wrapperCol,
    buttons,
    isAutoSubmit,
    pageSize,
    columns,
    actionColumn,
    scroll,
    uniqueKey,
    selections,
    transform,
    columnsSetting,
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperList = wrapper.find<
  React.Component<ListComponentProps, ListComponentState>
>(HtList)
let WrapperListInstance = WrapperList.instance()
const WrapperForm = wrapper.find(HtForm)

describe('HtList', () => {
  it('正确的DOM结构', () => {
    const htmlStr = wrapper.html()
    expect(htmlStr).toMatch(/data-component-type="HtList\"/)
    expect(htmlStr).toMatch(/data-pageconfig-path="elementConfig"/)
  })

  it('props正确传递给HtForm', () => {
    expect(WrapperForm.prop('pagestate')).not.toBeUndefined()
    expect(WrapperForm.prop('url')).toEqual(url)
    expect(WrapperForm.prop('method')).toEqual(method)
    expect(WrapperForm.prop('fields')).toEqual(fields)
    expect(WrapperForm.prop('alias')).toEqual(alias)
    expect(WrapperForm.prop('buttons')).toEqual(buttons)
    expect(WrapperForm.prop('cols')).toEqual(cols)
    expect(WrapperForm.prop('labelCol')).toEqual(labelCol)
    expect(WrapperForm.prop('wrapperCol')).toEqual(wrapperCol)
    expect(WrapperForm.prop('isAutoSubmit')).toEqual(isAutoSubmit)
    expect(WrapperForm.prop('isShowSuccessMessage')).toEqual(false)
    expect(WrapperForm.prop('onSuccessAction')).toEqual('')
    // @ts-ignore
    expect(WrapperForm.prop('transform')({ a: 1 })).toEqual({ a: 1, id: 123 })
  })

  it('props正确传递给HtTable', () => {
    const WrapperTable = wrapper.find(HtTable)
    expect(WrapperTable.prop('uniqueKey')).toEqual(uniqueKey)
    expect(WrapperTable.prop('pagination')).toHaveProperty('pageSize', pageSize)
    expect(WrapperTable.prop('dataSource')).toEqual([])
    expect(WrapperTable.prop('selections')).toHaveLength(selections.length)
    expect(WrapperTable.prop('scroll')).toEqual(scroll)
    expect(WrapperTable.prop('columns')).toEqual(columns)
    expect(WrapperTable.prop('actionColumn')).toEqual(actionColumn)
    expect(WrapperTable.prop('columnsSetting')).toEqual(columnsSetting)
  })
})

describe('HtList组件内部方法正确', () => {
  it('setPageLoading', () => {
    // @ts-ignore
    WrapperListInstance.setPageLoading(true)
    expect(WrapperListInstance.state.isPageLoading).toBe(true)
    // @ts-ignore
    WrapperListInstance.setPageLoading(false)
    expect(WrapperListInstance.state.isPageLoading).toBe(false)
  })

  it('resetPagination', () => {
    const setStoreState = WrapperListInstance.props.pagestate.setStoreState
    setStoreState({
      // @ts-ignore
      [WrapperListInstance.currentAlias]: 5,
    })

    // @ts-ignore
    expect(WrapperListInstance.current).toBe(5)

    // @ts-ignore
    WrapperListInstance.resetPagination()
    // @ts-ignore
    expect(WrapperListInstance.current).toBe(1)
  })

  it('onPaginationChange', () => {
    // @ts-ignore
    WrapperListInstance.onPaginationChange(10, 100)
    // @ts-ignore
    expect(WrapperListInstance.current).toBe(10)
    // @ts-ignore
    expect(WrapperListInstance.pageSize).toBe(100)
  })

  it('resetSearch', () => {
    // @ts-ignore
    const resetPagination = jest.spyOn(WrapperListInstance, 'resetPagination')
    // @ts-ignore
    const search = jest.spyOn(WrapperListInstance, 'search')

    // @ts-ignore
    WrapperListInstance.resetSearch()

    expect(resetPagination).toHaveBeenCalledTimes(1)
    expect(search).toHaveBeenCalledTimes(1)

    resetPagination.mockRestore()
    search.mockRestore()
  })

  it('search', () => {
    // @ts-ignore
    const submit = jest.spyOn(WrapperListInstance.TheFormSearch, 'submit')
    // @ts-ignore
    const result = WrapperListInstance.search()

    expect(submit).toHaveBeenCalledTimes(1)
    expect(result).toBeInstanceOf(Promise)

    submit.mockRestore()
  })

  it('sendFormData', () => {
    const formData = { a: 1, b: 2 }
    // @ts-ignore
    const promise = WrapperListInstance.sendFormData(formData)
    const mockResponseData = {
      status: 200,
      data: { code: 0, data: { list: [], total: 0 } },
    }

    const requestInfo = mockAxios.lastReqGet()

    mockAxios.mockResponseFor(url, mockResponseData)

    expect(requestInfo.config.params).toMatchObject(formData)
  })
})

describe('HtList 事件', () => {
  it('HtList.resetSearch && HtList.search', () => {
    expect(EventHandlerMap).toHaveProperty(
      ['HtList.resetSearch'],
      // @ts-ignore
      expect.arrayContaining([WrapperListInstance.resetSearch])
    )
    expect(EventHandlerMap).toHaveProperty(
      ['HtList.search'],
      // @ts-ignore
      expect.arrayContaining([WrapperListInstance.search])
    )
  })
})
