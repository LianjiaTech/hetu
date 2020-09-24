import { Button } from 'antd'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { _resolveAction } from '~/utils/actions'
import { HtButtonComponentProps } from './interface'

@observer
export default class HtButton extends React.Component<HtButtonComponentProps> {
  static defaultProps = {
    useH5Href: false,
  }

  push = (to: string) => {
    return _resolveAction('redirectTo', to, this.props.pagestate)
  }

  onClick = (e: any) => {
    const { href, onClick, pagestate, linkTarget } = this.props
    if (href && linkTarget) {
      return _resolveAction('openWindow', href, pagestate)
    }
    // href
    if (href) {
      return _resolveAction('redirectTo', href, pagestate)
    }

    if (_.isFunction(onClick)) {
      return onClick(e)
    }
  }

  render() {
    const {
      linkTarget,
      useH5Href,
      href,
      onClick,
      to,
      text,
      children,
      className,
      'data-component-type': dataComponentType,
      'data-pageconfig-path': dataPageconfigPath,
      pagestate,
      ...otherProps
    } = this.props

    let reg = /^(http|https)/
    // href && 相对路径
    if (href && !reg.test(href)) {
      if (!useH5Href) {
        return (
          // 这里用一个span包一层, 是因为Button为disabled时, elementFromPoint api无法选中元素
          <span
            data-component-type={dataComponentType}
            data-pageconfig-path={dataPageconfigPath}
            className={className}
            style={{ display: 'inline-block' }}
          >
            <Button {...otherProps} onClick={() => this.push(href)}>
              {text}
              {children}
            </Button>
          </span>
        )
      }

      return (
        <span
          data-component-type={dataComponentType}
          data-pageconfig-path={dataPageconfigPath}
          className={className}
          style={{ display: 'inline-block' }}
        >
          <Button {...otherProps} href={href}>
            {text}
            {children}
          </Button>
        </span>
      )
    }

    // to
    if (to) {
      // 兼容之前的设计
      return (
        // 这里用一个span包一层, 是因为Button为disabled时, elementFromPoint api无法选中元素
        <span
          data-component-type={dataComponentType}
          data-pageconfig-path={dataPageconfigPath}
          className={className}
          style={{ display: 'inline-block' }}
        >
          <Button {...otherProps} onClick={() => this.push(to)}>
            {text}
            {children}
          </Button>
        </span>
      )
    }

    // 其他
    return (
      <span
        data-component-type={dataComponentType}
        data-pageconfig-path={dataPageconfigPath}
        className={className}
        style={{ display: 'inline-block' }}
      >
        <Button {...otherProps} onClick={this.onClick}>
          {text}
          {children}
        </Button>
      </span>
    )
  }
}
