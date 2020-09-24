import React, { Fragment, Component } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import _ from 'lodash'
import { message } from 'antd'

import styles from './index.module.less'
import TheFormEditor from './FormEditor'
import TheJSONEditor from './JSONEditor'

import { ConnectState, Props, State, selectedComponentData } from './interface'
import { InterfaceEditConfig } from '~/types/components/interfaceEditConfig'

import { IPageConfig } from '~/types/models/global'
import { isElementConfig } from '~/utils/valid'
import { getHetu } from '~/utils'

class TheSiderRight extends Component<Props> {
  static displayName = 'TheSiderRight'

  state: State = {}

  onTabClick = (v: string) => {
    this.props.dispatch({
      type: 'guiEditor/setState',
      payload: {
        activeTab: v,
      },
    })
  }

  onFormDataChange = (v: dynamicObject) => {
    const { pageConfig, dispatch } = this.props
    const oldConfig = _.get(pageConfig, this.formDataPageConfigPath)
    const newPageConfig = _.set(pageConfig, this.formDataPageConfigPath, { ...oldConfig, ...v })

    dispatch({
      type: 'guiEditor/setState',
      payload: {
        pageConfig: newPageConfig,
      },
    })

    setTimeout(() => {
      this.forceUpdate()
    });
  }

  updatePageConfig = (relativePath: string, newParentValue: any) => {
    // 直接通过redux更新到props上
    // 必须要clone一次, 否则对象的引用不变, redux就会认为内容没有改变, 也就不会触发组件更新
    let newPageConfig = _.cloneDeep(this.props.pageConfig)
    _.set(newPageConfig, `${this.formDataPageConfigPath}.${relativePath}`, newParentValue)

    this.props.dispatch({
      type: 'guiEditor/setState',
      payload: {
        pageConfig: newPageConfig,
      },
    })
  }

  updatePageConfigAndReload = async (allValues: any) => {
    const { dispatch, pageConfig, pageId, projectId } = this.props

    let path = this.formDataPageConfigPath

    const oldConfig = _.get(pageConfig, path)

    const newPageConfig = _.set(pageConfig, path, { ...oldConfig, ...allValues })

    await dispatch({
      type: 'guiEditor/updatePageConfigAndIframe',
      payload: {
        key: null,
        value: newPageConfig,
      },
    })

    await dispatch({
      type: 'guiEditor/updatePage',
      payload: {
        projectId,
        pageId,
        pageConfig: newPageConfig,
      },
    })

    message.success('保存成功', 1.5)

  }

  // formData 在pageConfig中的路径
  formDataPageConfigPath: string = ''
  /**
   * 获取FormEditor的表单值
   * 
   * @param pageConfig 页面配置
   * 
   */
  getFormEditorData = (pageConfig: IPageConfig, selectedComponentData: selectedComponentData) => {
    let { dataPageConfigPath } = selectedComponentData

    let dataComponentProps = _.get(pageConfig, dataPageConfigPath)

    let _formData = _.cloneDeep(dataComponentProps)
    this.formDataPageConfigPath = dataPageConfigPath
    if (isElementConfig(dataComponentProps)) {
      // 如果为标准ReactNode节点配置({type,props,children}), 需要补全props属性
      _formData = dataComponentProps.props
      this.formDataPageConfigPath = `${dataPageConfigPath}.props`
    }

    const editConfigData = _.cloneDeep(this.getEditConfigData(_formData))

    function mergerProps(dataConfig: InterfaceEditConfig, value: dynamicObject) {
      let result: dynamicObject = _.cloneDeep(value)
      if (_.isPlainObject(dataConfig)) {
        for (let key in dataConfig) {
          result[key] = value[key] === undefined ? dataConfig[key].defaultValue : value[key]
        }
      }
      return result
    }

    let formData = mergerProps(editConfigData, _formData)

    return { formData, editConfigData }
  }

  /**
   * 获取FormEditor配置项的值
   */
  getEditConfigData = (formData: dynamicObject) => {
    const { selectedComponentData } = this.props
    let type = _.get(selectedComponentData, 'dataComponentType')
    if (!type) return undefined

    let editConfigData = getHetu(['editConfigMap', type, 'guiProperties'])
    if (_.isFunction(editConfigData)) {
      return editConfigData(formData)
    }

    return editConfigData
  }

  renderTabs = () => {
    const { activeTab, isLockIframe } = this.props
    return (
      <div className={styles.tabs}>
        {isLockIframe && (
          <div
            className={classnames(styles['tabs-item'], { [styles['is-selected']]: activeTab === 'base' })}
            onClick={() => this.onTabClick('base')}
          >
            基本编辑
          </div>
        )}
        {isLockIframe && (
          <div
            className={classnames(styles['tabs-item'], { [styles['is-selected']]: activeTab === 'code' })}
            onClick={() => this.onTabClick('code')}
          >
            源码编辑
          </div>
        )}
      </div>
    )
  }

  render() {
    const { activeTab, isLockIframe, pageConfig, selectedComponentData } = this.props

    if (!_.isPlainObject(selectedComponentData)) return null

    const { formData, editConfigData } = this.getFormEditorData(pageConfig, selectedComponentData)

    return (
      <div className={styles['the-sider-right']}>
        {this.renderTabs()}
        {/* 基本编辑 */}
        {isLockIframe && activeTab === 'base' && <TheFormEditor formData={formData} editConfigData={editConfigData} onChange={this.onFormDataChange} updatePageConfig={this.updatePageConfig} updatePageConfigAndReload={this.updatePageConfigAndReload} />}
        {/* 代码编辑 */}
        {isLockIframe && activeTab === 'code' && <TheJSONEditor />}
      </div>
    )
  }
}

export default connect(({ guiEditor }: ConnectState) => ({
  activeTab: guiEditor.activeTab,
  isLockIframe: guiEditor.isLockIframe,
  selectedComponentData: guiEditor.selectedComponentData,
  pageConfig: guiEditor.pageConfig,
  projectId: guiEditor.project,
  pageId: guiEditor.pageId,
}))(TheSiderRight)
