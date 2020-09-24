import React, { Component } from 'react'
import { Layout, Spin } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import queryString from 'query-string'
import { isOldPageConfig } from '~/utils/utils'
import { initSubmodules } from '~/utils'

import TheContent from './components/Content'
import TheHeader from './components/Header'
import TheSiderLeft from './components/SiderLeft'
import TheSiderRight from './components/SiderRight'
import { TheGuiEditorProps } from './interface'
import { guiEditorState } from '~/types/models/guiEditor'
import Exception403 from '~/components/Exception/403'
import { getDefaultSubmodule } from '~/constant/submodule'

import './index.less'

const { Sider, Content, Header } = Layout

export const LeftWidth = 250
export const RightWidth = 300
export const HeaderHeight = 64

class GuiEditor extends Component<TheGuiEditorProps> {
  static displayName = 'GuiEditor'

  state = {
    isPageInit: false
  }

  constructor(props: TheGuiEditorProps) {
    super(props)
    document.title = '测试-河图编辑器'

    window.$$isEditor = true
    window.$$receiveIframeData = this.receiveIframeData
  }

  componentDidMount() {
    const { route, query, draftId } = queryString.parse(window.location.search)
    this.initIframe(route as string, query as dynamicObject, draftId as string)
  }

  componentDidUpdate() {
    // 猜测页面类型, 更新到redux中
    let pageMode = this.getPageMode(this.props.pageConfig)
    this.props.dispatch({
      type: 'guiEditor/setState',
      payload: {
        pageMode,
      },
    })
  }

  /**
   * 初始化iframe
   */
  initIframe = async (route: string, query: dynamicObject, draftId: string) => {
    const { dispatch } = this.props
    if (route) {
      // 根据页面路径获取项目详情
      const projectDetail = await dispatch({
        type: 'global/getAsyncProjectDetail',
        payload: { pathname: route },
      })

      // 项目的超级管理员才能够编辑页面
      // 获取页面配置
      const pageConfig: any = await this.props
        .dispatch({
          type: 'guiEditor/getPageConfig',
          payload: {
            path: route,
            draftId,
          },
        })

      // 在这里检查页面配置项, 如果是Ht模式, 跳转到gui系列的页面中
      // let isOldPage = isOldPageConfig(pageConfig)
      // if (isOldPage) {
      //   let editUrl = `${location.origin}/edit${location.search}`
      //   console.log('该页面为旧河图页面,跳转到旧版编辑器页中=>', editUrl)
      //   location.href = editUrl
      // }

      // 更新页面配置, 更新iframe
      this.props.dispatch({
        type: 'guiEditor/updatePageConfigAndIframe',
        payload: {
          key: null,
          value: pageConfig,
        },
      })

      // 设置iframe
      this.props.dispatch({
        type: 'guiEditor/setState',
        payload: {
          query: queryString.parse(query as any),
        },
      })

      const submodules = getDefaultSubmodule()
      await initSubmodules(submodules)

      this.setState({
        isPageInit: true
      })
    }
  }

  // 接收iframe发送的数据
  receiveIframeData = ({ type, data }: { type: string, data: dynamicObject }) => {
    if (type === 'receiveIframeData' && _.isPlainObject(data)) {
      const { changePageConfig, pagestate } = data
      if (_.isFunction(changePageConfig)) {
        window.$$changeIframePageConfig = changePageConfig
      }

      if (_.isPlainObject(pagestate)) {
        this.props.dispatch({
          type: 'guiEditor/setState',
          payload: { pagestate },
        })
      }
    }
  }

  /**
   * 检查页面类型
   */
  getPageMode = (pageConfig: any): 'Form' | 'List' => {
    // 检查json格式的PageConfig中是否出现了HtList, 出现就是List, 否则为Form
    let josnConfig = ''
    try {
      josnConfig = JSON.stringify(pageConfig)
    } catch (e) {
      // 出错直接忽略
    }

    if (josnConfig.includes('"type":"HtList')) {
      return 'List'
    }
    return 'Form'
  }

  render() {

    const { isPageInit } = this.state
    const { projectDetail } = this.props

    if (!isPageInit) {
      return <Spin size="large" className="g-spin" />
    }

    if (_.get(projectDetail, 'whitelist') && !_.get(projectDetail, 'role')) {
      console.log('抱歉, 您无权访问该项目')
      return <Exception403 />
    }

    return (
      <Layout className="page-guiEditor-layout page-guiEditor">
        <Layout className="page-guiEditor-layout">
          <Header style={{ borderBottom: '1px solid #000', padding: '0' }}>
            <TheHeader />
          </Header>
          <Layout className="page-guiEditor-layout" style={{ width: '100%' }}>
            <Sider style={{ borderRight: '1px solid #000' }} width={LeftWidth}>
              <TheSiderLeft />
            </Sider>
            <Content style={{ overflow: 'auto', flex: 1 }}>
              <TheContent />
            </Content>
          </Layout>
        </Layout>
        <Sider style={{ borderLeft: '1px solid #000' }} width={RightWidth}>
          <TheSiderRight />
        </Sider>
      </Layout>
    )
  }
}

export default connect(({ guiEditor, global }: { guiEditor: guiEditorState, global: any }) => ({
  projectDetail: global.projectDetail,
  pageConfig: guiEditor.pageConfig,
  isLockIframe: guiEditor.isLockIframe
}))(GuiEditor)
