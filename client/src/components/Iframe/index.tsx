import React, { Fragment, Component } from 'react'

import _, { isFunction } from 'lodash'
import './index.less'

import { Props } from './interface'

export default class BaseIframe extends Component<Props> {
  static displayName = 'BaseIframe'

  static propTypes = {}

  static defaultProps = {
    onLoad: () => { },
    onKeydown: () => { }
  }

  state = {}

  iframe: HTMLIFrameElement

  componentDidMount() {
    const { getRef, onKeydown } = this.props
    if (_.isFunction(getRef)) {
      getRef(this.iframe)
    }

    if (this.iframe) {
      const iframeWinow = this.iframe.contentWindow
      iframeWinow.addEventListener('keydown', onKeydown)
    }
  }

  componentWillUnmount() {
    const { onKeydown } = this.props
    if (this.iframe) {
      const iframeWinow = this.iframe.contentWindow
      iframeWinow.removeEventListener('keydown', onKeydown)
    }
  }


  sendData = () => { }

  render() {
    const { src, onKeydown, onLoad, getRef, ...otherProps } = this.props
    return (
      <iframe
        ref={(c: HTMLIFrameElement) => {
          this.iframe = c
        }}
        {...otherProps}
        className="base-iframe"
        src={src}
        onLoad={onLoad}
      />
    )
  }
}
