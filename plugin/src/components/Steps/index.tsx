import { Button, Steps } from 'antd'
import _ from 'lodash'
import React from 'react'
import { updateComponentAlias } from '~/utils'
import { emitter } from '~/utils/events'
import { Props } from './interface'
import './index.less'

const { Step } = Steps
const ComponentAlias = '$$HtStepsActive'

updateComponentAlias(ComponentAlias, 0)

export default class HtSteps extends React.Component<Props> {
  static displayName = 'HtSteps'

  static defaultProps = {
    current: 0,
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
    showButton: true,
    onChange: () => {},
  }

  state = {
    current: this.props.current || 0,
  }

  componentDidMount() {
    const { alias, current, pagestate } = this.props
    const activeTab = _.get(pagestate, alias || ComponentAlias, current)
    if (activeTab) {
      this.onChange(activeTab)
    }
  }

  next() {
    const current = this.state.current + 1
    this.setState({ current })
    this.props.onChange(current)
  }

  prev() {
    const current = this.state.current - 1
    this.setState({ current })
    this.props.onChange(current)
  }

  onChange(current: number) {
    const { alias, onChange, pagestate } = this.props
    this.setState({ current })
    onChange(current)

    const { setStoreState } = pagestate
    setStoreState({
      [alias || ComponentAlias]: current,
    })
  }

  onSubmit = () => {
    emitter.emit('$$HtForm.submit')
  }

  render() {
    const {
      children,
      direction,
      steps,
      showButton,
      onChange,
      ...rest
    } = this.props

    const { current } = this.state

    return (
      <div {...rest}>
        <Steps
          current={current}
          direction={direction}
          onChange={current => this.onChange(current)}
        >
          {steps.map(item => (
            <Step
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </Steps>
        {_.isArray(children) && (
          <>
            <div className="steps-content">
              {children.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{ display: index === current ? 'block' : 'none' }}
                >
                  {item}
                </div>
              ))}
            </div>
            {showButton && (
              <div className="steps-action">
                <div>
                  {current > 0 && (
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => this.prev()}
                    >
                      上一步
                    </Button>
                  )}
                </div>
                <div>
                  {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => this.next()}>
                      下一步
                    </Button>
                  )}
                </div>

                {/* {current === steps.length - 1 && ( */}
                {/*  <Button type="primary" onClick={this.onSubmit}> */}
                {/*    提交 */}
                {/*  </Button> */}
                {/* )} */}
              </div>
            )}
          </>
        )}
      </div>
    )
  }
}
