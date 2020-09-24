/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtPickerWeek from '~/components/Field/components/PickerWeek/index'
import { HtWeekPickerProps } from '~/components/Field/components/PickerWeek/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0 = {
  field: 'week',
  title: '周',
  type: 'WeekPicker',
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
  .find<React.Component<HtWeekPickerProps>>(HtPickerWeek)
  .at(0)
const WrapperDatePickerInstance = WrapperDatePicker.instance()

test('正确的props', () => {
  expect(WrapperDatePicker.props()).toEqual(
    expect.objectContaining({
      format: 'YYYY-WW',
    })
  )
})

test('正确的方法', () => {
  const mockDateStr = '2020-12'
  // @ts-ignore
  WrapperDatePickerInstance.onChange(null, mockDateStr)

  // @ts-ignore
  expect(WrapperDatePickerInstance.props.pagestate.$$HtForm).toHaveProperty(
    'week',
    mockDateStr
  )
})
