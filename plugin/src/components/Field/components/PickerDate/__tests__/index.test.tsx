/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtPickerDate from '~/components/Field/components/PickerDate/index'
import { HtDatePickerProps } from '~/components/Field/components/PickerDate/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0 = {
  field: 'date',
  title: '日期',
  type: 'DatePicker',
  defaultValue: '2020-01-01',
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [field0],
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperDatePicker = wrapper
  .find<React.Component<HtDatePickerProps>>(HtPickerDate)
  .at(0)
const WrapperDatePickerInstance = WrapperDatePicker.instance()

test('正确的props', () => {
  expect(WrapperDatePicker.props()).toEqual(
    expect.objectContaining({
      value: field0.defaultValue,
    })
  )
})

test('正确的方法', () => {
  const mockDateStr = '2050-10-10'
  // @ts-ignore
  WrapperDatePickerInstance.onChange(null, mockDateStr)

  // @ts-ignore
  expect(WrapperDatePickerInstance.props.pagestate.$$HtForm).toHaveProperty(
    'date',
    mockDateStr
  )
})
