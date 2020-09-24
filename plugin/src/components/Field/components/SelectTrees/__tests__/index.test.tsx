import { sleep } from '@test/utils'
import { TreeSelect } from 'antd'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import axiosMock from 'jest-mock-axios'
import _ from 'lodash'
import React from 'react'
import HtSelectTree from '~/components/Field/components/SelectTrees/index'
import {
  HtSelectTreeProps,
  HtSelectTreeState,
} from '~/components/Field/components/SelectTrees/interface'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const TreeNode = TreeSelect.TreeNode
type SelectField = Partial<Field & HtSelectTreeProps>

const local = {
  cityOptions: [
    {
      title: '全城范围',
      value: 'all',
      searchable: false,
      selectable: true,
      disabled: false,
    },
    {
      title: '北京',
      value: '110000',
      searchable: true,
      selectable: true,
      disabled: false,
    },
    {
      title: '广州',
      value: '120000',
      searchable: true,
      selectable: true,
      disabled: true,
    },
  ],
}

const field0: SelectField = {
  field: 'tree1',
  title: '树选择器-单选',
  type: 'SelectTrees',
  showSearch: true,
  treeCheckable: false,
  labelField: 'title',
  valueField: 'value',
  defaultValue: [],
  optionsSourceType: 'all',
  searchConfigs: [
    {
      url: '/mock/api/tree/all',
      searchField: 'key',
      params: {},
      transform: data => data,
    },
  ],
}

const field1: SelectField = {
  field: 'tree2',
  title: '树选择器-多选',
  type: 'SelectTrees',
  showSearch: true,
  treeCheckable: true,
  labelField: 'title',
  valueField: 'value',
  optionsSourceType: 'all',
  searchConfigs: [
    {
      url: '/mock/api/tree/all',
      searchField: 'key',
    },
  ],
}

const field2: SelectField = {
  field: 'tree3',
  title: '单选回显',
  type: 'SelectTrees',
  showSearch: true,
  treeCheckable: false,
  labelField: 'title',
  valueField: 'value',
  optionsSourceType: 'dependencies',
  searchConfigs: [
    {
      url: '/mock/api/tree/all',
      searchField: '',
      params: {},
    },
  ],
  placeholder: '请输入单选回显',
  tooltip: 'xxx',
  defaultValue: [
    {
      title: 'sss',
      value: '123',
    },
  ],
  required: false,
  disabled: false,
  showCheckedStrategy: 'SHOW_ALL',
  // @ts-ignore
  treeData: '<%:= cityOptions %>',
}
const field3: SelectField = {
  field: 'tree4',
  title: '异步加载可以保存父子关系',
  type: 'SelectTrees',
  showSearch: true,
  treeCheckable: true,
  labelField: 'title',
  valueField: 'value',
  optionsSourceType: 'async',
  searchConfigs: [
    {
      url: '/mock/api/tree/1',
      searchField: 'key',
      params: {},
    },
    {
      url: '/mock/api/tree/2',
      searchField: 'key',
      params: {},
    },
    {
      url: '/mock/api/tree/3',
      searchField: '',
      params: {},
    },
  ],
  placeholder: '',
  tooltip: '',
  defaultValue: [
    {
      title: '大区2',
      value: '110000>>>shiyebu1>>>daqu2',
    },
  ],
  required: false,
  disabled: false,
  showCheckedStrategy: 'SHOW_PARENT',
  nodePath: true,
  splitTag: '>>>',
}
const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [field0, field1, field2, field3],
  },
  children: [],
}

const wrapper = mount(
  <Hetu elementConfig={elementConfig} history={history} local={local} />
)
const WrapperSelect0 = wrapper
  .find<React.Component<HtSelectTreeProps, HtSelectTreeState>>(HtSelectTree)
  .at(0)
const WrapperSelect1 = wrapper
  .find<React.Component<HtSelectTreeProps, HtSelectTreeState>>(HtSelectTree)
  .at(1)
const WrapperSelect2 = wrapper
  .find<React.Component<HtSelectTreeProps, HtSelectTreeState>>(HtSelectTree)
  .at(2)
const WrapperSelect3 = wrapper
  .find<React.Component<HtSelectTreeProps, HtSelectTreeState>>(HtSelectTree)
  .at(3)
const WrapperSelect1Instance = WrapperSelect1.instance()
const WrapperSelect2Instance = WrapperSelect2.instance()

describe('正确的props', () => {
  test('defaultValue & value', () => {
    expect(WrapperSelect0.prop('value')).toEqual(field0.defaultValue)
  })

  test('disabled', () => {
    expect(WrapperSelect0.prop('disabled')).toEqual(field0.disabled || false)
  })

  test('showSearch', () => {
    expect(WrapperSelect0.prop('showSearch')).toEqual(
      field0.showSearch || false
    )
  })

  test('treeData', () => {
    expect(WrapperSelect0.prop('treeData')).toEqual(field0.treeData || [])
  })

  test('searchConfigs', () => {
    expect(WrapperSelect1.prop('searchConfigs')).toEqual(field1.searchConfigs)
  })

  test('treeCheckable', () => {
    expect(WrapperSelect1.prop('treeCheckable')).toEqual(field1.treeCheckable)
  })

  test('optionsSourceType', () => {
    expect(WrapperSelect1.prop('optionsSourceType')).toEqual(
      field1.optionsSourceType
    )
  })

  test('labelField', () => {
    expect(WrapperSelect1.prop('labelField')).toEqual(field1.labelField)
  })

  test('valueField', () => {
    expect(WrapperSelect1.prop('valueField')).toEqual(field1.valueField)
  })

  test('placeholder', () => {
    expect(WrapperSelect2.prop('placeholder')).toEqual(field2.placeholder)
  })

  test('showCheckedStrategy', () => {
    expect(WrapperSelect2.prop('showCheckedStrategy')).toEqual(
      field2.showCheckedStrategy
    )
  })

  test('splitTag', () => {
    expect(WrapperSelect3.prop('splitTag')).toEqual(field3.splitTag)
  })

  test('nodePath', () => {
    expect(WrapperSelect3.prop('nodePath')).toEqual(field3.nodePath)
  })
})

describe('正确的方法', () => {
  test('componentDidMount optionsSourceType 为 dependencies', () => {
    const mockSetState = jest.spyOn(WrapperSelect2Instance, 'setState')
    // @ts-ignore
    WrapperSelect2Instance.componentDidMount()
    expect(mockSetState).toHaveBeenCalledTimes(1)
    mockSetState.mockRestore()
  })

  test('componentDidMount searchConfigs', () => {
    // @ts-ignore
    const requestData = jest.spyOn(WrapperSelect0.instance(), 'requestData')
    // @ts-ignore
    WrapperSelect0.instance().componentDidMount()
    expect(requestData).toHaveBeenCalledTimes(1)
    requestData.mockRestore()
  })

  test('requestData', () => {
    // @ts-ignore
    const res = WrapperSelect1Instance.requestData('aaa')

    // @ts-ignore
    const targetUrl = field1.searchConfigs[0].url || 'xxxasdfasdf'
    const requestInfo = axiosMock.getReqByUrl(targetUrl)
    expect(requestInfo.config.params).toMatchObject({
      key: 'aaa',
    })

    const mockResponse = {
      status: 200,
      data: { code: 0, data: [{ AAA: 1324 }] },
    }
    axiosMock.mockResponseFor(targetUrl, mockResponse)

    return expect(res).resolves.toEqual(mockResponse.data.data)
  })

  test('onLoadData', async () => {
    // @ts-ignore
    const mockRequestData = jest.spyOn(WrapperSelect3.instance(), 'requestData')
    const dataRef = {
      disabled: false,
      searchable: true,
      selectable: true,
      title: '北京',
      value: '110000',
    }
    // @ts-ignore
    WrapperSelect3.instance().onLoadData(dataRef)
    await sleep(10)
    expect(mockRequestData).toBeCalledTimes(0)
    // @ts-ignore
    mockRequestData.mockRestore()
  })

  test('onTreeExpand', () => {
    const expandedKeys = ['x', 'yu', 'z']
    // @ts-ignore
    WrapperSelect1Instance.onTreeExpand(expandedKeys)
    expect(WrapperSelect1Instance.state.expandedKeys).toEqual(expandedKeys)
  })

  describe('renderTreeNodes', () => {
    const originData = [
      {
        key: '0-0',
        title: 'Node1',
        value: '0-0',
        children: [
          { title: 'Node1-1', value: '0-0-0', key: '0-0-0', disabled: true },
        ],
      },
      {
        title: '叶子节点',
        value: '1',
        key: '1',
        isLeaf: true,
      },
    ]
    // @ts-ignore
    const _nodes = WrapperSelect1Instance.renderTreeNodes(originData)
    test('lenght', () => {
      expect(_nodes).toHaveLength(originData.length)
    })

    function checkNodes(nodes: any[], data: any[], parentKey = '') {
      if (_.isArray(nodes)) {
        let i = 0
        for (let item of nodes) {
          let itemData = data[i]
          test(`${parentKey} nodes[${i}]`, () => {
            expect(item.type).toEqual(TreeNode)
            expect(item.key).toEqual(itemData.key)
            expect(item.props).toMatchObject({
              title: itemData.title,
              value: itemData.value,
              dataRef: itemData,
            })
            if (itemData.isLeaf !== undefined) {
              expect(item.props.isLeaf).toEqual(itemData.isLeaf)
            }
            if (itemData.disabled !== undefined) {
              expect(item.props.disabled).toEqual(itemData.disabled)
            }
          })
          if (_.isArray(itemData.children)) {
            test(`${parentKey} nodes[${i}].children`, () => {
              checkNodes(item.children, itemData.children, itemData.key)
            })
          }
          i++
        }
      }
    }
    checkNodes(_nodes, originData)
  })

  describe('onChange', () => {
    test('onChange 单选', () => {
      const value = [{ label: '昌平区', value: 'cq' }]
      // @ts-ignore
      WrapperSelect2Instance.onChange(value)
      expect(WrapperSelect2.prop('labelField')).toEqual('title')
      expect(WrapperSelect2.prop('valueField')).toEqual('value')

      const value1 = 'aaa'
      try {
        // @ts-ignore
        WrapperSelect2Instance.onChange(value1)
      } catch (error) {
        expect(error.message).toEqual(`格式错误: value is not a string`)
      }
    })

    test('onChange 多选', () => {
      const value = [
        { label: '昌平区', value: 'cq' },
        { label: '海淀区', value: 'hd' },
      ]
      // @ts-ignore
      WrapperSelect1Instance.onChange(value)
      expect(WrapperSelect1.prop('labelField')).toEqual('title')
      expect(WrapperSelect1.prop('valueField')).toEqual('value')

      const value1 = 'xxx'
      try {
        // @ts-ignore
        WrapperSelect1Instance.onChange(value1)
      } catch (error) {
        expect(error.message).toEqual(`格式错误: value is not an array`)
      }
    })
  })
})
