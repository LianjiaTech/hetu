import { Divider } from 'antd'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Props } from './interface'

export class HtDivider extends Component<Props> {
  static displayName = 'HtDivider'

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

export default observer(HtDivider)
