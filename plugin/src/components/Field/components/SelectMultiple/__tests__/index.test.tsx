/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtSelect from '~/components/Field/components/Select/index'
import {
  HtSelectProps,
  HtSelectState,
} from '~/components/Field/components/Select/interface'
import HtSelectMultiple from '~/components/Field/components/SelectMultiple/index'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
type SelectField = Partial<Field & HtSelectProps>

const field0: SelectField = {
  field: 'hobbies',
  title: '兴趣',
  type: 'SelectMultiple',
  options: [
    {
      label: '吃饭',
      value: '1',
    },
    {
      label: '睡觉',
      value: '2',
    },
    {
      label: '打豆豆',
      value: '3',
    },
  ],
  defaultValue: ['1', '2'],
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
const WrapperSelectMultiple0 = wrapper
  .find<React.Component<HtSelectProps, HtSelectState>>(HtSelectMultiple)
  .at(0)

const WrapperSelect0 = WrapperSelectMultiple0.find(HtSelect)

describe('正确的props', () => {
  test('props', () => {
    expect(WrapperSelect0.props()).toMatchObject({
      isMultiple: true,
    })
  })
  for (let key in field0) {
    if (Object.prototype.hasOwnProperty.call(field0, key)) {
      switch (key) {
        case 'defaultValue':
        case 'field':
        case 'title':
        case 'type':
          break
        default:
          test(`props ${key}`, () => {
            // @ts-ignore
            expect(WrapperSelect0.prop(key)).toEqual(field0[key])
          })
      }
    }
  }
})
