/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtPickerTime from '~/components/Field/components/PickerTime/index'
import { HtTimePickerProps } from '~/components/Field/components/PickerTime/interface'
import { Hetu } from '~/Hetu'
const history = createBrowserHistory()

const field0 = {
  field: 'time',
  title: '时间',
  type: 'TimePicker',
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
  .find<React.Component<HtTimePickerProps>>(HtPickerTime)
  .at(0)
const WrapperDatePickerInstance = WrapperDatePicker.instance()

test('正确的props', () => {
  expect(WrapperDatePicker.props()).toEqual(
    expect.objectContaining({
      format: 'HH:mm:ss',
    })
  )
})

test('正确的方法', () => {
  const mockDateStr = '04:00:12'
  // @ts-ignore
  WrapperDatePickerInstance.onChange(null, mockDateStr)

  // @ts-ignore
  expect(WrapperDatePickerInstance.props.pagestate.$$HtForm).toHaveProperty(
    'time',
    mockDateStr
  )
})
