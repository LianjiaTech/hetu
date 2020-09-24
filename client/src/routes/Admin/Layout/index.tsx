import React from 'react'
import LoginCard from '../Card'
import './index.less'

export default class LoginLayout extends React.Component {

  render() {
    const { children } = this.props
    return (
      <div className="login-layout-container">
        <LoginCard>
          {children}
        </LoginCard>
      </div>
    )
  }
}
