import React from 'react'
import { observer } from 'mobx-react'

import PickerDate from '~/components/Field/components/PickerDate'
import { HtDatePickerProps } from '~/components/Field/components/PickerDate/interface'

@observer
class PickerDateTime extends React.Component<HtDatePickerProps> {
  static defaultProps = {
    format: 'YYYY-MM-DD HH:mm:ss',
    showToday: true,
  }

  render() {
    return <PickerDate {...this.props} />
  }
}

export default PickerDateTime
