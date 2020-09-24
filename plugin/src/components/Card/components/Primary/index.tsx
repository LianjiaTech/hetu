import { Alert } from 'antd'
import React from 'react'
import { Props } from './interface'

export default class CardPrimary extends React.Component<Props> {
  static displayName = 'CardPrimary'

  static defaultProps = {}

  state = {}

  renderHeader = () => {
    const { title, subtitle } = this.props
    return <Alert message={title} description={subtitle} type="info" />
  }

  render() {
    const { children } = this.props
    return (
      <div>
        {this.renderHeader()}
        {children}
      </div>
    )
  }
}
