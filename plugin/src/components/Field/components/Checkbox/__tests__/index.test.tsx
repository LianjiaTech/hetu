import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import _ from 'lodash'
import React from 'react'
import HtCheckbox from '~/components/Field/components/Checkbox/index'
import {
  HtCheckboxProps,
  HtCheckboxState,
} from '~/components/Field/components/Checkbox/interface'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0: Field = {
  field: 'hobbies',
  title: '兴趣',
  type: 'Checkbox',
  // @ts-ignore
  canAddOption: true,
  labelField: 'label',
  valueField: 'value',
  options: [
    {
      label: '吃饭',
      value: 'chifang',
    },
    {
      label: '睡觉',
      value: 'shuijiao',
    },
    {
      label: '打豆豆',
      value: 'dadoudou',
    },
  ],
  defaultValue: ['shuijiao'],
  allCheck: true,
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field0],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperCheckbox0 = wrapper
  .find<React.Component<HtCheckboxProps, HtCheckboxState>>(HtCheckbox)
  .at(0)
const WrapperCheckbox0Instance = WrapperCheckbox0.at(0).instance()

describe('正确的props', () => {
  test('props', () => {
    expect(WrapperCheckbox0.prop('value')).toEqual(field0.defaultValue)
    expect(WrapperCheckbox0.prop('disabled')).toEqual(field0.disabled)

    expect(WrapperCheckbox0.prop('optionsSourceType')).toEqual(
      // @ts-ignore
      field0.optionsSourceType || 'static'
    )
    // @ts-ignore
    expect(WrapperCheckbox0.prop('options')).toEqual(field0.options)
    // @ts-ignore
    expect(WrapperCheckbox0.prop('canAddOption')).toEqual(
      // @ts-ignore
      field0.canAddOption || false
    )

    expect(WrapperCheckbox0.prop('labelField')).toEqual(
      // @ts-ignore
      field0.labelField || 'label'
    )

    expect(WrapperCheckbox0.prop('valueField')).toEqual(
      // @ts-ignore
      field0.valueField || 'value'
    )
    // @ts-ignore
    expect(WrapperCheckbox0.prop('allCheck')).toEqual(field0.allCheck || false)
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
    const _options = WrapperCheckbox0Instance.formatOptions(
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
    const _options2 = WrapperCheckbox0Instance.formatOptions(
      {},
      labelField,
      valueField
    )
    expect(_options2).toEqual([])
  })

  test('onCheckAllChange', () => {
    // @ts-ignore
    // @ts-ignore
    WrapperCheckbox0Instance.onCheckAllChange({ target: { checked: true } })
    // @ts-ignore
    const values = field0.options.map(v => v[field0.valueField])

    let formData = _.cloneDeep(
      // @ts-ignore
      WrapperCheckbox0Instance.props.pagestate.$$HtForm
    )
    expect(formData).toHaveProperty(field0.field, values)

    // @ts-ignore
    WrapperCheckbox0Instance.onCheckAllChange({ target: { checked: false } })
    // @ts-ignore
    formData = _.cloneDeep(WrapperCheckbox0Instance.props.pagestate.$$HtForm)
    expect(formData).toHaveProperty(field0.field, [])
  })

  test('onModalConfirm', () => {
    expect(WrapperCheckbox0Instance.state.extraOptions).toEqual([])

    WrapperCheckbox0Instance.setState({ isModalVisible: true })
    expect(WrapperCheckbox0Instance.state.isModalVisible).toEqual(true)

    const modalFormData = {
      label: 'test',
      value: 'asdfadsf',
    }
    // @ts-ignore
    WrapperCheckbox0Instance.onModalConfirm(modalFormData)
    expect(WrapperCheckbox0Instance.state.extraOptions).toEqual([modalFormData])
    expect(WrapperCheckbox0Instance.state.isModalVisible).toEqual(false)
  })

  test('onModalCancel', () => {
    WrapperCheckbox0Instance.setState({ isModalVisible: true })
    expect(WrapperCheckbox0Instance.state.isModalVisible).toEqual(true)

    // @ts-ignore
    WrapperCheckbox0Instance.onModalCancel()
    expect(WrapperCheckbox0Instance.state.isModalVisible).toEqual(false)
  })

  test('onModalOpen', () => {
    WrapperCheckbox0Instance.setState({ isModalVisible: false })
    expect(WrapperCheckbox0Instance.state.isModalVisible).toEqual(false)

    // @ts-ignore
    WrapperCheckbox0Instance.onModalOpen()
    expect(WrapperCheckbox0Instance.state.isModalVisible).toEqual(true)
  })
})
