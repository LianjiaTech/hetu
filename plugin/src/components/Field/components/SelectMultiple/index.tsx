import React from 'react'
import HtSelect from '../Select'
import { HtSelectProps } from '../Select/interface'

export default class HtSelectMultiple extends React.Component<HtSelectProps> {
  static displayName = 'HtSelectMultiple'

  render() {
    return <HtSelect {...this.props} isMultiple />
  }
}
