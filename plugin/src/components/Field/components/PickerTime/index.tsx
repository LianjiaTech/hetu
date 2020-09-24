import { TimePicker } from 'antd'
import moment from 'moment'
import React, { Component } from 'react'
import { observer } from 'mobx-react'

import { HtTimePickerProps } from './interface'

@observer
export default class HtTimePicker extends Component<HtTimePickerProps> {
  static displayName = 'HtTimePicker'

  static defaultProps = {
    onChange: () => {},
    format: 'HH:mm:ss',
  }

  state = {}

  componentDidMount() {}

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
        <TimePicker
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
