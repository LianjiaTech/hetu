import React, { Fragment, Component } from 'react'
import { connect } from 'dva'
import { message } from 'antd'
import { get, set, isEqual, isPlainObject } from 'lodash'
import styles from './index.module.less'
import JSONEditorProps, { ConnectState } from './interface'
import JsonEditor from '~/components/JsonEditor'
import { emitter } from '~/utils/events'
import { isKeyboardEvent } from '~/constant/keyboardEvent'

class TheJSONEditor extends Component<JSONEditorProps> {
  static propTypes = {}

  state = {}

  componentWillMount() {
    emitter.on('TheJSONEditor.submit', this.saveAndUpdate)
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount = () => {
    emitter.off('TheJSONEditor.submit', this.saveAndUpdate)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  // 绑定键盘事件
  onKeyDown = (e: KeyboardEvent) => {
    if (isKeyboardEvent(e, 'save')) {
      this.saveAndUpdate(e)
    }
  }

  pageConfigStr?: string
  dataPageConfigPath?: string
  onJSONChange = (dataPageConfigPath: string, newProps: string) => {
    this.pageConfigStr = newProps
    this.dataPageConfigPath = dataPageConfigPath
  }

  save = () => {
    const { dispatch, pageConfig, activeTab } = this.props

    if (activeTab !== 'code') {
      return false
    }

    const dataPageConfigPath = this.dataPageConfigPath
    let config
    if (this.pageConfigStr === undefined && this.dataPageConfigPath === undefined) {
      return
    }
    try {
      config = JSON.parse(this.pageConfigStr)
    } catch (error) {
      message.error('json 格式错误', 1.5)
      return
    }

    const oldProps = get(pageConfig, dataPageConfigPath, {})

    let newPageConfig
    if (config.children) {
      if (isEqual(oldProps, config)) {
        return false
      }

      newPageConfig = set(pageConfig, dataPageConfigPath, { ...config })
    } else {
      const { children, ...rest } = oldProps

      if (isEqual(rest, config)) {
        return false
      }
      newPageConfig = set(pageConfig, dataPageConfigPath, { children, ...config })
    }

    dispatch({
      type: 'guiEditor/setState',
      payload: {
        pageConfig: newPageConfig,
      },
    })

    return newPageConfig
  }

  // 保存并更新iframe
  saveAndUpdate = (e?: KeyboardEvent) => {
    e && e.preventDefault()
    const { dispatch, pageId, projectId } = this.props

    const pageConfig = this.save()

    if (isPlainObject(pageConfig) && pageConfig.route) {
      dispatch({
        type: 'guiEditor/updatePageConfigAndIframe',
        payload: {
          key: null,
          value: pageConfig,
        },
      })

      dispatch({
        type: 'guiEditor/updatePage',
        payload: {
          projectId,
          pageId,
          pageConfig,
        },
      })

      message.success('保存成功', 1.5)
    }
  }

  render() {
    const { dataPageConfigPath, pageConfig } = this.props


    if (dataPageConfigPath) {
      const code = get(pageConfig, dataPageConfigPath)
      const formatCode = { ...code }

      return (
        <div className={styles['the-guiEditor-wrap']}>
          <JsonEditor
            defaultValue={null}
            disabled={false}
            value={JSON.stringify(formatCode, null, 2)}
            onChange={v => this.onJSONChange(dataPageConfigPath, v)}
          ></JsonEditor>
        </div>
      )
    }

    return null
  }
}

export default connect(({ guiEditor }: ConnectState) => ({
  projectId: guiEditor.project,
  pageId: guiEditor.pageId,
  dataPageConfigPath: get(guiEditor, 'selectedComponentData.dataPageConfigPath'),
  pageConfig: guiEditor.pageConfig,
  activeTab: guiEditor.activeTab
}))(TheJSONEditor)
