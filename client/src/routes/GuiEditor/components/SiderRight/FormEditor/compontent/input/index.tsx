// 在实际操作中, 输入数据可能既可以是数字, 有可能是字符串, 因此需要一个订制的输入组件

import React, { Component } from 'react'
import { InputNumber, Input } from 'antd'
import _ from 'lodash'
import { isJavascriptStr2 } from '~/utils'

interface FormInputState {
  mode: 'number' | 'string' | 'javascript'
}
interface FormInputProps {
  value?: any
  disabled: boolean
  multipleMode?: boolean
  defaultMode?: 'number' | 'string' | 'javascript'
  placeholder?: string
  autoSize?: {
    minRows?: number
    maxRows?: number
  },

}

import './index.less'

export default class FormInput extends Component<FormInputProps, FormInputState> {
  static defaultProps = {
    // 默认是字符串类型
    defaultMode: 'string',
    // 默认单模式
    multipleMode: true,
  }

  state = {
    mode: this.props.defaultMode || 'string',
  }

  render() {
    const { mode } = this.state
    const { value: _value, multipleMode, defaultMode, autoSize, placeholder, ...otherProps } = this.props

    let value = _value
    if (_.isString(value) && isJavascriptStr2(value)) {
      value = value.slice(1, value.length - 1)
    }

    if (mode === 'number') {
      return (
        <div className="FormInput-div">
          <InputNumber value={value} {...otherProps} />
        </div>
      )
    }

    if (mode === 'javascript') {
      return (< div className="FormInput-div" >
        <Input.TextArea value={value} autoSize={autoSize || { minRows: 2, maxRows: 6 }} placeholder={placeholder} {...otherProps} />
      </div >)
    }

    return (
      <div className="FormInput-div">
        <Input.TextArea value={value} autoSize={autoSize || { minRows: 1, maxRows: 4 }} placeholder={placeholder} {...otherProps} />
      </div>
    )
  }
}
