/* eslint-disable no-template-curly-in-string */
// import { sleep } from '@test/utils'
import { Button, Dropdown, Popconfirm } from 'antd'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import mockAxios from 'jest-mock-axios'
import _ from 'lodash'
import queryString from 'query-string'
import React from 'react'
import HtModalForm from '~/components/ModalForm'
import HtTable, {
  tableRowModalFormAlias,
  tableSelectionRowKeysAlias,
  transformParams,
} from '~/components/Table'
import {
  TableColumn,
  TableComponentProps,
  TableComponentState,
} from '~/components/Table/interfacce'
import { Hetu } from '~/Hetu'
import { _resolveAction } from '~/utils/actions'

jest.mock('~/utils/actions')

const history = createBrowserHistory()

const alias = '$$HtListTestTable'
const url = '/api/list/asdfasdf'
const method = 'get'
const fields: any[] = []
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
]
const cols = 2
const labelCol = { span: 12 }
const wrapperCol = { span: 12 }
const buttons = ['submit', 'reset']
const isAutoSubmit = true
const columnsSetting = true
const actionColumn = {
  width: 120,
  renderType: 'operations',
  operations: [
    {
      text: '查看',
      actionType: 'open',
      url: 'http://test-hetu.company.com',
    },
    {
      text: '删除',
      actionType: 'xhr',
      url: '/api/xxx/delete',
    },
  ],
  operations2: [
    {
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
  ],
}

const scroll = {
  x: 2000,
}
const uniqueKey = 'idddd'
const selections = [
  {
    type: 'HtButton',
    props: {
      href: "${ '/api/list/download?ids=' + $$tableSelectionRowKeys.join() }",
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
          defaultValue: '${ $$tableSelectionRowKeys }',
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
    columnsSetting,
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperTable = wrapper
  .find<React.Component<TableComponentProps, TableComponentState>>(HtTable)
  .at(0)
const WrapperTableInstance = WrapperTable.instance()

describe('正确的props', () => {
  it('props正确传递给HtTable', () => {
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

describe('正确的方法', () => {
  const selectedBtnPath = 'actionColumn.operations2[0]'
  // @ts-ignore
  WrapperTableInstance.selectedBtnPath = selectedBtnPath
  const {
    pagestate,
    uniqueKey,
    onDataSourceChange,
  } = WrapperTableInstance.props
  // @ts-ignore
  WrapperTableInstance.renderModalForm(pagestate, uniqueKey, onDataSourceChange)

  test('setPageLoading', () => {
    expect(WrapperTableInstance.state.isPageLoading).toEqual(false)
    // @ts-ignore
    WrapperTableInstance.setPageLoading(true)
    expect(WrapperTableInstance.state.isPageLoading).toEqual(true)

    // @ts-ignore
    WrapperTableInstance.setPageLoading(false)
    expect(WrapperTableInstance.state.isPageLoading).toEqual(false)
  })

  test('onTableBtnClick actionType=jump', () => {
    const item1 = {
      text: '跳转',
      url: 'testjumpsadkfhaskjdf',
      transform: (v: any) => ({ ...v, xyz: 1235 }),
    }
    const row1 = {
      id: 'test111',
      name: 'xxxsdafs',
    }
    // @ts-ignore
    WrapperTableInstance.onTableBtnClick(item1, row1)

    const query = transformParams(uniqueKey, item1.transform, row1)
    let search = queryString.stringify(query)

    const jumpUrl = `${item1.url}?${search}`
    expect(_resolveAction).toBeCalledWith(
      'redirectTo',
      jumpUrl,
      WrapperTableInstance.props.pagestate
    )
  })

  test('onTableBtnClick actionType=xhr', () => {
    jest.spyOn(history, 'push')
    const item1 = {
      text: '删除',
      actionType: 'xhr',
      url: 'xhrasdfjasdflsadfjdsafjsdalkfjasdl',
      transform: (v: any) => ({ ...v, xyz: 1235 }),
    }
    const row1 = {
      id: 'test111',
      name: 'xxxsdafs',
    }
    // @ts-ignore
    WrapperTableInstance.onTableBtnClick(item1, row1)

    const params = transformParams(uniqueKey, item1.transform, row1)

    const requestInfo = mockAxios.getReqByUrl(item1.url)
    expect(requestInfo.config.data).toEqual(params)
  })

  test('onTableBtnClick actionType=modalForm', () => {
    // @ts-ignore
    WrapperTableInstance.selectedBtnPath = selectedBtnPath

    const {
      pagestate,
      uniqueKey,
      onDataSourceChange,
    } = WrapperTableInstance.props
    // @ts-ignore
    WrapperTableInstance.renderModalForm(
      pagestate,
      uniqueKey,
      onDataSourceChange
    )

    const item1 = actionColumn.operations2[0]
    // @ts-ignore
    item1.__path__ = `actionColumn.operations2[0]`
    // @ts-ignore
    item1.actionType = `modalForm`
    const row1 = {
      id: 'test111',
      name: 'xxxsdafs',
    }

    // @ts-ignore
    WrapperTableInstance.onTableBtnClick(item1, row1)

    expect(
      // @ts-ignore
      WrapperTableInstance.props.pagestate[tableRowModalFormAlias]
    ).toEqual(row1)
  })

  test('onTableSelectChange', () => {
    const setStoreStateMock = jest.spyOn(
      WrapperTableInstance.props.pagestate,
      'setStoreState'
    )

    const selectedRowKeys = ['asdf', 'asdfsdf']
    // @ts-ignore
    WrapperTableInstance.onTableSelectChange(selectedRowKeys)

    expect(setStoreStateMock).toHaveBeenCalledWith({
      [tableSelectionRowKeysAlias]: selectedRowKeys,
    })

    setStoreStateMock.mockRestore()
  })

  test('toggleModalFormVisible', () => {
    // @ts-ignore

    const toggleModalVisibleMock = jest.spyOn(
      // @ts-ignore
      WrapperTableInstance.$HtModalForm,
      'toggleModalVisible'
    )

    // @ts-ignore
    WrapperTableInstance.toggleModalFormVisible(true)
    expect(toggleModalVisibleMock).toBeCalledWith(true)

    // @ts-ignore
    WrapperTableInstance.toggleModalFormVisible(false)
    expect(toggleModalVisibleMock).toBeCalledWith(false)

    toggleModalVisibleMock.mockRestore()
  })

  describe('renderSelections', () => {
    const children = [<div key="1">1234</div>]
    const selectedRowKeys = ['asdf']
    const dataPagestatePath = 'sadjkfhaksjdfhjkds'

    test('children is not an array', () => {
      // @ts-ignore
      const result = WrapperTableInstance.renderSelections(
        {},
        selectedRowKeys,
        dataPagestatePath
      )
      expect(result).toBeNull()
    })

    test(`children is an array`, () => {
      // @ts-ignore
      const result = WrapperTableInstance.renderSelections(
        children,
        selectedRowKeys,
        dataPagestatePath
      )
      expect(result).toHaveLength(children.length)
      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        expect(item.props).toHaveProperty(
          'disabled',
          selectedRowKeys.length === 0
        )
        expect(item.props).toHaveProperty(
          'data-pageconfig-path',
          `${dataPagestatePath}[${i}]`
        )
      }
    })
  })

  test('renderTableColumnMore', () => {
    const renderTableColumnButtonMock = jest.spyOn(
      WrapperTableInstance,
      // @ts-ignore
      'renderTableColumnButton'
    )

    const menus = [
      {
        text: '编辑',
        url: 'xxxasdf',
      },
      {
        text: '详情',
        url: 'detail',
      },
    ]
    const row = {
      id: 'testidadsfsdf',
      name: 'sadfsdf',
    }
    // @ts-ignore
    const result = WrapperTableInstance.renderTableColumnMore(menus, row)

    const _Wrapper = mount(result)
    const WrapperDropdown0 = _Wrapper.find(Dropdown).at(0)

    const WrapperDropdown0Overlay = WrapperDropdown0.prop('overlay')
    // @ts-ignore
    expect(WrapperDropdown0Overlay.props.children).toHaveLength(menus.length)

    const WrapperDropdown0Children = WrapperDropdown0.prop('children')

    // @ts-ignore
    expect(WrapperDropdown0Children.props.className).toEqual(
      'ant-dropdown-link'
    )

    expect(renderTableColumnButtonMock).toHaveBeenCalledTimes(2)

    renderTableColumnButtonMock.mockRestore()
  })

  test('renderTableColumnButton', () => {
    const item = {
      text: 'testButton',
      url: 'asdfasd',
    }
    const row = {
      id: 1235,
    }
    // @ts-ignore
    const result = WrapperTableInstance.renderTableColumnButton(item, row)
    expect(result.type).toEqual(Button)
    expect(result.props).toMatchObject({
      type: 'link',
      className: 'table-row-link',
      onClick: expect.any(Function),
      'data-item': JSON.stringify(item),
    })

    const item1 = {
      text: 'test2',
      actionType: 'xhr',
      url: 'sakdfjkhsdhf',
    }

    // @ts-ignore
    const result1 = WrapperTableInstance.renderTableColumnButton(item1, row)
    expect(result1.type).toEqual(Popconfirm)
    expect(result1.props).toMatchObject({
      onConfirm: expect.any(Function),
    })
    expect(result1.props.children.type).toEqual(Button)
    expect(result1.props.children.props).toMatchObject({
      className: expect.stringMatching('table-row-link'),
    })
  })

  describe('renderColumns', () => {
    const columns: TableColumn[] = [
      {
        'v-if': false,
        title: '第1列',
        dataIndex: 'v-if',
      },
      {
        title: '第2列',
        dataIndex: 'dataIndex2',
        width: 100,
      },
      {
        title: '第3列',
        dataIndex: 'operations',
        width: 200,
        max: 5,
        operations: [
          {
            'v-if': false,
            text: 'test-operations',
            url: 'test-operations-url',
          },
          {
            text: 'test-operations1',
            url: 'test-operations-url1',
          },
          {
            text: 'test-operations2',
            url: 'test-operations-url2',
            actionType: 'xhr',
            transform: (v: any) => ({ ...v, xx: 'testtransform' }),
          },
        ],
      },
      {
        title: '第4列',
        dataIndex: 'operations2',
        width: 200,
        operations2: [
          {
            'v-if': false,
            text: 'test-operations2',
            url: 'test-operations2-url',
            fields: [],
          },
          {
            text: 'test-operations21',
            url: 'test-operations-url21',
            width: 600,
            fields: [
              {
                field: 'testfield',
                title: 'testfield',
              },
            ],
          },
          {
            text: 'test-operations22',
            url: 'test-operations-url22',
            fields: [
              {
                field: 'testfield2',
                title: 'testfield2',
              },
            ],
            transform: (v: any) => ({ ...v, iddd: 'testtransform' }),
          },
        ],
      },
      {
        title: '第5.1列',
        dataIndex: 'renderType.default',
        renderType: 'default',
      },
      {
        title: '第5.2列',
        dataIndex: 'renderType.a',
        renderType: 'a',
      },
      {
        title: '第5.3列',
        dataIndex: 'renderType.img',
        renderType: 'img',
      },
      {
        title: '第5.4列',
        dataIndex: 'renderType.time',
        renderType: 'time',
      },
      {
        title: '第5.5列',
        dataIndex: 'renderType.data',
        renderType: 'date',
      },
      {
        title: '第5.6列',
        dataIndex: 'renderType.boolean',
        renderType: 'boolean',
      },
      {
        title: '第6列',
        dataIndex: 'showOverflowTooltip',
        showOverflowTooltip: true,
      },
      {
        title: '第7列',
        dataIndex: 'tooltip',
        tooltip: '提示信息',
      },
    ]
    const dataPageConfigPath = 'elementConfig'

    // @ts-ignore
    const result = WrapperTableInstance.renderColumns(
      columns,
      dataPageConfigPath
    )

    const columnsMap = getMap(result, 'dataIndex')

    for (let i = 0; i < columns.length; i++) {
      let item: any = columns[i]
      let parsedItem = columnsMap[item.dataIndex]
      let path = `${dataPageConfigPath}[${i}]`
      let dataIndex = item.dataIndex

      const shouldNotRender = item['v-if'] === false

      if (shouldNotRender) {
        test(`[v-if] ${dataIndex}`, () => {
          // @ts-ignore
          expect(parsedItem).toBeUndefined()
        })
        continue
      }

      if (!item.onHeaderCell) {
        test(`[onHeaderCell] ${dataIndex}`, () => {
          // @ts-ignore
          expect(parsedItem.onHeaderCell()).toEqual({
            'data-component-type': 'HtList.column',
            'data-pageconfig-path': path,
          })
        })
      }

      if (item.render) {
        if (!_.isFunction(item.render)) {
          test(`[render] ${dataIndex}`, () => {
            expect(parsedItem.render).toBeUndefined()
          })
        }
        continue
      }

      if (item.operations) {
        const _render = parsedItem.render
        if (_.isArray(item.operations)) {
          test(`[operations] ${dataIndex}`, () => {
            expect(_render).toBeInstanceOf(Function)
          })

          const recordMock = {
            id: 'asdfdsf',
          }
          const filterOperates = item.operations.filter((o: any) => {
            // v-if 后面接收一个function
            if (_.isFunction(o['v-if'])) {
              return o['v-if'](recordMock)
            }
            // v-if 后面接收一个bool值
            return o['v-if'] !== false
          })

          const max = item.max
          test(`[operations v-if & max] ${dataIndex}`, () => {
            const renderTableColumnButtonMock = jest.spyOn(
              WrapperTableInstance,
              // @ts-ignore
              'renderTableColumnButton'
            )
            const renderTableColumnMoreMock = jest.spyOn(
              WrapperTableInstance,
              // @ts-ignore
              'renderTableColumnMore'
            )
            _render(null, recordMock)

            expect(renderTableColumnButtonMock).toHaveBeenCalledTimes(
              filterOperates.slice(0, max).length
            )
            expect(renderTableColumnMoreMock).toHaveBeenCalledWith(
              filterOperates.slice(max),
              recordMock
            )
            renderTableColumnButtonMock.mockRestore()
            renderTableColumnMoreMock.mockRestore()
          })

          continue
        }
      }
    }
  })

  test('renderModalForm', () => {
    // @ts-ignore
    WrapperTableInstance.selectedBtnPath = selectedBtnPath
    const {
      pagestate,
      uniqueKey,
      onDataSourceChange,
    } = WrapperTableInstance.props
    // @ts-ignore
    const result3 = WrapperTableInstance.renderModalForm(
      pagestate,
      uniqueKey,
      onDataSourceChange
    )

    const wrapper = mount(result3)
    const WrapperModalForm = wrapper.find(HtModalForm).at(0)

    const origin = _.get(elementConfig.props, selectedBtnPath)
    const { title, text, method = 'post', fields = [], transform } = origin

    expect(WrapperModalForm.props()).toMatchObject({
      method,
      fields,
      title: title || text,
      alias: tableRowModalFormAlias,
      pagestate,
      onSuccess: WrapperTableInstance.props.onDataSourceChange,
      onSuccessAction: 'trigger:HtList.search',
    })

    const getRef = WrapperModalForm.prop('getRef')
    expect(getRef).toEqual(expect.any(Function))
    if (_.isFunction(getRef)) {
      const HtModalForm = {
        toggleModalVisible: jest.fn(),
      }
      getRef(HtModalForm)
      // @ts-ignore
      expect(WrapperTableInstance.$HtModalForm).toEqual(HtModalForm)
    }

    const rowData = _.get(pagestate, tableRowModalFormAlias)

    const _transform = WrapperModalForm.prop('transform')
    const expectTrasform = (data: any) => {
      return transformParams(uniqueKey, transform, rowData, data)
    }
    const mockData = { a: 1 }
    if (_.isFunction(_transform)) {
      expect(_transform(mockData)).toEqual(expectTrasform(mockData))
    }
  })
})

function getMap(arr: any[], key: string) {
  let map: any = {}
  for (let item of arr) {
    if (_.isString(item[key])) {
      map[item[key]] = item
    }
  }
  return map
}
