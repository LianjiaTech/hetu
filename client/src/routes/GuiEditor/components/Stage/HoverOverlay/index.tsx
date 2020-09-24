import React, { CSSProperties } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import classnames from 'classnames'

import { transformReacToStyle, getDataFromDataPropsKey } from '../_utils'

import { Props, State, reac, ConnectState } from './interface'

import styles from './index.module.less'

import DropTargetWrapper from './DropTargetWrapper'

class HoverOverlay extends React.Component<Props, State> {
  static displayName = 'HoverOverlay'

  renderDropTarget = () => {
    const { selectedComponentData, pageConfig } = this.props

    const { parentNode, dataPageConfigPath, dataComponentType } = selectedComponentData

    const { childrenParentKey } = getDataFromDataPropsKey(dataPageConfigPath, pageConfig)

    let reac: reac
    let style: CSSProperties
    let _dataPageConfigPath
    let map: dynamicObject = {}
    let index: number
    let children = Array.from(parentNode.childNodes).filter((node: Element, i) => {
      _dataPageConfigPath = node.getAttribute('data-pageconfig-path')
      let parseObj = getDataFromDataPropsKey(_dataPageConfigPath, pageConfig)
      map[_dataPageConfigPath] = parseObj
      return parseObj.childrenParentKey === childrenParentKey
    }).map((node: Element, i) => {
      _dataPageConfigPath = node.getAttribute('data-pageconfig-path')
      index = map[_dataPageConfigPath].index
      // 获取子节点的属性
      reac = node.getBoundingClientRect()
      style = transformReacToStyle(reac)
      return (
        <DropTargetWrapper index={index} type={dataComponentType} reac={reac} key={index}>
          <div key={index} className={classnames(styles['hover-overlay'], styles['drop-target'])} style={style}></div>
        </DropTargetWrapper>
      )
    })
    return children
  }

  render() {
    const { hoverComponentData, isDragging } = this.props
    if (!_.isPlainObject(hoverComponentData)) return null

    const { reac } = hoverComponentData
    const style = transformReacToStyle(reac)

    if (!isDragging) {
      return <div className={styles['hover-overlay']} style={style} />
    }

    return this.renderDropTarget()
  }
}


export default connect(({ guiEditor }: ConnectState) => ({
  hoverComponentData: guiEditor.hoverComponentData,
  selectedComponentData: guiEditor.selectedComponentData,
  pageConfig: guiEditor.pageConfig,
  isDragging: guiEditor.isDragging
}))(HoverOverlay)
