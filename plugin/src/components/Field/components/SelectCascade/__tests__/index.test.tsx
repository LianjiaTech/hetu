/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtSelectCascade from '~/components/Field/components/SelectCascade/index'
import { HtSelectCascadeProps } from '~/components/Field/components/SelectCascade/interface'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
type SelectField = Partial<Field & HtSelectCascadeProps>

const field0: SelectField = {
  field: 'version',
  title: '级联选择',
  type: 'SelectCascade',
  defaultValue: ['java', '0.0.1'],
  showSearch: true,
  options: [
    {
      label: 'java',
      value: 'java',
      children: [
        {
          label: '0.0.1',
          value: '0.0.1',
        },
      ],
    },
    {
      label: 'javascript',
      value: 'javascript',
      children: [
        {
          label: 'es5',
          value: 'es5',
          disabled: true,
        },
        {
          label: 'es6',
          value: 'es6',
        },
      ],
    },
  ],
}

const field1: SelectField = {
  field: 'version2',
  title: '级联选择2',
  defaultValue: '',
  type: 'SelectCascade',
  showSearch: false,
  changeOnSelect: true,
  labelField: 'label',
  valueField: 'value',
  options: [],
  loadDataConfigs: [
    {
      url: '/api/tree/2',
      searchField: 'key',
    },
    {
      url: '/api/tree/3',
      searchField: 'key',
    },
    {
      url: '/api/tree/4',
      searchField: 'key',
    },
  ],
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: '/',
    buttons: [],
    fields: [field0, field1],
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperSelect0 = wrapper
  .find<React.Component<HtSelectCascadeProps>>(HtSelectCascade)
  .at(0)

const WrapperSelect1 = wrapper
  .find<React.Component<HtSelectCascadeProps>>(HtSelectCascade)
  .at(1)
const WrapperSelect0Instance = WrapperSelect0.instance()

describe('正确的props', () => {
  test('props', () => {
    expect(WrapperSelect0.props()).toMatchObject({
      value: field0.defaultValue,
      options: field0.options,
      showSearch: field0.showSearch,
    })
  })

  test('field1 的 props', () => {
    expect(WrapperSelect1.props()).toMatchObject({
      changeOnSelect: field1.changeOnSelect,
      labelField: field1.labelField,
      valueField: field1.valueField,
      loadDataConfigs: field1.loadDataConfigs,
      options: field1.options,
      showSearch: field1.showSearch,
    })
  })
})

describe('SelectCascade 的方法', () => {
  test('loadData', () => {
    // @ts-ignore
    const handleLoadData = jest.spyOn(WrapperSelect0Instance, 'loadData')
    // @ts-ignore
    WrapperSelect0Instance.loadData()
    handleLoadData.mockRestore()
  })
})
