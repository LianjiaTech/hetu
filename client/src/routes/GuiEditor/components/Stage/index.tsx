import React from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { Props, ConnectState, } from './interface'
import { getDataFromDataPropsKey } from './_utils'

import SelectedOverlay from './SelectedOverlay'
import HoverOverlay from './HoverOverlay'

import styles from './index.module.less'

class TheStage extends React.Component<Props> {
  static displayName = 'TheStage'

  static propTypes = {}

  static defaultProps = {
    onMouseMove: () => { },
    onMouseLeave: () => { },
    onScroll: () => { },
    onDoubleClick: () => { }
  }

  state = {}

  $stage?: HTMLElement

  componentDidMount() {
    const { onMouseMove, onMouseLeave } = this.props
    this.$stage.addEventListener('mousemove', onMouseMove)
    this.$stage.addEventListener('mouseleave', onMouseLeave)
  }

  componentWillUnmount() {
    const { onMouseMove, onMouseLeave } = this.props
    this.$stage.removeEventListener('mousemove', onMouseMove)
    this.$stage.removeEventListener('mouseleave', onMouseLeave)
  }

  onSort = async (dragIndex: number, targetIndex: number) => {
    const { selectedComponentData, pageConfig, dispatch } = this.props
    const { dataPageConfigPath } = selectedComponentData
    const { index, children, childrenParentKey } = getDataFromDataPropsKey(dataPageConfigPath, pageConfig)
    if (index !== dragIndex) {
      throw new Error('something is wrong, dragIndex is not equal to index')
    }
    const dragRow = children[dragIndex];
    const newChildren = update(children, {
      $splice: [[dragIndex, 1], [targetIndex, 0, dragRow]],
    })

    await dispatch({
      type: 'guiEditor/updatePageConfigAndIframe',
      payload: {
        key: childrenParentKey,
        value: newChildren,
        pageConfig,
      },
    })
    return `${childrenParentKey}[${targetIndex}]`
  }

  renderSelectedOverlay = () => {
    const { selectedComponentData, pageConfig } = this.props

    if (!_.isPlainObject(selectedComponentData)) return null

    const { dataComponentType, dataPageConfigPath } = selectedComponentData

    const { index } = getDataFromDataPropsKey(dataPageConfigPath, pageConfig)

    return <SelectedOverlay type={dataComponentType} index={index} onSort={this.onSort} />
  }

  render() {
    const { style, onClick, selectedComponentData } = this.props

    const type = _.get(selectedComponentData, 'dataComponentType')
    return (
      <div
        ref={(c) => (this.$stage = c)}
        className={styles['the-stage-wrap']}
        style={style}
        onClick={onClick}
      >
        <DndProvider backend={HTML5Backend}>
          <HoverOverlay type={type} />
          {this.renderSelectedOverlay()}
        </DndProvider>
      </div>
    )
  }
}

export default connect(({ guiEditor }: ConnectState) => ({
  hoverComponentData: guiEditor.hoverComponentData,
  selectedComponentData: guiEditor.selectedComponentData,
  pageConfig: guiEditor.pageConfig,
}))(TheStage)
