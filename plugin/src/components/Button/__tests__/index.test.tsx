import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { Hetu } from '~/Hetu'
import { _resolveAction } from '~/utils/actions'
import HtButton from '../index'
import { HtButtonComponentProps } from '../interface'

jest.mock('~/utils/actions')

const history = createBrowserHistory()

const elementConfig = {
  type: 'div',
  props: {},
  children: [
    {
      type: 'HtButton',
      props: {
        type: 'primary',
        href: 'http://hetu.com',
        text: '点我',
      },
      children: [],
    },
    {
      type: 'HtButton',
      props: {
        href: '/detail',
        text: '详情',
      },
      children: [],
    },
    {
      type: 'HtButton',
      props: {
        type: 'primary',
        href: '/detail3',
        text: '点我',
      },
      children: [],
    },
    {
      type: 'HtButton',
      props: {
        type: 'primary',
        href: '/detail4',
        text: '点我',
        useH5Href: true,
      },
      children: [],
    },
    {
      type: 'HtButton',
      props: {
        type: 'primary',
        href: '/detail5',
        text: '点我',
        linkTarget: true,
      },
      children: [],
    },
    {
      type: 'HtButton',
      props: {
        type: 'primary',
        to: '/detail6',
        text: '点我',
      },
      children: [],
    },
  ],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperButton0 = wrapper.find(HtButton).at(0)

test('正确的props', () => {
  expect(WrapperButton0.prop('data-component-type')).toEqual('HtButton')
})

describe('HtButton', () => {
  it('正确的DOM结构', () => {
    const htmlStr = wrapper.html()
    expect(htmlStr).toMatch(/data-component-type="HtButton"/)
    expect(htmlStr).toMatch(/data-pageconfig-path="elementConfig"/)
    expect(htmlStr).toMatch(/<span>点我<\/span>/)
  })

  it('href为相对路径, 使用push跳转', () => {
    const WrapperButton2 = wrapper.find(HtButton).at(2)
    // @ts-ignore
    const push = jest.spyOn(WrapperButton2.instance(), 'push')
    wrapper
      .find('.ht-btn')
      .at(2)
      .simulate('click')
    expect(push).toHaveBeenCalledWith('/detail3')
    push.mockRestore()
  })

  it('href 相对路径并且useH5Href为true, 使用h5原生跳转', () => {
    const WrapperButton3 = wrapper.find(HtButton).at(2)

    // @ts-ignore
    const push = jest.spyOn(WrapperButton3.instance(), 'push')
    wrapper
      .find('.ht-btn')
      .at(3)
      .simulate('click')
    expect(push).not.toHaveBeenCalledWith('/detail4')
    push.mockRestore()
  })
})

describe('正确的方法 onClick', () => {
  it('with (href & linkTarget)', () => {
    const WrapperButton4 = wrapper
      .find<React.Component<HtButtonComponentProps>>(HtButton)
      .at(4)
    // @ts-ignore
    WrapperButton4.instance().onClick()
    expect(_resolveAction).toHaveBeenCalledWith(
      'openWindow',
      elementConfig.children[4].props.href,
      WrapperButton4.instance().props.pagestate
    )
  })

  it('href', () => {
    const WrapperButton0 = wrapper
      .find<React.Component<HtButtonComponentProps>>(HtButton)
      .at(0)
    // @ts-ignore
    WrapperButton0.instance().onClick()
    expect(_resolveAction).toHaveBeenCalledWith(
      'redirectTo',
      elementConfig.children[0].props.href,
      WrapperButton0.instance().props.pagestate
    )
  })
})
