import { DatePicker } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { HtWeekPickerProps } from './interface'

const { WeekPicker } = DatePicker

@observer
export default class HtWeekPicker extends Component<HtWeekPickerProps> {
  static displayName = 'HtWeekPicker'

  static defaultProps = {
    onChange: () => {},
    format: 'YYYY-WW',
  }

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
      <span {...rest}>
        <WeekPicker
          value={value ? moment(value, format) : undefined}
          defaultValue={defaultValue ? moment(defaultValue, format) : undefined}
          onChange={this.onChange}
          format={format}
          {...rest}
        />
      </span>
    )
  }
}
