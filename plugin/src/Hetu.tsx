import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import { History } from 'history'
import cookie from 'js-cookie'
import _ from 'lodash'
import { autorun, observable, runInAction, toJS } from 'mobx'
import 'mobx-react-lite/batchingForReactDom'
import moment from 'moment'
import queryString from 'query-string'
import React, { Component } from 'react'
import localStorage from 'store'
import Exception from '~/components/Exception'
import { componentAliasMap } from '~/utils'
import { emitter } from '~/utils/events'
import {
  createElement,
  generateHash,
  resolveDependencies,
  resolveHook,
  resolveLocal,
  resolveRemote,
} from '~/utils/hetuTools'
import { HetuBody } from '~/utils/hoc'
import './index.less'
import { JsonSchema } from './types/index'

interface IPagestateCache {
  [hash: string]: JsonSchema.Pagestate
}
export let pagestateCache: IPagestateCache = {}

export interface HetuProps {
  // 唯一标识
  uniqueKey?: string
  // 页面标题
  title?: string
  // local
  local?: JsonSchema.DynamicObject
  // remote
  remote?: JsonSchema.Remote
  // 数据依赖
  dependencies?: JsonSchema.Dependencies
  // ReactNode 配置
  elementConfig: JsonSchema.ElementConfig
  // history 对象
  history: History
}

export interface HetuState {
  isPageInit: boolean
  isPageNotFound: boolean
  isPageParseError: boolean
  parseError?: string
  hash: string
}

// 被监控的字段
const watchedFields = [
  'uniqueKey',
  'local',
  'remote',
  'dependencies',
  'onRemoteResolved',
  'title',
]
export class Hetu extends Component<HetuProps, HetuState> {
  static displayName = 'Hetu'

  static defaultProps: Partial<HetuProps> = {}

  static getDerivedStateFromProps(nextProps: HetuProps, preState: HetuState) {
    const pageConfig = _.pick(nextProps, watchedFields)

    return {
      ...preState,
      hash: generateHash(JSON.stringify(pageConfig)),
    }
  }

  parsedElementConfig?: JsonSchema.ElementConfig

  constructor(props: HetuProps) {
    super(props)
    let hash = generateHash(JSON.stringify(_.pick(props, watchedFields)))

    this.state = {
      hash,
      isPageInit: !!pagestateCache[hash],
      isPageNotFound: false,
      isPageParseError: false,
    }

    this.init(hash)
  }

  async componentDidUpdate(_prevProps: HetuProps, prevState: HetuState) {
    // watchedFields变化, 说明页面发生了变化, 重新初始化pagestate
    if (this.state.hash && this.state.hash !== prevState.hash) {
      await this.init(this.state.hash)
      return
    }
  }

  /**
   * 获取pagestate
   */
  getPagestate = () => {
    const { hash } = this.state
    return pagestateCache[hash]
  }

  /**
   * 初始化页面
   */
  init = async (hash: string) => {
    if (hash && pagestateCache[hash]) {
      this.setState({
        isPageInit: true,
        isPageNotFound: false,
        isPageParseError: false,
        parseError: '',
      })
      return
    }

    const { history } = this.props
    const dataConfigFields = [
      'title',
      'local',
      'remote',
      'dependencies',
      'onRemoteResolved',
    ]
    const dataConfig = _.pick(this.props, dataConfigFields)
    const newPagestate = await this.generatePagastate(history, dataConfig)

    if (_.isError(newPagestate)) {
      // 出错啦
      const newState = {
        isPageInit: true,
        isPageNotFound: false,
        isPageParseError: true,
        parseError: newPagestate.message,
      }
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(newState)

      return
    }

    pagestateCache[hash] = observable(newPagestate)

    this.setState({
      isPageInit: true,
      isPageNotFound: false,
      isPageParseError: false,
      parseError: '',
    })

    autorun(
      () => {
        window.$$pagestate = toJS(pagestateCache[hash])
        if (process.env.NODE_ENV !== 'test') {
          console.log(
            `[${moment().format('HH:mm:ss')}] 数据中心变化`,
            window.$$pagestate
          )
        }
      },
      {
        delay: 100,
      }
    )
  }

  /**
   * 更新数据pagestate
   *
   * @param { JsonSchema.DynamicObject } payload 要更新的值, 例如 { pagination: { pageNum: 1 } }
   * @returns { Promise<pagestate> } pagestate
   */
  setStoreState = (
    payload: JsonSchema.DynamicObject
  ): JsonSchema.Pagestate | undefined => {
    let pagestate = this.getPagestate()

    if (_.isPlainObject(payload)) {
      runInAction(() => {
        for (let key in payload) {
          if (Object.prototype.hasOwnProperty.call(payload, key)) {
            pagestate && _.set(pagestate, key, payload[key])
          }
        }
      })
    }

    return pagestate
  }

  /**
   * 往pageConfig上添加全局属性
   * @param {Object} pageConfig
   * @returns {pagestate} pagestate
   */
  addGlobalAttribute = (
    pageConfig: JsonSchema.DataConfig,
    history: History
  ): JsonSchema.Pagestate => {
    const setStoreState = this.setStoreState

    let query = queryString.parse(history.location.search)
    // query为无原型对象, 将query原型指向Object
    query = { ...query }
    const location = { ...history.location, query }

    const { title } = pageConfig

    // 传递给子组件的属性
    return {
      ...componentAliasMap,
      ...pageConfig,
      history,
      title,
      location,
      moment,
      emitter,
      queryString,
      setStoreState,
      // 创建元素
      _C: (
        type: string,
        props: JsonSchema.DynamicObject = {},
        ...children: any[]
      ) => {
        const pagestate = this.getPagestate()

        return createElement(
          { type, props, children },
          {},
          '',
          pagestate as JsonSchema.Pagestate
        )
      },
      // 更新pagestate
      _S: (path: string[] | string, value: any) => {
        let pagestate = this.getPagestate() || {}
        runInAction(() => {
          _.set(pagestate, path, value)
        })

        return pagestate
      },
      localStorage: localStorage,
      cookie,
    }
  }

  /**
   * 页面初始化, 生成pagestate
   * @param { Object } _pageConfig { title, local, remote, dependencies, elementConfig } 页面配置
   * @returns { Promise }
   */
  generatePagastate = async (
    history: History,
    _pageConfig?: JsonSchema.DataConfig
  ): Promise<JsonSchema.Pagestate | Error> => {
    if (!_pageConfig) {
      console.error(`页面配置不存在`)
      return new Error(`页面配置不存在`)
    }

    try {
      let pagestate = this.addGlobalAttribute(_pageConfig, history) // 添加全局属性

      if (_pageConfig.local) {
        // 解析 local
        pagestate = resolveLocal(_pageConfig.local, pagestate)
      }

      if (_pageConfig.remote) {
        // 解析 remote
        pagestate = await resolveRemote(_pageConfig.remote, pagestate)
      }

      if (_pageConfig.dependencies) {
        // 解析 dependencies
        pagestate = await resolveDependencies(
          _pageConfig.dependencies,
          pagestate
        )
      }

      if (_pageConfig.onRemoteResolved) {
        resolveHook(_pageConfig.onRemoteResolved, pagestate)
      }

      if (process.env.NODE_ENV !== 'test') {
        console.log('页面初始化完毕', pagestate)
      }

      return pagestate
    } catch (e) {
      console.error(e.message)
      return e
    }
  }

  render() {
    const { elementConfig } = this.props
    const {
      hash,
      isPageInit,
      isPageNotFound,
      isPageParseError,
      parseError,
    } = this.state

    const pagestate = pagestateCache[hash]

    if (!isPageInit) {
      return (
        <ConfigProvider locale={zhCN} prefixCls="ht">
          <Spin size="large" className="g-spin" />
        </ConfigProvider>
      )
    }

    // 页面配置不存在
    if (isPageNotFound) {
      return (
        <ConfigProvider locale={zhCN} prefixCls="ht">
          <Exception
            type="404"
            desc="抱歉, 页面不见了"
            style={{ minHeight: 500, height: '80%' }}
          />
        </ConfigProvider>
      )
    }

    // 编译错误
    if (isPageParseError) {
      return (
        <ConfigProvider locale={zhCN} prefixCls="ht">
          <Exception
            type="500"
            desc={parseError || '编译错误'}
            style={{ minHeight: 500, height: '80%' }}
          />
        </ConfigProvider>
      )
    }

    if (!pagestate) {
      return null
    }

    const HetuBodyProps = {
      defaultProps: {},
      elementConfig,
      pagestate,
      dataPageConfigPath: 'elementConfig',
    }

    return (
      <ConfigProvider locale={zhCN} prefixCls="ht">
        <HetuBody {...HetuBodyProps} />
      </ConfigProvider>
    )
  }
}
