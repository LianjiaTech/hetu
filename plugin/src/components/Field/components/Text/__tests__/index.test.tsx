import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { HtText } from '~/components/Field/components/Text'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()

const field = {
  field: 'name',
  title: 'Text',
  type: 'Text',
  defaultValue: 'lalalal',
  jsonFormat: false,
  isWrap: true,
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperText = wrapper.find(HtText)

describe('正确的props', () => {
  test('Text', () => {
    expect(WrapperText.prop('value')).toEqual(field.defaultValue)
    expect(WrapperText.prop('jsonFormat')).toEqual(field.jsonFormat)
    expect(WrapperText.prop('isWrap')).toEqual(field.isWrap)
  })
})

describe('正确的方法', () => {
  test('render', () => {
    if (field.jsonFormat) {
      expect(WrapperText.prop('jsonFormat')).toEqual(field.jsonFormat)
    }
    if (field.isWrap) {
      expect(WrapperText.prop('isWrap')).toEqual(field.isWrap)
    }
  })
})
