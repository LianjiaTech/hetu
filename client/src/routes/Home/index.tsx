import * as React from 'react'
import { Spin, ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import DocumentTitle from 'react-document-title'
import { store } from '@ice/stark-data'
import moment from 'moment'
import 'moment/locale/zh-cn'
import _, {
  isPlainObject,
  isFunction,
  get,
  cloneDeep
} from 'lodash'
import queryString from 'query-string'
import Api from '~/apis'
import { getDefaultSubmodule } from '~/constant/submodule'

// 引入 npm包
import Exception403 from '~/components/Exception/403'
import Exception from '~/components/Exception'
import { Basic, Blank } from './Layout'
import TheModalClone from './ModalClone'

import './index.less'

import { getRouterData } from '~/common/router'

import IconButton from './IconButton'
import { PageHomeProps, PageHomeState, IProjectDetail } from './interface'
import { initSubmodules, getWebType, sleep } from '~/utils'

moment.locale('zh-cn')

const routerData = getRouterData()

// 当前页面的父级页面类型, 可选值有iframe、编辑器、未知
let parentType = getWebType()

class PageHome extends React.Component<PageHomeProps, PageHomeState> {
  static displayName = 'PageHome'

  static defaultProps = {}

  state: PageHomeState = {
    isLocalPage: true,
    isPageInit: false,
    isCloneModalVisible: false,
    errorMessage: null,
    panes: [],
    uniqueKey: window.location.href
  }

  async componentDidMount() {
    const { history } = this.props

    // TODO 改为从html文件获取, 节省时间
    // 获取用户信息
    const userInfo = await Api.User.getAsyncUserInfo()

    const projectDetail = await this.initProject(window.location.pathname)

    this.setState({
      userInfo,
      projectDetail
    })

    // 编辑器模式
    if (parentType === 'editor') {
      return this.initPageInEditor()
    }

    // 在qiankun微前端中
    if (window.__POWERED_BY_QIANKUN__) {
      await this.initPage(window.location.pathname)
      return
    }

    // 监听history change事件
    this.unListen = history.listen(async location => {
      if (!routerData[location.pathname as keyof (typeof routerData)]) {

        const { pageConfig } = await this.initPage(location.pathname)

        const activePanekey = window.location.href.replace(window.location.origin, '')
        const { panes } = this.state
        const isExist = panes.some((v) => v.key === activePanekey)

        this.setState({
          activePanekey,
          panes: isExist ? panes : [...this.state.panes, {
            key: activePanekey,
            title: pageConfig.title || activePanekey,
            closable: true
          }]
        })
      }
    })

  }

  componentWillUnmount() {
    // 取消监听history事件
    if (isFunction(this.unListen)) {
      this.unListen()
    }
  }

  unListen?: () => void

  /**
   * 在编辑器中,初始化页面
   */
  initPageInEditor = () => {
    if (window.parent.$$receiveIframeData) {
      this.sendIframeData({
        changePageConfig: this.changePageConfig,
      })
    }
  }

  // 向iframe父级页面发送数据
  sendIframeData = (data: dynamicObject) => {
    if (window.parent.$$receiveIframeData) {
      window.parent.$$receiveIframeData({
        type: 'receiveIframeData',
        data,
      })
    }
  }

  // 编辑器, 触发页面更新
  changePageConfig = (pageConfig: dynamicObject) => {
    return new Promise((resolve, reject) => {
      // 保存项目详情和用户信息
      this.setState({
        pageConfig: { ...pageConfig, uniqueKey: window.location.href },
        isPageInit: true,
      }, resolve)
    })
  }


  /**
   * 初始化项目
   */
  initProject = async (pathname: string) => {
    // 根据页面路径获取项目详情
    const projectDetail = await Api.Project.getAsyncProjectDetail(pathname)

    const submodules = projectDetail.submodules || getDefaultSubmodule()

    await initSubmodules(submodules)

    return projectDetail
  }

  /**
   * 初始化页面
   */
  initPage = async (pathname: string) => {
    let { projectDetail } = this.state

    try {
      this.setState({
        isPageInit: false,
      })

      // 获取页面配置
      const { pageConfig, projectId, isLocalPage } = await Api.Page.getAsyncPageDetail()

      // 切换了项目
      if (projectId !== projectDetail.id) {
        projectDetail = await this.initProject(pathname)
      }

      let _pageConfig = { ...pageConfig, uniqueKey: window.location.href }

      // 保存项目详情和用户信息
      this.setState({
        errorMessage: null,
        isPageInit: true,
        projectDetail,
        pageConfig: _pageConfig,
        isLocalPage,
      })

      return { pageConfig: _pageConfig }
    } catch (e) {
      this.setState({
        isPageInit: true,
        errorMessage: e.message || '编译错误',
      })
      throw e
    }
  }

  // 获取编辑页面url
  getEditUrl = () => {
    const route = window.location.pathname
    let { query } = queryString.parseUrl(window.location.href)

    const formateSearch = queryString.stringify({
      route,
      query: queryString.stringify(query),
    })
    return `/guiedit?${formateSearch}`
  }

  // 获取编辑项目url
  getProjectUrl = () => {
    const { projectDetail } = this.state
    const projectId = projectDetail.id
    return `/projects/detail?projectId=${projectId}`
  }

  onCloneBtnClick = () => {
    this.setState({ isCloneModalVisible: true })
  }

  // 渲染layout
  renderLayout = (projectDetail: IProjectDetail, children: React.ReactNode) => {
    const { history } = this.props
    const { userInfo, activePanekey, panes } = this.state
    let type = get(projectDetail, 'layout.type', 'blank')

    // 在编辑器中 || 在iframe中 
    if (['editor', 'iframe'].indexOf(parentType) !== -1 || window.__POWERED_BY_QIANKUN__) {
      type = 'blank'
    }

    const basicProps = {
      userInfo,
      projectDetail,
      activePanekey,
      panes,
      history,
      onChange: (activePanekey: string, panes: any[]) => {
        this.setState({
          activePanekey,
          panes
        })
      }
    }

    switch (type) {
      case 'blank':
        return <Blank>{children}</Blank>
      case 'basic':
      default:
        return <Basic {...basicProps}>{children}</Basic>
    }

  }

  renderContent = () => {
    const {
      errorMessage,
      pageConfig,
      projectDetail,
      userInfo,
      isPageInit,
    } = this.state

    const { history } = this.props

    if (errorMessage) {
      return <Exception type="500" desc={errorMessage} />
    }

    if (!isPageInit) {
      return <Spin size="large" className="g-spin" />
    }

    if (!_.isPlainObject(pageConfig)) {
      return null
    }

    let C = _.get(window.Hetu, 'default')

    if (!C) {
      return <Exception type="500" desc="window.Hetu.default 必须是一个React组件" />
    }

    const props = { ...pageConfig, history, local: { ...pageConfig.local, userInfo, projectDetail: cloneDeep(projectDetail) } }
    return <C {...props} />

  }

  render() {

    const {
      isCloneModalVisible,
      isLocalPage,
      isPageInit,
      errorMessage,
      userInfo,
      pageConfig,
      projectDetail,
      activePanekey,
      panes
    } = this.state

    // 是否允许编辑
    let canEdit
    // 是否允许克隆
    let canClone

    if (_.get(projectDetail, 'role') === 'super') {
      canEdit = canClone = true
    }

    if (parentType || window.__POWERED_BY_QIANKUN__) {
      canEdit = canClone = false
    }

    if (_.get(projectDetail, 'whitelist') && !_.get(projectDetail, 'role')) {
      console.log('抱歉, 您无权访问该项目')
      return <Exception403 />
    }

    const isProd = window.ENV === 'prod'

    return (
      <ConfigProvider locale={zhCN} prefixCls="ht">
        <div>
          <div className="page-home">
            <div className="page-home-buttons">
              {canEdit && (
                <IconButton
                  icon="folder"
                  title="项目管理"
                  href={this.getProjectUrl()}
                />
              )}

              {!isProd && canEdit && (
                <IconButton
                  icon="edit"
                  title="进入编辑器"
                  target="_self"
                  disabled={isLocalPage}
                  href={this.getEditUrl()}
                />
              )}

              {!isProd && canClone && (
                <IconButton
                  icon="fork"
                  title="克隆页面"
                  onClick={this.onCloneBtnClick}
                />
              )}

              {!isProd && canEdit && (
                <IconButton
                  icon="cloud-sync"
                  title="历史记录"
                  disabled={isLocalPage}
                  href={`/page/history?projectId=${_.get(projectDetail, 'id')}&route=${window.location.pathname}`}
                />
              )}

              {canEdit && (
                <IconButton
                  icon="question-circle"
                  title="查看文档"
                  href="http://139.155.239.172/"
                />
              )}

              {canEdit && (
                <IconButton
                  icon="bug"
                  title="查看日志"
                  href={projectDetail.project_code === 'admin' ? `/__hetu_log__` : `/__log__?projectCode=${projectDetail.project_code}`}
                />
              )}
            </div>

            <div className="page-home-content">
              <DocumentTitle title={get(pageConfig, 'title', '河图')}>
                {this.renderLayout(
                  projectDetail,
                  this.renderContent()
                )}
              </DocumentTitle>
            </div>
          </div>

          {isPlainObject(pageConfig) && isCloneModalVisible && <TheModalClone
            visible={isCloneModalVisible}
            pageConfig={pageConfig}
            projectDetail={projectDetail}
            onChange={(v: any) => this.setState({ isCloneModalVisible: v })}
          />}
        </div>

      </ConfigProvider>
    )
  }
}

export default PageHome
