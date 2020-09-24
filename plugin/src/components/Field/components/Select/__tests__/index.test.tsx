/* eslint-disable no-template-curly-in-string */
import { sleep } from '@test/utils'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import MockAxios from 'jest-mock-axios'
import React from 'react'
import HtSelect from '~/components/Field/components/Select/index'
import {
  HtSelectProps,
  HtSelectState,
} from '~/components/Field/components/Select/interface'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
type SelectField = Partial<Field & HtSelectProps>

const local = {
  remotehobbies_options: [
    {
      label: 'test',
      value: 1234,
    },
  ],
}

const field0: SelectField = {
  field: 'hobby',
  title: '兴趣',
  type: 'Select',
  showSearch: true,
  disabled: false,
  required: false,
  isCheckAll: true,
  labelInValue: false,
  options: [
    {
      label: '吃饭',
      value: '1',
    },
    {
      label: '睡觉',
      value: '2',
    },
    {
      label: '打豆豆',
      value: '3',
    },
  ],
  defaultValue: 1,
}

const field1: SelectField = {
  field: 'remotehobbies',
  title: '远程搜索',
  type: 'Select',
  defaultValue: 'status_key',
  labelField: 'name',
  valueField: 'value',
  tooltip: 'searchOnFocus为true',
  optionsSourceType: 'remote',
  showSearch: true,
  searchOnFocus: true,
  placeholder: '输入关键字搜索',
  remote: true,
  optionsConfig: {
    url: '/api/sugs',
    field: 'serachKey',
    params: {
      aaa: 1,
    },
  },
}

const field2: SelectField = {
  field: 'remotehobbies',
  title: '远程搜索',
  type: 'Select',
  optionsSourceType: 'dependencies',
  // @ts-ignore
  optionsDependencies: '<%:= remotehobbies_options %>',
}

const field3: SelectField = {
  field: 'remotehobbies',
  title: '远程搜索',
  type: 'Select',
  isMultiple: true,
  isCheckAll: true,
  optionsSourceType: 'dependencies',
  // @ts-ignore
  optionsDependencies: '<%:= remotehobbies_options %>',
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
  <Hetu elementConfig={elementConfig} local={local} history={history} />
)
const WrapperSelect0 = wrapper
  .find<React.Component<HtSelectProps, HtSelectState>>(HtSelect)
  .at(0)

const WrapperSelect0Instance = WrapperSelect0.instance()
const WrapperSelect1 = wrapper
  .find<React.Component<HtSelectProps, HtSelectState>>(HtSelect)
  .at(1)
const WrapperSelect1Instance = WrapperSelect1.instance()
const WrapperSelect2 = wrapper
  .find<React.Component<HtSelectProps, HtSelectState>>(HtSelect)
  .at(2)

describe('正确的props', () => {
  test('props', () => {
    expect(WrapperSelect0.props()).toMatchObject({
      value: field0.defaultValue,
      disabled: field0.disabled,
      labelField: field0.labelField || 'label',
      valueField: field0.valueField || 'value',
      optionsSourceType: 'static',
      options: field0.options,
      showIcon: field0.showIcon || false,
      searchOnFocus: field0.searchOnFocus || true,
      isMultiple: field0.isMultiple || false,
      labelInValue: field0.labelInValue || false,
      isCheckAll: field0.isCheckAll || false,
    })
  })

  test(`props remote`, () => {
    expect(WrapperSelect1.props()).toMatchObject({
      remote: field1.remote,
      optionsSourceType: 'remote',
      optionsConfig: field1.optionsConfig,
    })
  })

  test(`props dependencies`, () => {
    expect(WrapperSelect2.props()).toMatchObject({
      optionsSourceType: 'dependencies',
      optionsDependencies: local.remotehobbies_options,
    })
  })
})

describe('正确的方法', () => {
  test('componentDidMount', () => {
    // @ts-ignore
    const handleSearchMock = jest.spyOn(WrapperSelect0Instance, 'handleSearch')
    // @ts-ignore
    WrapperSelect0Instance.componentDidMount()
    expect(handleSearchMock).toHaveBeenCalledTimes(1)
    handleSearchMock.mockRestore()
  })

  test('formatOptions', () => {
    const options = [
      {
        id: '123',
        name: '张三李四',
        icon: 'add',
      },
    ]
    const labelField = 'name'
    const valueField = 'id'
    // @ts-ignore
    const _options = WrapperSelect0Instance.formatOptions(
      options,
      labelField,
      valueField
    )
    expect(_options).toHaveLength(options.length)
    for (let i = 0; i < _options.length; i++) {
      expect(_options[i]).toMatchObject({
        label: options[i][labelField],
        value: options[i][valueField],
        icon: options[i].icon,
      })
    }
    // @ts-ignore
    const _options2 = WrapperSelect0Instance.formatOptions(
      {},
      labelField,
      valueField
    )
    expect(_options2).toEqual([])
  })

  test('handleSearch', async () => {
    const searchString = 'testsearch'
    // @ts-ignore
    WrapperSelect1Instance.handleSearch(searchString)
    const targetUrl = field1.optionsConfig?.url

    if (targetUrl) {
      const requestInfo = MockAxios.getReqByUrl(targetUrl)

      expect(requestInfo.config.params).toMatchObject({
        [field1.optionsConfig?.field || 'keyLike']: searchString,
        ...field1.optionsConfig?.params,
      })

      const mockResponse = {
        status: 200,
        data: {
          code: 0,
          data: [
            {
              name: 'aaa',
              value: 111,
            },
          ],
        },
      }
      MockAxios.mockResponseFor(targetUrl, mockResponse)

      await sleep(10)
      expect(WrapperSelect1Instance.state.plainOptions).toEqual(
        mockResponse.data.data
      )
    }
  })

  test('onFocus', () => {
    // @ts-ignore
    const handleSearchMock = jest.spyOn(WrapperSelect1Instance, 'handleSearch')
    // @ts-ignore
    WrapperSelect1Instance.onFocus()

    if (field1.remote && field1.optionsConfig && field1.searchOnFocus)
      expect(handleSearchMock).toHaveBeenCalledTimes(1)
    handleSearchMock.mockRestore()
  })

  test('onCheckChange', () => {
    const handleCheckChange = jest.spyOn(
      WrapperSelect0Instance,
      // @ts-ignore
      'onCheckChange'
    )
    // @ts-ignore
    WrapperSelect0Instance.onCheckChange()

    handleCheckChange.mockRestore()
  })
})

describe('正确的 isMultiple', () => {
  it('isMultiple', () => {
    const WrapperSelect4 = wrapper
      .find<React.Component<HtSelectProps, HtSelectState>>(HtSelect)
      .at(3)
    expect(WrapperSelect4.prop('isMultiple')).toEqual(field3.isMultiple)
  })
  it('isCheckAll', () => {})
})
