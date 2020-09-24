import React from 'react'
import { Button } from 'antd'
import Exception from './'

export default class Exception403 extends React.Component<any> {

  goHome = () => {
    window.location.href = '/'
  }

  render() {
    return <Exception type="403" style={{ minHeight: 500, height: '80%' }} actions={<Button type="primary" onClick={this.goHome}>返回</Button>} />
  }
}
