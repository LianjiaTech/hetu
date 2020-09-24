/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtPickerMonth from '~/components/Field/components/PickerMonth/index'
import { HtMonthPickerProps } from '~/components/Field/components/PickerMonth/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0 = {
  field: 'month',
  title: '月份',
  type: 'MonthPicker',
  defaultValue: '2020-05',
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
  .find<React.Component<HtMonthPickerProps>>(HtPickerMonth)
  .at(0)
const WrapperDatePickerInstance = WrapperDatePicker.instance()

test('正确的props', () => {
  expect(WrapperDatePicker.props()).toEqual(
    expect.objectContaining({
      value: field0.defaultValue,
      formate: 'YYYY-MM',
    })
  )
})

test('正确的方法', () => {
  const mockDateStr = '2020-10'
  // @ts-ignore
  WrapperDatePickerInstance.onChange(null, mockDateStr)

  // @ts-ignore
  expect(WrapperDatePickerInstance.props.pagestate.$$HtForm).toHaveProperty(
    'month',
    mockDateStr
  )
})
