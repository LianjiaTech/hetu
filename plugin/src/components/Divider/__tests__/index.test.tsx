import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtDivider from '~/components/Divider'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()

const title = '分割线'
const orientation = 'center'

const elementConfig = {
  type: 'HtDivider',
  props: {
    type: 'horizontal',
    title,
    orientation,
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperHtDivider = wrapper.find(HtDivider).at(0)

describe('正确的props', () => {
  test('Divider', () => {
    expect(WrapperHtDivider.prop('orientation')).toEqual(orientation)
    expect(WrapperHtDivider.prop('title')).toEqual(title)
  })
})
