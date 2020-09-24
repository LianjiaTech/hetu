/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import moment from 'moment'
import React from 'react'
import { Hetu, HetuProps, HetuState, pagestateCache } from '~/Hetu'

const history = createBrowserHistory()

const elementConfig = {
  type: 'HtButton',
  props: {
    type: 'primary',
    href: 'http://hetu.com',
    text: '点我',
  },
}

const local = {
  id: '<%:= 1 %>',
}

const Wrapper = mount<React.Component<HetuProps, HetuState>>(
  <Hetu elementConfig={elementConfig} history={history} local={local} />
)

const instance = Wrapper.instance()

describe('pagestate', () => {
  // @ts-ignore
  const pagestate = pagestateCache[instance.state.hash]
  test('moment', () => {
    // @ts-ignore
    expect(pagestate.moment).toEqual(moment)
  })

  test('local', () => {
    expect(pagestate).toHaveProperty('id', 1)
  })
})
