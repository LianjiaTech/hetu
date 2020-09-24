import { Alert } from 'antd'
import React from 'react'
import { observer } from 'mobx-react'
import HtmlFragment from '~/components/HtmlFragment'
import { Props } from './interface'

export class HtAlert extends React.Component<Props> {
  static displayName = 'HtAlert'

  static defaultProps = {
    banner: false,
    closable: false,
    showIcon: false,
    type: 'info',
  }

  state = {}

  componentDidMount() {}

  render() {
    const {
      message,
      description,
      banner,
      closable,
      showIcon,
      alertType,
      children,
      pagestate,
      ...rest
    } = this.props

    let _description = description && <HtmlFragment __html={description} />

    let _message = message && <HtmlFragment __html={message} />

    return (
      <Alert
        {...rest}
        message={_message}
        description={_description}
        type={alertType}
        showIcon={showIcon}
        banner={banner}
        closable={closable}
      />
    )
  }
}

export default observer(HtAlert)
