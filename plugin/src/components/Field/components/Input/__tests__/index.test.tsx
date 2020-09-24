import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtInput from '~/components/Field/components/Input/index'
import HtField from '~/components/Field/index'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0: Field = {
  field: 'name',
  title: 'Input',
  defaultValue: 'lalalal',
  disabled: true,
}

const field1: Field = {
  field: 'desc',
  title: 'Input.TextArea',
  type: 'Input.TextArea',
  // @ts-ignore
  rows: 6,
  disabled: false,
}

const field2: Field = {
  field: 'psw',
  title: 'Input.Password',
  type: 'Input.Password',
  disabled: false,
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field0, field1, field2],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperInput = wrapper.find(HtInput).at(0)
const WrapperInputTextArea = wrapper.find(HtInput.TextArea).at(0)
const WrapperInputPassword = wrapper.find(HtInput.Password).at(0)

describe('正确的props', () => {
  test('fields', () => {
    expect(wrapper.find(HtField)).toHaveLength(3)
  })

  test('Input', () => {
    expect(WrapperInput.prop('value')).toEqual(field0.defaultValue)
    expect(WrapperInput.prop('disabled')).toEqual(field0.disabled)
  })

  test('Input.TextArea', () => {
    expect(WrapperInputTextArea.prop('value')).toEqual(field1.defaultValue)
    expect(WrapperInputTextArea.prop('disabled')).toEqual(field1.disabled)
    // @ts-ignore
    expect(WrapperInputTextArea.prop('rows')).toEqual(field1.rows)
  })

  test('Input.Password', () => {
    expect(WrapperInputPassword.prop('value')).toEqual(field2.defaultValue)
    expect(WrapperInputPassword.prop('disabled')).toEqual(field2.disabled)
  })
})
