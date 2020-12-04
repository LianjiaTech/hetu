import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import classnames from 'classnames'
import { Layout, Icon, Modal, message, Input, Button, Tooltip } from 'antd'
import { connect } from 'dva'
import queryString from 'query-string'

import styles from './index.module.less'

import JSONEditor from '~/components/JsonEditor'
import ThePublishModal from './ThePublishModal'

import { isPlainObject } from 'lodash'

import localHistory from '~/utils/localHistory'
import { isKeyboardEvent, command } from '~/constant/keyboardEvent'
import { emitter } from '~/utils/events'


import { Props, ConnectState, State } from './interface'

@connect(({ guiEditor }: ConnectState) => ({
  query: guiEditor.query,
  projectId: guiEditor.project,
  pageId: guiEditor.pageId,
  draftId: guiEditor.draftId,
  activeTab: guiEditor.activeTab,
  pageConfig: guiEditor.pageConfig,
}))
@CSSModules(styles, { allowMultiple: true })
export default class TheHeader extends Component<Props, State> {
  static displayName = 'TheHeader'

  state = {
    // 发布的弹框
    isPublishModalVisible: false,
    // JSON编辑的弹框
    isEditModalVisible: false,
    pageConfig: undefined,
    query: undefined,
    isChanged: false,
  } as State

  pageConfig: string | dynamicObject

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const query = prevState.isChanged ? prevState.query : queryString.stringify(nextProps.query)
    if (prevState.isEditModalVisible) {
      return {
        ...prevState,
        query,
      }
    } else {
      return {
        ...prevState,
        query,
        pageConfig: nextProps.pageConfig,
      }
    }
  }

  // JSON编辑的弹框
  onModalCancel = () => {
    this.setState(
      {
        pageConfig: null,
      },
      () => {
        this.toggleEditModalVisible(false)
      }
    )
  }

  // JSON编辑的弹框
  onModalOk = () => {
    this.updatePage(this.pageConfig)
  }

  updatePage = (pageConfig: dynamicObject | string) => {
    if (typeof pageConfig === 'string') {
      try {
        pageConfig = JSON.parse(pageConfig)
      } catch (error) {
        message.error('JSON数据格式错误')
        return
      }
    }
    const { dispatch, pageId, projectId } = this.props
    dispatch({
      type: 'guiEditor/updatePage',
      payload: { pageId, pageConfig, projectId },
    }).then(() => {
      message.success('保存成功')
      this.toggleEditModalVisible(false)

      dispatch({
        type: 'guiEditor/updatePageConfigAndIframe',
        payload: {
          key: null,
          value: pageConfig,
          pageConfig,
        },
      })
    })
  }

  onSave = () => {
    const { activeTab, pageConfig } = this.props

    switch (activeTab) {
      case 'base':
        emitter.emit('TheFormEditor.submit')
        break
      case 'code':
        emitter.emit('TheJSONEditor.submit')
        break
      default:
        this.updatePage(pageConfig)
    }
  }

  // 撤销
  revoke = () => {
    let pageConfig = localHistory.back()
    const { dispatch, pageId } = this.props
    if (isPlainObject(pageConfig)) {
      dispatch({
        type: 'guiEditor/updatePageConfigAndIframe',
        payload: {
          key: null,
          value: pageConfig,
          pageConfig,
        },
      })
    }
  }

  // 恢复
  recover = () => {
    let pageConfig = localHistory.forward()
    const { dispatch, pageId } = this.props
    if (isPlainObject(pageConfig)) {
      dispatch({
        type: 'guiEditor/updatePageConfigAndIframe',
        payload: {
          key: null,
          value: pageConfig,
          pageConfig,
        },
      })
    }
  }

  toggleEditModalVisible = (v: boolean) => {
    this.setState({
      isEditModalVisible: !!v,
    })
    if (v) {
      this.props.dispatch({
        type: 'guiEditor/setState',
        payload: {
          activeTab: 'result',
          hoverComponentData: null,
          selectedComponentData: null
        },
      })
    }
  }

  togglePublishModalVisible = (v: boolean) => {

    this.setState({
      isPublishModalVisible: !!v,
    })
  }

  onJSONChange = (v: string) => {
    this.pageConfig = v
  }

  isFirst?: boolean
  onIframeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.isFirst) {
      this.isFirst = true
      return
    }

    this.setState({
      query: e.target.value,
      isChanged: true,
    })
  }

  // 按下键盘enter键时
  onKeyDown = (e: React.KeyboardEvent) => {
    try {
      if (isKeyboardEvent(e, 'enter')) {
        const { query: newQuery } = this.state
        const { pathname, search } = window.location
        const { query, ...rest } = queryString.parse(search)

        const newSearch = queryString.stringify({ ...rest, query: newQuery })

        window.location.href = `${pathname}${newSearch ? '?' + newSearch : ''}`
      }
    } catch (e) {
      throw e
    }
  }

  // @todo(yaozeyuan) 这里应该让用户可以选择在哪个环境下预览/带上预览标记, 方便获取最新草稿
  getPreviewUrl = () => {
    const { query, draftId } = this.props
    const { route } = queryString.parse(window.location.search)
    const search = queryString.stringify({ ...query, draftId })
    return route + '?' + search
  }

  getDocumentUrl = () => {
    return 'http://139.155.239.172/'
  }

  render() {
    const { isEditModalVisible, isPublishModalVisible, pageConfig, query } = this.state

    if (!this.pageConfig) {
      this.pageConfig = pageConfig
    }

    const { route: addonBefore } = queryString.parse(window.location.search)

    let canBack = localHistory.canBack()
    let canForward = localHistory.canForward()

    return (
      <div styleName="the-header">
        <Tooltip placement="right" title="返回首页">
          <a href="/" styleName="logo">
            <img src={require('~/assets/logo.png')} alt="logo" width="32" height="32" />
          </a>
        </Tooltip>
        <div styleName="the-input-wrap">
          <Tooltip placement="bottom" title="输入url查询参数,按enter键刷新">
            <Input
              addonBefore={addonBefore + '?'}
              value={query}
              onChange={this.onIframeUrlChange}
              onKeyDown={this.onKeyDown}
            />
          </Tooltip>
        </div>
        <div styleName="button-group">
          <div
            onClick={() => window.open(this.getDocumentUrl())}
            styleName="button"
          >
            <Icon type="question-circle" className={styles.icon} />
            查看文档
          </div>
          <div onClick={() => window.open(this.getPreviewUrl())} styleName="button">
            <Icon type="eye" className={styles.icon} />
            预览
          </div>
          <div styleName="button" onClick={() => this.toggleEditModalVisible(true)}>
            <Icon type="tool" className={styles.icon} />
            JSON编辑
          </div>
          <div styleName={classnames('button', { disabled: !canForward })} onClick={this.recover}>
            <Icon type="undo" className={styles.icon} />
            恢复
          </div>
          <div styleName={classnames('button', { disabled: !canBack })} onClick={this.revoke}>
            <Icon type="redo" className={styles.icon} />
            撤销
          </div>
          <div styleName="button" onClick={() => this.togglePublishModalVisible(true)}>
            <Icon type="cloud-upload" className={styles.icon} />
            发布
          </div>
          <Tooltip placement="bottom" title={`${command.save.desc} 保存`}>
            <div styleName="button" onClick={this.onSave}>
              <Icon type="save" className={styles.icon} />
              保存
            </div>
          </Tooltip>
        </div>

        {/* 发布的弹框 */}
        <ThePublishModal
          visible={isPublishModalVisible}
          onClose={() => this.togglePublishModalVisible(false)}
        />
        {/* JSON编辑的弹框 */}
        <Modal
          className={styles['the-modal']}
          title="当前页面配置"
          width="800px"
          style={{ height: '90vh', minHeight: '400px', top: '5vh' }}
          bodyStyle={{ height: 'calc(100% - 110px)' }}
          visible={isEditModalVisible}
          okText="提交"
          cancelText="取消"
          onOk={this.onModalOk}
          onCancel={this.onModalCancel}
        >
          <div styleName="tip">
            <Icon type="warning" style={{ color: '#faad14', fontSize: '16px' }} />
            将下载的 JSON粘贴到此处，请不要随便改更数据。
          </div>
          <JSONEditor
            value={JSON.stringify(pageConfig, null, 2)}
            onChange={this.onJSONChange}
          />
        </Modal>
      </div>
    )
  }
}
