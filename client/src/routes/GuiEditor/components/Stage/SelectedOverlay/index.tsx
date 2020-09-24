import React from 'react'
import { DragSource, DragSourceSpec, DragSourceMonitor, DragSourceConnector } from 'react-dnd'
import _ from 'lodash'
import { connect } from 'dva'
import { Button, Tooltip } from 'antd'
import { getHetu } from '~/utils'
import { emitter } from '~/utils/events'

import { hasChildrenReg, transformReacToStyle, getDataFromDataPropsKey } from '../_utils'

import { Props, State, ConnectState, selectedComponentData, pageConfig, CollectedProps, DragObject } from './interface'

import styles from './index.module.less'

/**
 * 是否为根容器
 * @param path 
 */
function checkRootContainer(path: string, pageConfig: any) {
  // 从父级路径获取
  let targetStr = '.props'
  let propsReg = new RegExp('.props', 'g')

  let results = []
  while (propsReg.exec(path) != null) {
    results.unshift(propsReg.lastIndex - targetStr.length)
  }

  for (let item of results) {
    let parentPath = path.slice(0, item)
    let parentType = _.get(pageConfig, `${parentPath}.type`)
    let allowContainers = getHetu('allowContainers', [])
    if (allowContainers.indexOf(parentType) !== -1 && parentPath !== path) {
      return false
    }
  }

  return true
}

class SelectedOverlay extends React.Component<Props, State> {
  static displayName = 'SelectedOverlay'

  // 删除
  onDeleteClick = async (e: React.MouseEvent, dataPageConfigPath: string) => {
    e && e.stopPropagation()

    const { dispatch, pageConfig } = this.props
    if (hasChildrenReg.test(dataPageConfigPath)) { // dataPageConfigPath是数组某一项
      const { index, children, childrenParentKey } = getDataFromDataPropsKey(dataPageConfigPath, pageConfig)
      const newChildren = [...children.slice(0, index), ...children.slice(index + 1)]
      await dispatch({
        type: 'guiEditor/setState',
        payload: {
          hoverComponentData: null,
          selectedComponentData: null,
          activeTab: null
        },
      })
      await dispatch({
        type: 'guiEditor/updatePageConfigAndIframe',
        payload: {
          key: childrenParentKey,
          value: newChildren,
          pageConfig,
        },
      })
    } else {
      await dispatch({
        type: 'guiEditor/setState',
        payload: {
          hoverComponentData: null,
          selectedComponentData: null,
          activeTab: null
        },
      })
      await dispatch({
        type: 'guiEditor/updatePageConfigAndIframe',
        payload: {
          key: dataPageConfigPath,
          value: undefined,
          pageConfig,
        },
      })
    }
  }

  /**
  * 进入插入模式, 并记录插入的路径
  */
  onInsert = async (e: React.MouseEvent, selectedComponentData: selectedComponentData) => {
    e && e.stopPropagation()
    const { dispatch } = this.props
    await dispatch({
      type: 'guiEditor/setState',
      payload: {
        isInsertItemMode: true,
        // 插入的配置
        drawData: '',
        // 插入的顺序
        insertIndex: 0
      }
    })
    return true
  }

  /**
   * 渲染按钮
   */
  renderOverlayButtons = (selectedComponentData: selectedComponentData, pageConfig: pageConfig) => {
    const { dataPageConfigPath, dataComponentType } = selectedComponentData

    const selectedButtons = getHetu(['editConfigMap', dataComponentType, 'selectedButtons'])

    let ButtonMove = null
    let ButtonAdd = null
    let ButtonDelete = null

    if (selectedButtons.indexOf('move') !== -1) {
      // 渲染移动按钮
      const { index, children } = getDataFromDataPropsKey(dataPageConfigPath, pageConfig)
      if (_.isNumber(index) && children) {
        ButtonMove = (
          <Tooltip title="移动">
            <Button
              type="primary"
              className={`select-overlay-icon select-overlay-icon--drag`}
              size="small"
              icon="drag"
            />
          </Tooltip>
        )
      }
    }

    if (selectedButtons.indexOf('delete') !== -1 && dataPageConfigPath !== 'elementConfig' ) {
      ButtonDelete = (
        <Tooltip title="删除">
          <Button
            onClick={(e) => this.onDeleteClick(e, dataPageConfigPath)}
            type="primary"
            className={`select-overlay-icon select-overlay-icon--delete`}
            size="small"
            icon="delete"
            style={{ maxWidth: 150 }}
          />
        </Tooltip>
      )
    }

    return (
      <div>
        {ButtonMove}
        {ButtonAdd}
        {ButtonDelete}
      </div>
    )
  }

  render() {
    const { connectDragSource, selectedComponentData, pageConfig } = this.props

    if (!_.isPlainObject(selectedComponentData)) return null

    const style = transformReacToStyle(selectedComponentData.reac)

    return connectDragSource(
      <div className={styles['select-overlay']} style={style}>
        {this.renderOverlayButtons(selectedComponentData, pageConfig)}
      </div>
    )
  }
}

const spec: DragSourceSpec<Props, DragObject> = {
  beginDrag(props: Props, monitor: DragSourceMonitor, component: any): DragObject {
    props.dispatch({
      type: 'guiEditor/setState',
      payload: {
        isDragging: true
      }
    })
    return {
      index: props.index
    }
  },
  async endDrag(props: Props, monitor: DragSourceMonitor, component: any) {
    if (!monitor.didDrop()) {
      props.dispatch({
        type: 'guiEditor/setState',
        payload: {
          isDragging: false
        }
      })
      return
    }

    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()

    const newPageConfigPath = await props.onSort(item.index, dropResult.index);

    props.dispatch({
      type: 'guiEditor/setState',
      payload: {
        isDragging: false,
      }
    })

    emitter.emit('highlightComponent', newPageConfigPath)
  },
}

function collect(connect: DragSourceConnector, monitor: DragSourceMonitor, props: Props): CollectedProps {
  return {
    connectDragSource: connect.dragSource(),
  }
}

const WrapperSelectedOverlay = DragSource<Props, CollectedProps, DragObject>(props => props.type, spec, collect)(SelectedOverlay)

export default connect(({ guiEditor }: ConnectState) => ({
  selectedComponentData: guiEditor.selectedComponentData,
  pageConfig: guiEditor.pageConfig,
  isDragging: guiEditor.isDragging
}))(WrapperSelectedOverlay)
