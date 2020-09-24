import { DatePicker } from 'antd'
import { isArray } from 'lodash'
import moment, { Moment } from 'moment'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { HtRangePickerProps } from './interface'

const { RangePicker } = DatePicker

@observer
export default class HtRangePicker extends Component<HtRangePickerProps, any> {
  static displayName = 'HtRangePicker'

  static defaultProps = {
    onChange: () => {},
    format: 'YYYY-MM-DD HH:mm:ss',
    ranges: {
      最近一周: [moment().subtract(7, 'days'), moment()],
      最近一月: [moment().subtract(30, 'days'), moment()],
      最近三个月: [moment().subtract(3 * 30, 'days'), moment()],
      最近半年: [moment().subtract(6 * 30, 'days'), moment()],
    },
  }

  state = {}

  onChange = (_date: any, dateString: string[]) => {
    const { onChange } = this.props
    if (dateString.length === 0) {
      onChange([])
    } else {
      onChange(dateString)
    }
  }

  render() {
    const {
      value,
      defaultValue,
      format,
      onChange,
      pagestate,
      showTime,
      ...rest
    } = this.props

    let _value
    let _defaultValue
    if (isArray(value) && value.length === 2) {
      _value = [
        value[0] ? moment(value[0], format) : null,
        value[1] ? moment(value[1], format) : null,
      ]
    } else if (isArray(defaultValue) && defaultValue.length) {
      _defaultValue = [
        defaultValue[0] ? moment(defaultValue[0], format) : null,
        defaultValue[1] ? moment(defaultValue[1], format) : null,
      ] as [Moment, Moment]
    } else {
      _value = []
    }

    return (
      <span {...rest}>
        <RangePicker
          {...rest}
          placeholder={['开始时间', '结束时间']}
          value={_value}
          onChange={this.onChange}
          defaultValue={_defaultValue}
          format={format}
          showTime={showTime}
        />
      </span>
    )
  }
}
