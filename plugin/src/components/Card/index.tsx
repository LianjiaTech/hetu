import { Alert, Card } from 'antd'
import classNames from 'classnames'
import { isArray } from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import HtmlFragment from '~/components/HtmlFragment'
import { JsonSchema } from '~/types'
import { getPlainComponentName } from '~/utils'
import './index.less'
import { HtCardProps } from './interface'

export function renderExtra(
  extra?: React.ReactNode[],
  dataPageconfigPath?: string
) {
  if (isArray(extra)) {
    return (
      <div data-pageconfig-path={dataPageconfigPath}>
        {extra.map((child, i) => {
          if (React.isValidElement(child)) {
            let props: JsonSchema.DynamicObject = {
              key: i,
              className: classNames(
                'ht-card-extra-button',
                child.props.className
              ),
            }

            const type = getPlainComponentName(child)

            if (type === 'HtModalForm') {
              props.onSuccessAction =
                child.props.onSuccessAction || 'trigger:HtList.resetSearch'
            }

            return React.cloneElement(child, props)
          }

          return child
        })}
      </div>
    )
  }

  return null
}

@observer
export default class HtCard extends Component<HtCardProps> {
  static defaultProps = {
    isCard: true,
  }

  render() {
    const {
      isCard,
      cardType,
      description,
      title = window.document.title,
      extra,
      pagestate,
      bordered = false,
      children,
      render = () => null,
      ...otherProps
    } = this.props

    let _type = cardType
    if (!_type && !!isCard === false) {
      _type = 'plain'
    }

    let Extra = renderExtra(
      extra,
      `${this.props['data-pageconfig-path']}.extra`
    )

    let _description = description && <HtmlFragment __html={description} />

    let _message = title && <HtmlFragment __html={title} />

    switch (_type) {
      case 'primary':
        return (
          <div {...otherProps} style={{ margin: '8px' }}>
            <Alert
              message={_message}
              description={_description}
              type="info"
              style={{ margin: '16px' }}
            />
            {render({ Extra })}
            {children}
          </div>
        )
      case 'plain':
        return (
          <div {...otherProps}>
            {render({ Extra })}
            {children}
          </div>
        )
      case 'default':
      default:
        return (
          <Card extra={Extra} title={title} bordered={bordered} {...otherProps}>
            {render({})}
            {children}
          </Card>
        )
    }
  }
}
