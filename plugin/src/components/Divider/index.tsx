import { Divider } from 'antd'
import React, { Component } from 'react'
import { Props } from './interface'

export default class HtDivider extends Component<Props> {
  // static displayName = 'HtDivider'

  static defaultProps = {
    dashed: false,
    orientation: 'left',
    type: 'horizontal',
  }

  render() {
    const { title, pagestate, ...rest } = this.props
    return <Divider {...rest}>{title}</Divider>
  }
}
