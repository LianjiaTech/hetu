import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { Hetu } from '~/Hetu'
import HtCard from '../index'
jest.mock('~/utils/actions')

const history = createBrowserHistory()

const cardType = 'default'
const title = '页面标题'
const description = '这是说明阿斯顿发哈时间快点发贺卡上绝代风华接口'
const extra = [
  {
    type: 'HtButton',
    props: {
      href: '/components/Card/',
    },
    children: ['跳转到新页面'],
  },
]
const elementConfig = {
  type: 'HtCard',
  props: {
    title: title,
    cardType: cardType,
    description: description,
    extra: extra,
  },
  children: [
    {
      type: 'HtList',
      props: {
        url: '/api/list',
        buttons: [],
        pageSize: 2,
        columns: [
          {
            title: 'id',
            dataIndex: 'id',
            width: 50,
          },
          {
            title: 'banner',
            dataIndex: 'imageUrl',
            width: 60,
            renderType: 'img',
          },
          {
            title: '预览链接',
            dataIndex: 'preview',
            width: 80,
            renderType: 'a',
          },
          {
            title: '标签',
            dataIndex: 'tags',
            width: 100,
          },
        ],
      },
    },
  ],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperCard = wrapper.find(HtCard).at(0)

describe('正确的props', () => {
  test('HtCard', () => {
    expect(WrapperCard.prop('cardType')).toEqual(cardType)
    expect(WrapperCard.prop('title')).toEqual(title)
    expect(WrapperCard.prop('description')).toEqual(description)
  })
})
