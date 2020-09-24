import znCNMap from '@/theme/zh-CN'
import { get } from 'lodash/object'
import React, { Fragment } from 'react'

export default class FormattedMessage extends React.Component {
  render() {
    const { id } = this.props

    const messages = get(znCNMap, 'messages')

    return <Fragment>{messages[`${id}`]}</Fragment>
  }
}
