import React, { Fragment, Component } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import queryString from 'query-string'

import { emitter } from '~/utils/events'
import BaseIframe from '~/components/Iframe'
import TheStage from '../Stage'
import './index.less'
import { isKeyboardEvent } from '~/constant/keyboardEvent'

import { Props, ConnectState, selectedComponentData, IPageConfig } from './interface'
import { LeftWidth, HeaderHeight } from '~/routes/GuiEditor'
import { getContainerData, getHetu } from '~/utils'

export function getComponentProps(el: Element, pageConfig: IPageConfig): null | selectedComponentData {
  if (el && el.nodeType === 1) {
    // 判断是否为DOM节点, 必须同时有这两个key, 才是有效的组件节点
    let dataPageConfigPath = el.getAttribute('data-pageconfig-path')
    let dataComponentType = el.getAttribute('data-component-type')

    let isValidComponentType = getHetu('isValidComponentType')
    if (!isValidComponentType(dataComponentType) || !dataPageConfigPath) {
      // 向父节点查找
      return getComponentProps(el.parentNode as Element, pageConfig)
    }
    const dataProps = _.get(pageConfig, dataPageConfigPath)

    if (_.isPlainObject(dataProps)) {

      const reac = el.getBoundingClientRect()
      return {
        parentNode: el.parentNode,
        reac,
        dataPageConfigPath,
        // @ts-ignore
        dataComponentType,
      }
    } else {
      console.warn(`data-pageconfig-path:${dataPageConfigPath} is not valid`)
    }
  }

  return null
}









class TheContent extends Component<Props> {
  static displayName = 'TheContent'

  state = {
    width: '100%',
    height: '100%',
  }

  interval: NodeJS.Timeout

  iframe: HTMLIFrameElement

  $el: HTMLDivElement

  componentDidMount() {
    window.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('resize', this.onResize)
    emitter.on('highlightComponent', this.highlightComponent)
    emitter.on('clickThroughByPageConfigPath', this.clickThroughByPageConfigPath)

    this.calculationSelectedComponentData()
  }

  componentWillUnmount() {
    emitter.off('highlightComponent', this.highlightComponent)
    emitter.off('clickThroughByPageConfigPath', this.clickThroughByPageConfigPath)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('wheel', this.onWheel)

    clearInterval(this.interval)
    clearTimeout(this.timeoutHighlightComponent)
    clearInterval(this.intervalCalculationSelectedComponentData)
    this.calculationSelectedComponentData = () => { }
  }

  // 绑定触摸板事件
  onWheel = (e: WheelEvent) => {
    // 向左或向右滑动时 阻止默认行为
    if (e.deltaX < 0 || e.deltaX > 0) {
      e.preventDefault()
    }
  }

  // 绑定键盘事件
  onKeyDown = (e: KeyboardEvent) => {
    const { dispatch, isLockIframe } = this.props

    if (e.metaKey && e.keyCode === 83) {
      // 如果按键是command + s 则阻止默认行为，避免触发网页的保存
      e.preventDefault()
    }

    // TODO 根据不同的系统, 配置默认快捷键, 并允许用户配置快捷键
    if (isKeyboardEvent(e, 'shift')) {
      // ctrl + shift || commond + shift
      dispatch({
        type: 'guiEditor/setState',
        payload: {
          isLockIframe: !isLockIframe,
        },
      })
    }
  }

  onResize = _.debounce(() => {
    this.props.dispatch({
      type: 'guiEditor/setState',
      payload: {
        hoverComponentData: null,
        selectedComponentData: null,
      },
    })
  }, 500)

  onIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    const iframeDocument = _.get(this.iframe, 'contentWindow.document')
    // 每1秒去获取iframe的尺寸, 当修改元素, iframe 有延迟渲染时, 可以同步尺寸
    this.interval = setInterval(() => {
      const width = iframeDocument.documentElement.scrollWidth || iframeDocument.body.scrollWidth
      const height = iframeDocument.documentElement.scrollHeight || iframeDocument.body.scrollHeight
      this.setState({
        width,
        height,
      })
    }, 1000)
  }

  onStageMouseMove = _.throttle((e) => {
    const { isIframeLoading, isDragging, pageConfig } = this.props
    if (isIframeLoading || isDragging) return false

    // 获取点击的坐标
    const { clientX, clientY } = e
    if (!this.$el) return false
    const scrollTop = _.get(this.$el, 'parentNode.scrollTop')
    const scrollLeft = _.get(this.$el, 'parentNode.scrollLeft')

    const iframeDocument = _.get(this.iframe, 'contentWindow.document')
    if (_.isFunction(iframeDocument.elementFromPoint)) {
      const el = iframeDocument.elementFromPoint(
        clientX - LeftWidth + scrollLeft,
        clientY - HeaderHeight + scrollTop,
      )
      const hoverComponentData = getComponentProps(el, pageConfig)
      if (hoverComponentData) {
        this.props.dispatch({
          type: 'guiEditor/setState',
          payload: {
            hoverComponentData,
          },
        })
      }
    }
  }, 100)

  onStageMouseLeave = _.debounce((e) => {
    this.props.dispatch({
      type: 'guiEditor/setState',
      payload: {
        hoverComponentData: null,
      },
    })
  }, 500)

  last_calculation_time: Date = new Date()
  intervalCalculationSelectedComponentData: any
  // 动态计算selectedComponentData的尺寸
  calculationSelectedComponentData = () => {
    let _this = this
    // 两次执行的时间间隔
    let gup = 1000
    function calculate() {
      _this.last_calculation_time = new Date()
      const { dispatch, pageConfig } = _this.props
      const iframeDocument = _.get(_this.iframe, 'contentWindow.document')
      let dataPageConfigPath = _.get(_this.props, 'selectedComponentData.dataPageConfigPath')

      const el = iframeDocument.documentElement.querySelector(`[data-pageconfig-path='${dataPageConfigPath}']`)
      let hoverComponentData
      if (!el || (el && el.nodeType !== 1)) {
        // hoverComponentData = null
        hoverComponentData = null
      } else {
        hoverComponentData = getComponentProps(el, pageConfig)
      }

      dispatch({
        type: 'guiEditor/setState',
        payload: {
          selectedComponentData: hoverComponentData
        }
      })

      setTimeout(() => {
        _this.calculationSelectedComponentData()
      }, gup);
    }

    let diff = (new Date().getTime()) - this.last_calculation_time.getTime()
    if (diff < gup) {
      setTimeout(() => {
        _this.calculationSelectedComponentData()
      }, gup);
    } else {
      calculate()
    }
  }

  /**
   * 点击页面任意位置
   */
  onStageClick = (e: MouseEvent) => {
    const { pageConfig, hoverComponentData, selectedComponentData, containerData, isIframeLoading, isDragging, dispatch } = this.props

    let _this = this
    function _onStageClick() {
      _this.last_calculation_time = new Date()
      if (isIframeLoading || isDragging || !_.isPlainObject(hoverComponentData)) {
        return { containerData, selectedComponentData }
      } else {
        const { dataComponentType } = hoverComponentData

        const selectedButtons = getHetu(['editConfigMap', dataComponentType, 'selectedButtons'])

        let _containerData = getContainerData(pageConfig, hoverComponentData)

        dispatch({
          type: 'guiEditor/setState',
          payload: {
            selectedComponentData: hoverComponentData,
            activeTab: 'base',
            containerData: _containerData,
            isInsertItemMode: selectedButtons.indexOf('add') !== -1
          },
        })

        return { containerData: _containerData, selectedComponentData: hoverComponentData }
      }
    }

    return _onStageClick()
  }

  /**
   * 根据pageConfigPath获取DOM节点, 并高亮DOM节点
   */
  timeoutHighlightComponent: NodeJS.Timeout
  highlightComponent = (dataPageConfigPath: string, max: number = 100) => {
    this.last_calculation_time = new Date()
    if (max === 0) {
      console.error(`[data-pageconfig-path='${dataPageConfigPath}'] 对应的DOM节点不存在`)
      return
    }
    this.timeoutHighlightComponent && clearTimeout(this.timeoutHighlightComponent)
    const { dispatch, pageConfig } = this.props
    const iframeDocument = _.get(this.iframe, 'contentWindow.document')
    const el = iframeDocument.documentElement.querySelector(`[data-pageconfig-path='${dataPageConfigPath}']`)
    if (!el || (el && el.nodeType !== 1)) {
      // el节点可能没渲染出来, 等下一次事件循环再试
      this.timeoutHighlightComponent = setTimeout(() => {
        this.highlightComponent(dataPageConfigPath, max - 1)
      }, 30);
      return
    }

    const hoverComponentData = getComponentProps(el, pageConfig)
    dispatch({
      type: 'guiEditor/setState',
      payload: {
        activeTab: 'base',
        hoverComponentData,
        selectedComponentData: hoverComponentData
      }
    })
  }

  /**
   * 通过pageConfigPath触发iframe内部元素点击事件
   */
  clickThroughByPageConfigPath = (dataPageConfigPath: string, max: number = 100) => {
    this.last_calculation_time = new Date()
    if (max === 0) {
      console.error(`[data-pageconfig-path='${dataPageConfigPath}'] 对应的DOM节点不存在`)
      return
    }
    const iframeDocument = _.get(this.iframe, 'contentWindow.document')
    const el = iframeDocument.documentElement.querySelector(`[data-pageconfig-path='${dataPageConfigPath}']`)
    if (!el || (el && el.nodeType !== 1)) {
      // el节点可能没渲染出来, 等下一次事件循环再试
      setTimeout(() => {
        this.clickThroughByPageConfigPath(dataPageConfigPath, max - 1)
      }, 100);
      return
    }
  }

  getIframeUrl = () => {
    const { route, query } = queryString.parse(window.location.search)
    return route + (query ? '?' + query : '')
  }

  render() {
    const { width, height } = this.state
    const { isLockIframe } = this.props

    const stageStyle = { height: height + 'px', width: width + 'px' }

    let iframeSrc = this.getIframeUrl()

    return (
      <div
        className='the-gui-content'
        style={stageStyle}
        ref={(el) => (this.$el = el)}
      >
        <BaseIframe getRef={(c) => (this.iframe = c)} src={iframeSrc} onLoad={this.onIframeLoad} onKeydown={this.onKeyDown} />
        {isLockIframe && (
          <TheStage
            style={stageStyle}
            onMouseMove={this.onStageMouseMove}
            onMouseLeave={this.onStageMouseLeave}
            onClick={this.onStageClick}
          />
        )}
      </div>
    )
  }
}

export default connect(({ guiEditor }: ConnectState) => ({
  isIframeLoading: guiEditor.isIframeLoading,
  isInsertItemMode: guiEditor.isInsertItemMode,
  query: guiEditor.query,
  pageConfig: guiEditor.pageConfig,
  hoverComponentData: guiEditor.hoverComponentData,
  selectedComponentData: guiEditor.selectedComponentData,
  activeTab: guiEditor.activeTab,
  isLockIframe: guiEditor.isLockIframe,
  isDragging: guiEditor.isDragging,
  containerData: guiEditor.containerData
}))(TheContent)
