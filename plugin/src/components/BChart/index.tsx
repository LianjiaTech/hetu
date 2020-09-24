import { Row, Spin } from 'antd'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import HtCard from '~/components/Card'
import HtForm from '~/components/Form'
import HtTable from '~/components/Table'
import { JsonSchema } from '~/types'
import { updateComponentAlias } from '~/utils'
import request from '~/utils/request'
import ChartComponents from './Chart'
import './index.less'
import {
  ChartConfig,
  ChartContentProperties,
  GeomConfig,
  GuideConfig,
  HtChartProps,
  HtChartState,
  TableConfig,
  ViewConfig,
} from './interface'

const { Guide, View } = ChartComponents

const HtChartFormAlias = '$$HtChartForm'
const ChartFetchDataAlias = '$$HtChartResponse'

const defaultFormConfig = {
  isCard: false,
  method: 'get' as JsonSchema.Method,
  responseAlias: ChartFetchDataAlias,
  alias: HtChartFormAlias,
  cols: 3,
  pageSize: 1000,
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
  submitButtonText: '搜索',
  isAutoSubmit: true,
  isShowSuccessMessage: false,
  onSuccessAction: '',
}

updateComponentAlias(ChartFetchDataAlias, {})
updateComponentAlias(HtChartFormAlias, {})

@observer
export default class HtBChart extends React.Component<
  HtChartProps,
  HtChartState
> {
  static displayName = 'HtBChart'

  static defaultProps: Partial<HtChartProps> = {
    chartConfig: [],
  }

  static getDerivedStateFromProps(nextProps: any, preState: any) {
    if (preState.pageSize) {
      return preState
    }

    let _pageSize = _.get(nextProps, 'tableConfig.pageSize', 20)
    return {
      ...preState,
      pageSize: _pageSize,
    }
  }

  state: HtChartState = {
    current: 1,
    isPageLoading: false,
  }

  TheFormSearch?: {
    submit: () => void
  }

  /**
   * 处理分页器变化
   */
  onPaginationChange = (current: number, pageSize: number) => {
    this.setState(
      {
        current,
        pageSize,
      },
      () => this.search()
    )
  }

  /**
   * 重置分页
   */
  resetPagination = () => {
    return new Promise((resolve, reject) => {
      try {
        this.setState(
          {
            current: 1,
          },
          () => {
            resolve()
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  // 搜索
  search = () => {
    const submit = _.get(this.TheFormSearch, 'submit')
    if (_.isFunction(submit)) {
      submit()
    }
  }

  /**
   * 设置页面loading
   */
  setPageLoading = (isPageLoading: boolean): void => {
    this.setState({ isPageLoading })
  }

  /**
   * 发送请求, 获取数据
   */
  sendFormData = async (values: JsonSchema.DynamicObject): Promise<void> => {
    try {
      const { pageSize, current } = this.state

      const { url, method = 'get' } = this.props.formConfig
      this.setPageLoading(true)

      // @ts-ignore
      const res = await request[method](url as string, {
        ...values,
        pageNum: current,
        pageSize,
      })
      // 请求格式校验
      const dataSource = _.get(res, 'data')
      const total = _.get(res, 'data.total')
      const { responseAlias = ChartFetchDataAlias, pagestate } = this.props

      await pagestate.setStoreState({
        [responseAlias]: dataSource,
      })
      this.setState({
        total,
        dataSource,
      })
      return res
    } finally {
      this.setPageLoading(false)
    }
  }

  /**
   * 获取buttons配置
   */
  getButtons = (
    buttons?: React.ReactNode[],
    fields?: JsonSchema.HtFieldBaseProps[]
  ) => {
    let _buttons = buttons
    if (
      !fields ||
      (_.isArray(fields) && !fields.length && buttons === undefined)
    ) {
      _buttons = []
    }
    if (_.isArray(fields) && fields.length > 0 && !buttons) {
      _buttons = ['submit', 'reset']
    }
    return _buttons
  }

  renderChartItem = (
    type: ChartContentProperties | 'Label',
    config: JsonSchema.DynamicObject[]
  ): React.ReactNode[] => {
    if (Array.isArray(config)) {
      let C = _.get(ChartComponents, type) as React.ComponentClass
      if (!C) return []
      return config.map((v, index) =>
        React.createElement(C, { ...v, key: `${type}-${index}` })
      )
    }
    return []
  }

  /**
   * 渲染ChartItem
   */
  renderChartContent = (
    type: ChartContentProperties,
    config: JsonSchema.DynamicObject[] | JsonSchema.DynamicObject
  ): React.ReactNode => {
    switch (type) {
      case 'Geom':
        if (Array.isArray(config)) {
          let C = _.get(ChartComponents, type) as React.ComponentClass
          if (!C) return null
          return config.map((v, index) => {
            const { Label, ...rest } = v as GeomConfig
            let children: React.ReactNode[] = []
            if (Array.isArray(Label)) {
              children = this.renderChartItem('Label', Label)
            }
            return React.createElement(
              C,
              { ...rest, key: `${type}-${index}` },
              ...children
            )
          })
        }
        return null
      case 'Coord':
      case 'Axis':
      case 'Legend':
        return this.renderChartItem(type, config as JsonSchema.DynamicObject[])
      case 'Tooltip':
        if (_.isPlainObject(config)) {
          // 兼容对象类型
          return this.renderChartItem('Tooltip', [
            config as JsonSchema.DynamicObject,
          ])
        }
        if (_.isArray(config)) {
          // 兼容数组类型
          return this.renderChartItem('Tooltip', config)
        }
        return null
      case 'Guide':
        if (Array.isArray(config)) {
          let children = config.map((v, index) => {
            const { type, ...rest } = v as GuideConfig
            const C = Guide[type]
            if (!C) return null
            // @ts-ignore
            return React.createElement(C, { ...rest, key: `${type}-${index}` })
          })
          return <Guide>{children}</Guide>
        }
        return null
      case 'View':
        if (Array.isArray(config)) {
          return config.map((v, index) => {
            const { alias, content, ...rest } = v as ViewConfig
            let children: any = []

            if (_.isPlainObject(content)) {
              Object.keys(content).forEach((key: any) => {
                children = [
                  ...children,
                  // @ts-ignore
                  ...this.renderChartContent(key, content[key]),
                ]
              })
            }

            const dataSource = alias
              ? _.get(this.state.dataSource, alias, [])
              : this.state.dataSource

            return (
              <View {...rest} data={dataSource} key={`view-${index}`}>
                {children}
              </View>
            )
          })
        }
        return null

      default:
        return null
    }
  }

  /**
   * 渲染Chart
   */
  renderChart = (chartConfig: ChartConfig, key: number): React.ReactNode => {
    const { pagestate } = this.props
    const { alias = '', content, ...otherProps } = chartConfig
    const dataSource = alias
      ? _.get(this.state.dataSource, alias, [])
      : this.state.dataSource
    if (_.isArray(dataSource) && dataSource.length > 0) {
      const { Chart } = ChartComponents
      return (
        <Chart
          {...otherProps}
          data={dataSource}
          pagestate={pagestate}
          key={key}
        >
          {_.isPlainObject(content) &&
            Object.keys(content).map(key =>
              this.renderChartContent(
                key as ChartContentProperties,
                content[key as ChartContentProperties]
              )
            )}
        </Chart>
      )
    }

    return null
  }

  /**
   * 渲染表格
   */
  renderTable = (tableConfig?: TableConfig) => {
    if (!tableConfig || !_.isPlainObject(tableConfig)) {
      return null
    }

    const { current, total, pageSize } = this.state
    const { pagestate } = this.props
    const {
      alias = 'list',
      pageSize: _pageSize,
      ...tableOtherConfig
    } = tableConfig

    let dataSource = alias
      ? _.get(this.state.dataSource, alias, [])
      : this.state.dataSource

    if (!_.isArray(dataSource)) {
      console.error('table对应的数据不存在')
      dataSource = []
    }

    const tableProps = {
      ...tableOtherConfig,
      dataSource,
      pagination: {
        pageSize,
        current,
        total: total ? total : dataSource.length,
        onChange: this.onPaginationChange,
        showTotal: (total: number) => `共${total}项`,
      },
      pagestate,
    }

    return (
      <HtTable
        {...tableProps}
        onDataSourceChange={this.search}
        data-pageconfig-path={`${this.props['data-pageconfig-path']}`}
      />
    )
  }

  render() {
    const { isPageLoading } = this.state
    const {
      isCard,
      title,
      extra,
      formConfig,
      chartConfig,
      tableConfig,
      pagestate,
      ...otherProps
    } = this.props

    const { buttons, fields } = formConfig

    const formProps = {
      ...defaultFormConfig,
      ...formConfig,
      buttons: this.getButtons(buttons, fields),
      pagestate,
      sendFormData: this.sendFormData,
      resetPagination: this.resetPagination,
      getRef: (c: any) => {
        this.TheFormSearch = c
      },
      'data-component-type': 'null',
    }

    const ChartContent =
      _.isArray(chartConfig) &&
      chartConfig.map((v, i) => this.renderChart(v, i))

    return (
      <HtCard
        isCard={isCard}
        title={title}
        extra={extra}
        pagestate={pagestate}
        {...otherProps}
      >
        <HtForm {...formProps} isCard={false} />
        <Row>{ChartContent}</Row>
        {this.renderTable(tableConfig)}
        {isPageLoading && <Spin size="large" className="g-spin" />}
      </HtCard>
    )
  }
}
