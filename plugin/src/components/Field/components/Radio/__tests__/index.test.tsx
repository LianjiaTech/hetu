/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtRadio from '~/components/Field/components/Radio/index'
import {
  HtRadioProps,
  HtRadioState,
} from '~/components/Field/components/Radio/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0 = {
  field: 'sex',
  title: '性别',
  type: 'Radio',
  defaultValue: 1,
  disabled: false,
  canAddOption: true,
  optionsSourceType: 'static',
  labelField: 'name',
  valueField: 'sex',
  options: [
    {
      name: '男',
      sex: 1,
    },
    {
      name: '女',
      sex: 0,
    },
  ],
}

const field1 = {
  field: 'sex',
  title: '是否禁用',
  type: 'Radio',
  options: [
    {
      label: '是',
      value: 1,
    },
    {
      label: '否',
      value: 0,
    },
  ],
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [field0, field1],
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperRadio0 = wrapper
  .find<React.Component<HtRadioProps, HtRadioState>>(HtRadio)
  .at(0)
const WrapperRadio0Instance = WrapperRadio0.instance()

describe('正确的props', () => {
  test('props', () => {
    expect(WrapperRadio0.props()).toMatchObject({
      disabled: field0.disabled,
      labelField: field0.labelField,
      valueField: field0.valueField,
      optionsSourceType: field0.optionsSourceType,
      options: field0.options,
      canAddOption: field0.canAddOption,
    })
  })
})

describe('正确的方法', () => {
  test('formatOptions', () => {
    const options = [
      {
        id: '123',
        name: '张三李四',
      },
    ]
    const labelField = 'name'
    const valueField = 'id'
    // @ts-ignore
    const _options = WrapperRadio0Instance.formatOptions(
      options,
      labelField,
      valueField
    )
    expect(_options).toHaveLength(options.length)
    for (let i = 0; i < _options.length; i++) {
      expect(_options[i]).toMatchObject({
        label: options[i][labelField],
        value: options[i][valueField],
      })
    }
    // @ts-ignore
    const _options2 = WrapperRadio0Instance.formatOptions(
      {},
      labelField,
      valueField
    )
    expect(_options2).toEqual([])
  })

  test('onModalConfirm', () => {
    expect(WrapperRadio0Instance.state.extraOptions).toEqual([])

    WrapperRadio0Instance.setState({ isModalVisible: true })
    expect(WrapperRadio0Instance.state.isModalVisible).toEqual(true)

    const modalFormData = {
      label: 'test',
      value: 'asdfadsf',
    }
    // @ts-ignore
    WrapperRadio0Instance.onModalConfirm(modalFormData)
    expect(WrapperRadio0Instance.state.extraOptions).toEqual([modalFormData])
    expect(WrapperRadio0Instance.state.isModalVisible).toEqual(false)
  })

  test('onModalCancel', () => {
    WrapperRadio0Instance.setState({ isModalVisible: true })
    expect(WrapperRadio0Instance.state.isModalVisible).toEqual(true)
    // @ts-ignore
    WrapperRadio0Instance.onModalCancel()
    expect(WrapperRadio0Instance.state.isModalVisible).toEqual(false)
  })

  test('onModalOpen', () => {
    WrapperRadio0Instance.setState({ isModalVisible: false })
    expect(WrapperRadio0Instance.state.isModalVisible).toEqual(false)
    // @ts-ignore
    WrapperRadio0Instance.onModalOpen()
    expect(WrapperRadio0Instance.state.isModalVisible).toEqual(true)
  })
})
