import { Steps } from 'antd'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Props } from './interface'

const { Step } = Steps

class HtSteps extends React.Component<Props> {
  static displayName = 'HtSteps'

  static defaultProps = {
    current: 0,
    initial: 0,
    direction: 'horizontal',
    steps: [
      {
        title: 'First',
        description: 'First-description',
      },
      {
        title: 'Second',
        description: 'Second-description',
      },
      {
        title: 'Last',
        description: 'Last-description',
      },
    ],
    onChange: () => {},
  }

  state = {}

  render() {
    const {
      current,
      value,
      initial,
      direction,
      steps,
      onChange,
      ...rest
    } = this.props

    return (
      <Steps
        {...rest}
        current={_.isUndefined(value) ? current : value}
        initial={initial}
        direction={direction}
        onChange={onChange}
      >
        {steps.map(item => (
          <Step
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </Steps>
    )
  }
}

export default observer(HtSteps)
