import { DatePicker } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { HtMonthPickerProps } from './interface'

const { MonthPicker } = DatePicker

@observer
export default class HtMonthPicker extends Component<HtMonthPickerProps> {
  static displayName = 'HtMonthPicker'

  static defaultProps = {
    onChange: () => {},
    formate: 'YYYY-MM',
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
      <MonthPicker
        value={value ? moment(value, format) : undefined}
        onChange={this.onChange}
        defaultValue={defaultValue ? moment(defaultValue, format) : undefined}
        format={format}
        {...rest}
      />
    )
  }
}
