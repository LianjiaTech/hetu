/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtPickerRange from '~/components/Field/components/PickerRange/index'
import { HtRangePickerProps } from '~/components/Field/components/PickerRange/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const field0 = {
  field: 'rangeTime',
  title: '日期范围',
  type: 'RangePicker',
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
  .find<React.Component<HtRangePickerProps>>(HtPickerRange)
  .at(0)
const WrapperDatePickerInstance = WrapperDatePicker.instance()

test('正确的props', () => {
  expect(WrapperDatePicker.props()).toEqual(
    expect.objectContaining({
      format: 'YYYY-MM-DD HH:mm:ss',
      ranges: expect.any(Object),
    })
  )
})

describe('正确的方法', () => {
  test('onChange', () => {
    const mockDateStrs = ['2019-12-01 12:12:00', '2020-12-01 12:12:00']
    // @ts-ignore
    WrapperDatePickerInstance.onChange(null, mockDateStrs)

    // @ts-ignore
    expect(WrapperDatePickerInstance.props.pagestate.$$HtForm).toHaveProperty(
      'rangeTime',
      mockDateStrs
    )
  })
})
