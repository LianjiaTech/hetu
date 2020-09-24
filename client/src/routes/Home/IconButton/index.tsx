import * as React from 'react'
import { Icon, Tooltip } from 'antd'

interface IconButtonProp {
  icon: string
  title: string
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  disabled?: boolean
  onClick?: () => void
}

class IconButton extends React.Component<IconButtonProp> {
  render() {
    const { icon, title, href, target = '_blank', disabled, onClick } = this.props
    return (
      <Tooltip placement="bottom" title={disabled ? '' : title}>
        {disabled ? (
          <a target={target} className={`page-home-button is-disabled`}>
            <Icon type={icon} />
          </a>
        ) : (
            <a
              href={href}
              onClick={onClick}
              target={target}
              className={`page-home-button ${disabled ? 'is-disabled' : ''}`}
            >
              <Icon type={icon} />
            </a>
          )}
      </Tooltip>
    )
  }
}

export default IconButton
