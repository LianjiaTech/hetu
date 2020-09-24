import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtDivider from '~/components/Field/components/Divider'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()

const field = {
  title: '分割线-左',
  type: 'Divider',
  orientation: 'left',
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperHtDivider = wrapper.find(HtDivider).at(0)

describe('正确的props', () => {
  test('Divider', () => {
    expect(WrapperHtDivider.prop('orientation')).toEqual(field.orientation)
    expect(WrapperHtDivider.prop('title')).toEqual(field.title)
  })
})
