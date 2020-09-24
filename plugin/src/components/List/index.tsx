import { Spin } from 'antd'
import _, { get, isArray, isFunction, isNumber } from 'lodash'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import HtForm from '~/components/Form'
import { HtModalFormAlias } from '~/components/ModalForm'
import HtTable, {
  tableRowModalFormAlias,
  tableSelectionRowKeysAlias,
} from '~/components/Table'
import { JsonSchema } from '~/types'
import { updateComponentAlias } from '~/utils'
import { emitter } from '~/utils/events'
import message from '~/utils/message'
import request from '~/utils/request'
import HtCard from '../Card'
import './index.less'
import { ListComponentProps, ListComponentState } from './interface'

const ComponentAlias = '$$HtList'

updateComponentAlias(ComponentAlias, {})

@observer
export default class HtList extends Component<
  ListComponentProps,
  ListComponentState
> {
  static displayName = 'HtList'

  static __isContainer__ = true

  static defaultProps = {
    isCard: false,
    method: 'get',
    alias: ComponentAlias,
    cols: 3,
    pageSize: 20,
    isPagination: true,
    pageSizeOptions: ['10', '20', '50', '100', '500', '1000'],
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
    submitButtonText: '查询',
    isAutoSubmit: true,
    isShowSuccessMessage: false,
    columnsSetting: false,
    fieldMap: {
      pageNumKey: 'pageNum',
      pageSizeKey: 'pageSize',
      listKey: 'list',
      totalKey: 'total',
    },
  }

  state = {
    isPageLoading: false,
  }

  @computed get responseAlias() {
    return `${this.props.alias}Response`
  }

  // 当前页current在pagestate中的别名
  @computed get currentAlias() {
    return `${this.props.alias}Current`
  }

  // 当前分页页
  @computed get current() {
    return _.get(this.props.pagestate, this.currentAlias, 1)
  }

  // 当前页pagesize在pagestate中的别名
  @computed get pagesizeAlias() {
    return `${this.props.alias}Pagesize`
  }

  // 分页大小
  @computed get pageSize() {
    return _.get(this.props.pagestate, this.pagesizeAlias, this.props.pageSize)
  }

  TheFormSearch?: {
    submit: () => Promise<any>
  }

  componentDidMount() {
    emitter.on('HtList.resetSearch', this.resetSearch)
    emitter.on('HtList.search', this.search)
  }

  componentWillUnmount() {
    emitter.off('HtList.resetSearch', this.resetSearch)
    emitter.off('HtList.search', this.search)
  }

  // 设置页面loading
  setPageLoading = (isPageLoading: boolean) => {
    this.setState({ isPageLoading })
  }

  /**
   * 重置
   */
  resetPagination = () => {
    const { setStoreState } = this.props.pagestate

    setStoreState({
      [this.currentAlias]: 1,
    })
  }

  /**
   * 重置 && 搜索
   */
  resetSearch = async () => {
    this.resetPagination()
    await this.search()
  }

  // 搜索
  search = async () => {
    const submit = get(this.TheFormSearch, 'submit')
    if (isFunction(submit)) {
      await submit()
    }
  }

  /**
   * 处理分页器变化
   */
  onPaginationChange = (current: number, pageSize: number) => {
    const { setStoreState } = this.props.pagestate

    setStoreState({
      [this.currentAlias]: current,
      [this.pagesizeAlias]: pageSize,
    })

    this.search()
  }

  /**
   * 发送请求, 获取数据
   */
  sendFormData = async (values: JsonSchema.DynamicObject): Promise<any> => {
    let res: any
    const current = this.current
    const pageSize = this.pageSize
    const {
      url,
      method,
      isShowSuccessMessage,
      pagestate,
      fieldMap,
    } = this.props
    const { pageNumKey, pageSizeKey } = fieldMap
    this.setPageLoading(true)

    const alias = this.props.alias || ComponentAlias
    const { sort, sortKey, filterName } = _.get(pagestate, alias, {})

    try {
      res = await request[method as 'get'](url as string, {
        [pageNumKey]: current,
        [pageSizeKey]: pageSize,
        sort,
        sortKey,
        ...values,
        ...filterName,
      })

      const { setStoreState } = pagestate
      setStoreState({
        [this.responseAlias]: res,
        [tableRowModalFormAlias]: {},
        [HtModalFormAlias]: {},
        [tableSelectionRowKeysAlias]: [],
      })

      if (isShowSuccessMessage) {
        message.success(res.message || '请求成功')
      }
      this.setPageLoading(false)

      return res
    } catch (e) {
      this.setPageLoading(false)
      throw e
    }
  }

  render() {
    const { isPageLoading } = this.state

    const current = this.current
    const pageSize = this.pageSize

    let {
      // tab配置
      // Card配置
      isCard,
      extra,
      cardType,
      description,
      // form配置
      url,
      method,
      fields,
      alias,
      cols,
      labelCol,
      wrapperCol,
      buttons,
      submitButtonText,
      backButtonText,
      resetButtonText,
      buttonGroupProps,
      isAutoSubmit,
      isShowSuccessMessage,
      transform,
      pageSize: _pageSize,
      // table配置
      pageSizeOptions,
      uniqueKey,
      fieldMap,
      columnsSetting,
      scroll,
      scrollWidth,
      columns,
      actionColumn,
      selectionButtons,
      selections,
      pagestate,
      children,
      isPagination,
      ...otherProps
    } = this.props

    const res = _.get(pagestate, this.responseAlias, {})
    const { listKey, totalKey } = fieldMap

    // 请求响应数据格式校验
    let dataSource = _.get(res.data, listKey, [])

    let total = _.get(res.data, totalKey, 1)

    if (!isArray(dataSource)) {
      console.error(`请求${url}响应格式错误,data${listKey}必须为一个数组`)
      dataSource = []
    }

    if (!isNumber(_.toNumber(total))) {
      console.error(`请求${url}响应格式错误,data${totalKey}必须为number类型`)
      total = 0
    }

    let _buttons = buttons
    if (
      !fields ||
      (isArray(fields) && !fields.length && _buttons === undefined)
    ) {
      _buttons = []
    }

    if (isArray(fields) && fields.length > 0 && !buttons) {
      _buttons = ['submit', 'reset']
    }

    if (scrollWidth) {
      scroll = {
        x: scrollWidth,
      }
    }

    const formProps = {
      method,
      onSuccessAction: '',
      alias,
      url,
      fields,
      cols,
      labelCol,
      wrapperCol,
      buttons: _buttons,
      submitButtonText,
      backButtonText,
      resetButtonText,
      buttonGroupProps,
      isAutoSubmit,
      isShowSuccessMessage,
      transform,
      pagestate,
    }

    let paginationOptions: any
    if (isPagination !== false) {
      paginationOptions = {
        pageSize,
        current,
        total,
        onChange: this.onPaginationChange,
        showTotal: (total: number) => `共${total}项`,
        showSizeChanger: true,
        onShowSizeChange: this.onPaginationChange,
        pageSizeOptions,
      }
    } else {
      paginationOptions = false
    }

    const tableProps = {
      uniqueKey,
      columnsSetting,
      pagination: paginationOptions,
      dataSource,
      selectionButtons,
      selections,
      scroll,
      columns,
      actionColumn,
      pagestate,
    }

    return (
      <HtCard
        isCard={isCard}
        extra={extra}
        cardType={cardType}
        description={description}
        pagestate={pagestate}
        data-component-type="HtList"
        data-pageconfig-path={`${this.props['data-pageconfig-path']}`}
        {...otherProps}
        render={({ Extra }) => (
          <div className="ht-list-container">
            <HtForm
              {...formProps}
              sendFormData={this.sendFormData}
              resetPagination={this.resetPagination}
              getRef={c => {
                this.TheFormSearch = c
              }}
              data-pageconfig-path={`${this.props['data-pageconfig-path']}`}
              data-component-type="ignore"
              isCard={false}
              isResetShouldSubmit={true}
            />
            <HtTable
              {...tableProps}
              Extra={Extra}
              onDataSourceChange={this.search}
              data-pageconfig-path={`${this.props['data-pageconfig-path']}`}
              _data-component-type="ignore"
              aliasTable={alias}
            />
          </div>
        )}
      >
        {isPageLoading && <Spin size="large" className="g-spin" />}
      </HtCard>
    )
  }
}
