import React, { Component } from 'react'
import { Button } from 'antd'

import config from './typeConfig'
import './index.less'
import { HtExceptionProps } from './interface'

export default class HtException extends Component<HtExceptionProps> {
  static displayName = 'HtException'

  static propTypes = {}

  static defaultProps = {}

  render() {
    const { type = '404', title, desc, img, actions } = this.props

    const defaultConfig = config[type]
    const defaultImg = defaultConfig.img
    const defaultTitle = defaultConfig.title
    const defaultDesc = defaultConfig.desc

    const handleBack = () => {
      window.history.back()
    }

    return (
      <div className="ht-exception">
        <div className="imgBlock">
          <div
            className="imgEle"
            style={{ backgroundImage: `url(${img || defaultImg})` }}
          />
        </div>
        <div className="content">
          <h1>{title || defaultTitle}</h1>
          <div className="desc">{desc || defaultDesc}</div>
          <div className="actions">
            {actions || (
              <Button type="primary" onClick={handleBack}>
                返回
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
}
