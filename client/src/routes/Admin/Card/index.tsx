import React from 'react'

import './index.less'

export default class LoginLayout extends React.Component {

  render() {
    const { children } = this.props
    return (
      <div className="login-card-container">
        <div className="login-card-title">河  图</div>
        {children}
      </div>
    )
  }
}
