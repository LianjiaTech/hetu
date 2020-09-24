import * as React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Icon as AntdIcon, Badge } from 'antd'
import classNames from 'classnames'

const Icon = AntdIcon

const CopyableIcon = ({ type, theme, isNew, justCopied, onCopied }) => {
  const className = classNames({
    copied: justCopied === type,
    outlined: theme === 'twoTone',
  })
  return (
    <CopyToClipboard
      text={
        theme === 'outlined'
          ? `<Icon type="${type}" />`
          : `<Icon type="${type}" theme="${theme}" />`
      }
      onCopy={(text) => onCopied(type, text)}
    >
      <li className={className}>
        <Icon type={type} theme={theme} />
        <span className="anticon-class">
          <Badge dot={isNew}>{type}</Badge>
        </span>
      </li>
    </CopyToClipboard>
  )
}

export default CopyableIcon
