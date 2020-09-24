import React, { Component } from 'react'
import { Button } from 'antd'

import config from './typeConfig'
import './index.less'

interface BaseExceptionProps {
  type: '403' | '404' | '500',
  title?: string
  desc?: string
  img?: string
  actions?: React.ReactNode
  style?: dynamicObject
}

export default class BaseException extends Component<BaseExceptionProps> {
  static displayName = 'BaseExceptionProps'

  static propTypes = {}

  static defaultProps = {}

  render() {
    const { type, title, desc, img, actions, style } = this.props
    const pageType = type in config ? type : '404'

    const handleBack = () => {
      window.history.back()
    }

    return (
      <div className="ht-editor-exception" style={style}>
        <div className="imgBlock">
          <div
            className="imgEle"
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className="content">
          <h1>{title || config[pageType].title}</h1>
          <div className="desc">{desc || config[pageType].desc}</div>
          <div className="actions">
            {actions || (
              <Button type="primary" onClick={handleBack}>
                &#160;返&#160;回&#160;
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
}
