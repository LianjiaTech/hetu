import React from 'react'

interface IProps {
  block?: boolean
  __html: string
}

export default class HtHtml extends React.Component<IProps, any> {
  render() {
    const { __html, block } = this.props

    const C: keyof JSX.IntrinsicElements = block ? 'div' : 'span'

    return <C dangerouslySetInnerHTML={{ __html }} />
  }
}
