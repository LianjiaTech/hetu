import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { HtAlert } from '~/components/Field/components/Alert'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()

const field = {
  title: '提示框',
  type: 'Alert',
  message: 'lalala',
  description: '描述xxxx',
  alertType: 'success',
  showIcon: true,
  banner: true,
  closable: true,
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperHtAlert = wrapper.find(HtAlert)

describe('正确的props', () => {
  test('Alert', () => {
    expect(WrapperHtAlert.prop('title')).toEqual(field.title)
    expect(WrapperHtAlert.prop('message')).toEqual(field.message)
    expect(WrapperHtAlert.prop('banner')).toEqual(field.banner)
    expect(WrapperHtAlert.prop('alertType')).toEqual(field.alertType)
    expect(WrapperHtAlert.prop('closable')).toEqual(field.closable)
    expect(WrapperHtAlert.prop('description')).toEqual(field.description)
    expect(WrapperHtAlert.prop('showIcon')).toEqual(field.showIcon)
  })
})
