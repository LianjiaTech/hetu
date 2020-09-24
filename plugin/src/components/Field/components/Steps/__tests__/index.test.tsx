import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtSteps from '~/components/Field/components/Steps'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()

const field = {
  field: 'name',
  title: '步骤条',
  type: 'Steps',
  current: 0,
  initial: 0,
  direction: 'horizontal',
  steps: [
    {
      title: 'title1',
      description: 'description1',
    },
    {
      title: 'title2',
      description: 'description2',
    },
    {
      title: 'title3',
      description: 'description3',
    },
  ],
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperSteps = wrapper.find(HtSteps)

describe('正确的props', () => {
  test('Steps', () => {
    expect(WrapperSteps.prop('current')).toEqual(field.current)
    expect(WrapperSteps.prop('initial')).toEqual(field.initial)
    expect(WrapperSteps.prop('direction')).toEqual(field.direction)
    expect(WrapperSteps.prop('steps')).toEqual(field.steps)
  })
})
