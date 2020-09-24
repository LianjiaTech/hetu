import React from 'react'
import { addComponent, componentMap } from './index'

describe('componentMap', () => {
  const arr = [
    'HtForm',
    'HtList',
    'HtModalForm',
    'HtButton',
    'HtCard',
    // 'HtBChart',
    // fields 组件
    // 'HtCheckbox',
    // 'HtDatePicker',
    // 'HtMonthPicker',
    // 'HtWeekPicker',
    // 'HtRangePicker',
    // 'HtTimePicker',
    // 'HtEditableTable',
    // 'HtInput',
    // 'HtInputNumber',
    // 'HtJsonEditor',
    // 'HtUpload',
    // 'HtRadio',
    // 'HtSelect',
    // 'HtSelectCascade',
    // 'HtSelectMultiple',
    // 'HtTableEditor',
    // 'HtTreeSelect',
  ]
  for (let item of arr) {
    it(`${item}`, () => {
      expect(componentMap).toHaveProperty(item)
      // @ts-ignore
      expect(componentMap[item]).toBeInstanceOf(Function)
    })
  }
})

it('addComponent', () => {
  class C extends React.Component {
    render() {
      return null
    }
  }
  addComponent('testComponent', C)
  expect(componentMap).toHaveProperty('testComponent', C)
})
