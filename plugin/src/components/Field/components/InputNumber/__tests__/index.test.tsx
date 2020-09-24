import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtInput from '~/components/Field/components/Input/index'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0: Field = {
  field: 'name',
  title: 'InputNumber',
  defaultValue: 3,
  disabled: true,
  placeholder: '请输入0-100之间的数值',
  // @ts-ignore
  max: 100,
  // @ts-ignore
  min: 0,
  step: 10,
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field0],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperInputs = wrapper.find(HtInput)
const WrapperInput0 = WrapperInputs.at(0)

describe('正确的props', () => {
  test('props', () => {
    expect(WrapperInputs).toHaveLength(1)
    expect(WrapperInput0.prop('value')).toEqual(field0.defaultValue)
    expect(WrapperInput0.prop('disabled')).toEqual(field0.disabled)
    expect(WrapperInput0.prop('placeholder')).toEqual(field0.placeholder)
    // @ts-ignore
    expect(WrapperInput0.prop('max')).toEqual(field0.max)
    // @ts-ignore
    expect(WrapperInput0.prop('min')).toEqual(field0.min)
    // @ts-ignore
    expect(WrapperInput0.prop('step')).toEqual(field0.step)
  })
})
