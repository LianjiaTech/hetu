import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import axiosMock from 'jest-mock-axios'
import React from 'react'
import HtSelectTree from '~/components/Field/components/SelectTree/index'
import {
  HtSelectTreeProps,
  HtSelectTreeState,
} from '~/components/Field/components/SelectTree/interface'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
type SelectField = Partial<Field & HtSelectTreeProps>

const remote = {
  cityOptions: {
    url: '/api/tree/1',
    searchField: 'key',
  },
}

const field0: SelectField = {
  field: 'tree1',
  title: '树选择器-单选',
  type: 'SelectTree',
  showSearch: true,
  treeCheckable: false,
  labelField: 'title',
  valueField: 'value',
  defaultValue: [],
  optionsSourceType: 'all',
  searchConfigs: [
    {
      url: '/api/tree/all',
      searchField: 'key',
    },
  ],
}

const field1: SelectField = {
  field: 'tree2',
  title: '树选择器-多选',
  type: 'SelectTree',
  showSearch: true,
  treeCheckable: true,
  labelField: 'title',
  valueField: 'value',
  optionsSourceType: 'all',
  searchConfigs: [
    {
      url: '/api/tree/all',
      searchField: 'key',
    },
  ],
}

const field2: SelectField = {
  field: 'tree3',
  title: '单选回显',
  type: 'SelectTree',
  showSearch: true,
  treeCheckable: false,
  labelField: 'title',
  valueField: 'value',
  optionsSourceType: 'dependencies',
  searchConfigs: [
    {
      url: '/api/tree/all',
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
  showCheckedStrategy: 'SHOW_PARENT',
  // @ts-ignore
  treeData: '<%:= list %>',
}
const field3: SelectField = {
  field: 'tree4',
  title: '异步加载可以保存父子关系',
  type: 'SelectTree',
  showSearch: true,
  treeCheckable: true,
  labelField: 'title',
  valueField: 'value',
  optionsSourceType: 'async',
  searchConfigs: [
    {
      url: '/api/tree/1',
      searchField: 'key',
      params: {},
    },
    {
      url: '/api/tree/2',
      searchField: 'key',
      params: {},
    },
    {
      url: '/api/tree/3',
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
  <Hetu elementConfig={elementConfig} history={history} remote={remote} />
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
})

describe('正确的方法', () => {
  test('componentDidMount', () => {
    const optionsSourceType = WrapperSelect2Instance.props.optionsSourceType
    const searchConfigs = WrapperSelect2Instance.props.searchConfigs || []
    // @ts-ignore
    WrapperSelect2Instance.componentDidMount()

    if (optionsSourceType === 'dependencies') {
      WrapperSelect2Instance.setState({
        treeData: WrapperSelect2Instance.props.treeData,
      })
    } else {
      if (searchConfigs.length) {
        // @ts-ignore
        const requestData = jest.spyOn(WrapperSelect2Instance, 'requestData')
        expect(requestData).toHaveBeenCalledTimes(1)
      }
    }
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

  test('onLoadData', () => {})
  test('onTreeExpand', () => {})
  test('renderTreeNodes', () => {})
  test('onChange', () => {})
})
