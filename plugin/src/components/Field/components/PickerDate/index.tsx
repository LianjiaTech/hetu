import { DatePicker } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

import './index.less'
import { HtDatePickerProps } from './interface'

@observer
export default class HtDatePicker extends Component<HtDatePickerProps> {
  static displayName = 'HtDatePicker'

  static defaultProps = {
    onChange: () => {},
  }

  state = {}

  onChange = (_date: any, dateString: string) => {
    const { onChange } = this.props
    onChange(dateString)
  }

  render() {
    const {
      value,
      defaultValue,
      format,
      onChange,
      pagestate,
      ...rest
    } = this.props

    return (
      <DatePicker
        value={value ? moment(value, format) : undefined}
        onChange={this.onChange}
        defaultValue={defaultValue ? moment(defaultValue, format) : undefined}
        format={format}
        {...rest}
      />
    )
  }
}
