import React, { Fragment, Component } from 'react'

export default class LayoutBlank extends Component {
  static displayName = 'LayoutBlank'

  static propTypes = {}

  static defaultProps = {}

  render() {
    const { children } = this.props

    return <Fragment>{children}</Fragment>
  }
}
