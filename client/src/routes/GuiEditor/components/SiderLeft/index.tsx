import React, { Fragment, Component } from 'react'
import { Icon, Tooltip, Button } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import { emitter } from '~/utils/events'

import { ConnectState } from '~/types/models/connect'

import { TheSiderLeftProps, Option, } from './interface'

import { isElementConfig } from '~/utils/valid'
import { getDataFromDataPropsKey } from '~/routes/GuiEditor/components/Stage/_utils'
import { getContainerData, getHetu } from '~/utils'
import { command } from '~/constant/keyboardEvent'

import './index.less'

class TheSiderLeft extends React.Component<TheSiderLeftProps> {
  static displayName = 'TheSiderLeft'

  // 锁屏
  onLockBtnClick = (isLockIframe: boolean) => {
    let { dispatch, activeTab } = this.props

    if (!isLockIframe) {
      activeTab = 'base'
    }
    dispatch({
      type: 'guiEditor/setState',
      payload: {
        isLockIframe,
        activeTab,
      },
    })
  }

  /**
   * 插入一个新的节点
   */
  insertNewItem = async (insertItem: any, property: string) => {
    const { pageConfig, selectedComponentData } = this.props

    let containerData = getContainerData(pageConfig, selectedComponentData)

    if (!containerData || !_.get(containerData, 'path')) {
      return false
    }

    const dataPageConfigPath = containerData.path
    if (!dataPageConfigPath) return

    const conponentPageConfig = _.get(pageConfig, dataPageConfigPath)

    let insertPath = `${dataPageConfigPath}.${property}`
    if (isElementConfig(conponentPageConfig)) {
      if( property === 'children' && getHetu('allowContainers').indexOf(conponentPageConfig.type) !== -1){
        // 容器组件
        insertPath = `${dataPageConfigPath}.${property}`
      } else {
        // 如果为标准组件
        insertPath = `${dataPageConfigPath}.props.${property}`
      }
    }

    const insertTarget: any[] = _.get(pageConfig, insertPath, [])

    let insertIndex: number = insertTarget.length

    let selectedDataPageConfigPath = _.get(selectedComponentData, 'dataPageConfigPath')
    if (selectedDataPageConfigPath && selectedDataPageConfigPath.indexOf(insertPath) !== -1) {
      const { index } = getDataFromDataPropsKey(selectedDataPageConfigPath, pageConfig)
      if (_.isNumber(index)) {
        insertIndex = index + 1
      }
    }

    insertTarget.splice(insertIndex, 0, insertItem)

    const newPageConfig = _.set(pageConfig, insertPath, insertTarget)


    // 关闭插入模式
    await this.props.dispatch({
      type: 'guiEditor/finishInsertItemMode',
    })
    // 更新页面配置
    await this.props.dispatch({
      type: 'guiEditor/updatePageConfigAndIframe',
      payload: {
        key: null,
        value: newPageConfig,
      },
    })

    const insertItemPageConfigPath = `${insertPath}[${insertIndex}]`
    emitter.emit('highlightComponent', insertItemPageConfigPath)

    emitter.emit('clickThroughByPageConfigPath', insertItemPageConfigPath)

    return true
  }

  /**
   * 渲染选择面板
   */
  renderDrawer = () => {
    const { pageConfig, selectedComponentData } = this.props

    let _containerData = getContainerData(pageConfig, selectedComponentData)
    if (!_containerData || !_.isPlainObject(_containerData)) {
      const defaultContainerData = getContainerData(pageConfig)
      if (!defaultContainerData) {
        return null
      }
      _containerData = defaultContainerData
    }

    const additableProperties = getHetu(['editConfigMap', _containerData.type, 'additableProperties'])
    if (!_.isPlainObject(additableProperties)) {
      console.warn(`组件 ${_containerData.type} GUI配置additableProperties不合法`)
      return null
    }

    const children: React.ReactNode[] = []

    const renderOptions = (options: Option[], property: string) => {
      if (!_.isArray(options)) return null
      return options.map((option, i) => {
        return (
          <div key={`${i}`} className="component-button">
            <Button size="small" icon={option.icon} block onClick={() => {
              this.insertNewItem(option.value, property)
            }}>{option.label}</Button>
          </div>
        )
      })
    }

    Object.keys(additableProperties)
      .sort((a, b) => additableProperties[a].order - additableProperties[b].order)
      .forEach((key: string, i: number) => {
        const item = additableProperties[key]
        if (_.isArray(item.options)) {
          const Options = renderOptions(item.options, key)
          children.push(
            <div className="property-wrapper" key={`property-wrapper-${i}`}>
              {<div className="property-title">{item.title}</div>}
              <div className="property-content">{Options}</div>
            </div>
          )
        }

        // 分组
        if (_.isArray(item.optionGroups)) {
          const OptionGroup = item.optionGroups.map((group: any, i: number) => {
            return (
              <div className="property-wrapper property-options-group" key={`property-options-group-${i}`}>
                <div className="property-title">{`${item.title}-${group.title}`}</div>
                <div className="property-content">{renderOptions(group.options, key)}</div>
              </div>
            )
          })
          children.push(OptionGroup)
        }
      })

    return children
  }

  render() {
    const { isLockIframe } = this.props

    return (
      <div className="the-sider-left" >
        <div
          className='edit-drawer'
        >
          {this.renderDrawer()}
        </div>

        <div className="button-group">
          <a onClick={() => this.onLockBtnClick(!isLockIframe)} target="_blank" className="button">
            {isLockIframe && (
              <Tooltip title={`${command.shift.desc} 切换到预览模式`} placement="right">
                <Icon type="lock" theme="filled" style={{ fontSize: '18px' }} />
              </Tooltip>
            )}
            {!isLockIframe && (
              <Tooltip title={`${command.shift.desc} 切换到编辑模式`} placement="right">
                <Icon type="unlock" style={{ fontSize: '18px' }} />
              </Tooltip>
            )}
          </a>
        </div>
      </div>
    )
  }
}

export default connect(({ guiEditor }: ConnectState) => ({
  pageConfig: guiEditor.pageConfig,
  isLockIframe: guiEditor.isLockIframe,
  activeTab: guiEditor.activeTab,
  selectedComponentData: guiEditor.selectedComponentData
}))(TheSiderLeft)
