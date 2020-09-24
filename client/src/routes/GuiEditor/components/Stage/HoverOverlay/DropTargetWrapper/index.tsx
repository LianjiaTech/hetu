import React from 'react'
import { DropTarget, DropTargetSpec, DropTargetMonitor, DropTargetConnector } from 'react-dnd'
import _ from 'lodash'
import { connect } from 'dva'

import { Props, State, ConnectState, CollectedProps } from './interface'

import styles from '../index.module.less'

class TheDropTarget extends React.Component<Props, State> {
  static displayName = 'TheDropTarget'

  render() {
    const { connectDropTarget, isOver, children } = this.props

    return connectDropTarget((
      <div className={isOver ? styles['is-over'] : ''}>
        {children}
      </div >
    ))
  }
}

const spec: DropTargetSpec<Props> = {
  drop(props, monitor, component) {
    return {
      index: props.index,
      reac: props.reac
    }
  }
}

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor, props: Props): CollectedProps {
  return {
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
  }
}

const WrapperDropTarget = DropTarget<Props>(props => props.type, spec, collect)(TheDropTarget)

export default connect(({ guiEditor }: ConnectState) => ({
  isDragging: guiEditor.isDragging
}))(WrapperDropTarget)
