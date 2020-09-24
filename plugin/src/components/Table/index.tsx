/* eslint-disable max-params */
/* eslint-disable no-case-declarations */
import {
  Button,
  Divider,
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import { TableProps } from 'antd/es/table'
import classnames from 'classnames'
import _, {
  cloneDeep,
  get,
  isArray,
  isFunction,
  isNumber,
  isPlainObject,
  omit,
} from 'lodash'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import moment from 'moment'
import queryString from 'query-string'
import React, { Component, Fragment } from 'react'
import HtmlFragment from '~/components/HtmlFragment'
import HtModalForm from '~/components/ModalForm'
import { JsonSchema } from '~/types'
import { updateComponentAlias } from '~/utils'
import { _resolveAction } from '~/utils/actions'
import message from '~/utils/message'
import request from '~/utils/request'
import './index.less'
import {
  selectedRowKeys,
  SelectionButton,
  TableColumn,
  TableColumnOperation,
  TableComponentProps,
  TableComponentState,
} from './interfacce'

export const tableRowModalFormAlias = '$$tableRowModalFormData'
export const tableSelectionRowKeysAlias = '$$tableSelectionRowKeys'

updateComponentAlias(tableRowModalFormAlias, {})
updateComponentAlias(tableSelectionRowKeysAlias, [])

/**
 * 转换请求
 *
 * @param {String} uniqueKey 表格唯一key
 * @param {Function} transform 转换的函数
 * @param {Object} row 表格行数据
 * @param {Object} data 表单数据
 * @return {Object} 转换后的值
 */
// eslint-disable-next-line max-params
export function transformParams(
  uniqueKey: string,
  transform: JsonSchema.FormTransform | undefined,
  row: { [key: string]: any },
  data: JsonSchema.DynamicObject = {}
): object {
  let result = { ...data, [uniqueKey]: row[uniqueKey] }
  // 如果为一个function
  if (isFunction(transform)) {
    let res = transform(row, data)

    if (isPlainObject(res)) {
      return res
    } else {
      throw new TypeError('function transform must return a plain object')
    }
  }

  return result
}

interface TableColumnWrapProps {
  showOverflowTooltip?: boolean
  text?: React.ReactText
  width?: string | number
}
const TableColumnWrap = (props: TableColumnWrapProps): React.ReactNode => {
  if (!props.showOverflowTooltip) return props.text
  return (
    <Tooltip title={props.text}>
      <div className="ht-table-column--nowrap" style={{ width: props.width }}>
        {props.text}
      </div>
    </Tooltip>
  )
}

@observer
export default class HtTable extends Component<
  TableComponentProps,
  TableComponentState
> {
  static displayName = 'HtTable'

  static defaultProps = {
    uniqueKey: 'id',
    dataSource: [],
    pagination: false,
    onDataSourceChange: () => {},
  }

  state = {
    isPageLoading: false,
    // 弹框是否可见
    isFormModalvisible: false,
    // 弹框表单数据
    isDropdownVisible: false,
    menuCheck: [],
    sortInfo: false,
    sortKey: '',
    filterName: null,
  }

  @observable modalConfirm?: { update: (v: any) => void }

  @observable selectedBtnPath?: string

  @observable $HtModalForm?: {
    toggleModalVisible: (v: boolean) => void
  }

  componentDidMount() {
    const { columnsSetting, columns } = this.props
    if (columnsSetting) {
      this.setState({
        menuCheck: Array(columns.length).fill(true),
      })
    }
  }

  // 设置页面loading
  setPageLoading = (isPageLoading: boolean) => {
    this.setState({ isPageLoading })
  }

  /**
   * 表格某一行的按钮点击事件处理
   */
  onTableBtnClick = (
    item: TableColumnOperation,
    row: JsonSchema.DynamicObject
  ) => {
    const { uniqueKey, onDataSourceChange, pagestate } = this.props
    let {
      text,
      actionType = 'jump',
      target,
      url: _url,
      method = 'post',
      transform,
    } = item

    let url = _url
    if (_.isFunction(_url)) {
      url = _url(row)
    }

    // 发送ajax请求
    if (actionType === 'xhr') {
      let params = transformParams(uniqueKey, transform, row)

      if (!params) {
        return false
      }

      this.setPageLoading(true)

      return request[method as 'get'](url, params)
        .then(() => {
          message.success(`${text}成功`)
          this.setPageLoading(false)
          onDataSourceChange()
        })
        .catch((e: Error) => {
          this.setPageLoading(false)
          throw e
        })
    }

    // 页面内跳转
    if (actionType === 'jump') {
      let query = transformParams(uniqueKey, transform, row)

      let search = queryString.stringify(query)

      if (target === '_blank') {
        _resolveAction('redirectTo', `${url}?${search}`)
        return false
      }

      _resolveAction('redirectTo', `${url}?${search}`, pagestate)
      return false
    }

    // 打开新窗口
    if (actionType === 'open') {
      let query = transformParams(uniqueKey, transform, row)
      let search = queryString.stringify(query)
      _resolveAction('openWindow', `${url}?${search}`)
      return false
    }

    // 渲染弹框
    if (actionType === 'modalForm') {
      const setStoreState = get(this.props, 'pagestate.setStoreState')

      // @ts-ignore
      this.selectedBtnPath = item.__path__
      setStoreState({
        [tableRowModalFormAlias]: row,
      })
      // 在下一次事件渲染, 开启弹框
      setTimeout(() => {
        this.toggleModalFormVisible(true)
      })

      return false
    }

    console.warn(`未知类型${actionType}`)
    return false
  }

  onSwitchChange = ({
    checked,
    url,
    method = 'post',
    transform,
    record,
    dataIndex,
  }: any) => {
    const { uniqueKey, onDataSourceChange } = this.props
    let params = transformParams(uniqueKey, transform, record, {
      [dataIndex]: _.toNumber(checked),
    })

    if (!params) {
      return false
    }

    this.setPageLoading(true)

    return request[method as 'get'](url, params)
      .then(() => {
        message.success(`切换成功`)
        this.setPageLoading(false)
        onDataSourceChange()
      })
      .catch((e: Error) => {
        this.setPageLoading(false)
        throw e
      })
  }

  // 表格选中项变化时
  onTableSelectChange = (selectedRowKeys: (string | number)[]) => {
    const { setStoreState } = this.props.pagestate
    setStoreState({
      [tableSelectionRowKeysAlias]: selectedRowKeys,
    })
  }

  // 切换ModalForm状态
  toggleModalFormVisible = (visible: boolean) => {
    // this.setState({ isFormModalvisible: visible })
    const toggleModalVisible = get(this.$HtModalForm, 'toggleModalVisible')
    if (isFunction(toggleModalVisible)) {
      toggleModalVisible(visible)
    }
  }

  // Todo 使用renderSelections代替
  // old渲染批量选中的按钮
  renderSelectionButtons = (
    children: SelectionButton[],
    selectedRowKeys: string[],
    dataPagestatePath?: string
  ) => {
    if (!isArray(children)) {
      return null
    }

    const { onDataSourceChange, pagestate } = this.props

    return children.map((child, i) => {
      const {
        selectionKey = 'ids',
        selectionTitle,
        triggerButtonText,
        fields,
        transform = (v: any) => v,
        ...rest
      } = child

      const _transform = (data: JsonSchema.DynamicObject) => {
        if (isFunction(transform)) {
          return transform({
            [selectionKey]: selectedRowKeys.join(),
            ...data,
          })
        } else {
          return (data: JsonSchema.DynamicObject) => ({
            [selectionKey]: selectedRowKeys.join(),
            ...data,
          })
        }
      }

      return (
        <HtModalForm
          {...rest}
          transform={_transform}
          title={triggerButtonText}
          triggerButtonText={triggerButtonText}
          triggerButtonProps={{ disabled: !selectedRowKeys.length }}
          onSuccess={onDataSourceChange}
          onSuccessAction="trigger:HtList.search"
          fields={fields}
          pagestate={pagestate}
          key={i}
          data-pageconfig-path={`${dataPagestatePath}[${i}]`}
        />
      )
    })
  }

  // new 渲染批量选中的按钮
  renderSelections = (
    children: React.ReactNode[],
    selectedRowKeys: string[],
    dataPagestatePath: string
  ) => {
    if (isArray(children)) {
      return children.map((child, i) => {
        if (React.isValidElement(child)) {
          let props = {
            key: i,
            disabled: selectedRowKeys.length === 0,
            'data-pageconfig-path': `${dataPagestatePath}[${i}]`,
          }

          return React.cloneElement(child, props)
        }

        return child
      })
    }
    return null
  }

  /**
   * 渲染表格行, 更多按钮
   */
  renderTableColumnMore = (
    menus: TableColumnOperation[],
    row: JsonSchema.DynamicObject
  ) => {
    if (!isArray(menus) || !menus.length) return null

    const menu = (
      <Menu>
        {menus.map((item, i) => (
          <Menu.Item key={i}>
            {this.renderTableColumnButton(item, row)}
          </Menu.Item>
        ))}
      </Menu>
    )

    return (
      <>
        <Divider type="vertical" />
        <Dropdown overlay={menu}>
          <Button className="ant-dropdown-link" type="link">
            更多
            <Icon type="down" />
          </Button>
        </Dropdown>
      </>
    )
  }

  // 渲染表格行按钮
  renderTableColumnButton = (
    item: TableColumnOperation,
    row: JsonSchema.DynamicObject
  ) => {
    const { uniqueKey } = this.props
    const id = `table-row-link-${row[uniqueKey]}`
    if (item.actionType === 'xhr') {
      return (
        <Popconfirm
          placement="topRight"
          title={`确定要${item.text}`}
          onConfirm={() => this.onTableBtnClick(item, row)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            id={id}
            type="link"
            className={classnames('table-row-link', 'danger')}
          >
            {item.text}
          </Button>
        </Popconfirm>
      )
    }

    if (item.actionType === 'download') {
      const { uniqueKey } = this.props
      let downloadObject = transformParams(uniqueKey, item.transform, row)
      let downloadUrl = item.url + '?' + queryString.stringify(downloadObject)

      return (
        <Button
          id={id}
          type="link"
          href={downloadUrl}
          className={classnames('table-row-link')}
        >
          {item.text}
        </Button>
      )
    }

    return (
      <Button
        id={id}
        type="link"
        className={classnames('table-row-link')}
        onClick={() => this.onTableBtnClick(item, row)}
        data-item={JSON.stringify(item)}
      >
        {item.text || item.triggerButtonText}
      </Button>
    )
  }

  produceTooltipTitle = (title: any, tooltip: any) => {
    if (tooltip) {
      return (
        <div>
          <span>{title}</span>
          <Tooltip title={tooltip}>
            <Icon type="question-circle-o" style={{ marginLeft: '5px' }} />
          </Tooltip>
        </div>
      )
    } else {
      return <span>{title}</span>
    }
  }

  // 渲染表格列
  renderColumns = (_columns: TableColumn[], dataPageConfigPath: string) => {
    const { menuCheck, sortKey, sortInfo, filterName } = this.state
    const { pagestate, aliasTable = '' } = this.props
    const restSort = _.get(pagestate, [aliasTable, 'restSort']) // 是否重置

    const columns = cloneDeep(_columns)
    menuCheck.map((item: boolean, key: number) => {
      if (!item) {
        columns[key]['v-if'] = false
      }
      return columns
    })

    return (
      columns
        // eslint-disable-next-line complexity
        .map((column, index) => {
          const {
            tooltip,
            operations,
            // [旧] 弹框表单
            operations2,
            // [新] 弹框表单
            operations3,
            render,
            renderType,
            // @ts-ignore
            customRender,
            width,
            showOverflowTooltip,
            max = 3,
            fixed,
            renderProps,
            sort,
            dataIndex,
            filterColumns,
            filterOptions,
            'v-if': vIf,
          } = column

          if (fixed === true) {
            column.fixed = 'right'
          }

          column.title = this.produceTooltipTitle(column.title, tooltip)

          // 排序
          if (sort) {
            // @ts-ignore
            column.sorter = true
            // @ts-ignore
            column.sortOrder =
              sortKey === dataIndex && !restSort ? sortInfo : false
          }

          // 筛选
          if (filterColumns) {
            // @ts-ignore
            column.filters = filterOptions
            // @ts-ignore
            column.filterMultiple = true // 可以多选
            // @ts-ignore
            column.filteredValue =
              // @ts-ignore
              (!restSort && filterName && filterName[dataIndex]) || null
          }

          if (!column.onHeaderCell) {
            // @ts-ignore
            column.onHeaderCell = () => {
              return {
                'data-component-type': 'HtList.column',
                'data-pageconfig-path': `${dataPageConfigPath}[${index}]`,
              }
            }
          }

          if (render) {
            if (!isFunction(render)) {
              column.render = undefined
              console.error(
                'render must be an function, but actually is:' + render
              )
            }
            return column
          }

          // 渲染类型 列操作
          if ((operations || operations2) && renderType !== 'operations_new') {
            // @ts-ignore
            let __type__ = column.__type__ || `columns[${index}]`
            column.render = (_text, record) => {
              let filterOperates: any[] = []

              if (Array.isArray(operations)) {
                filterOperates = operations
                  .map((item, i) => {
                    return {
                      ...item,
                      __path__: `${__type__}.operations[${i}]`,
                    }
                  })
                  .filter(o => {
                    // v-if 后面接收一个function
                    if (isFunction(o['v-if'])) {
                      return o['v-if'](record)
                    }
                    // v-if 后面接收一个bool值
                    return o['v-if'] !== false
                  })
              }

              if (Array.isArray(operations2)) {
                filterOperates = operations2
                  .map((item, i) => ({
                    ...item,
                    actionType: 'modalForm',
                    __path__: `${__type__}.operations2[${i}]`,
                  }))
                  .filter(o => {
                    // v-if 后面接收一个function
                    if (isFunction(o['v-if'])) {
                      return o['v-if'](record)
                    }
                    // v-if 后面接收一个bool值
                    return o['v-if'] !== false
                  })
                  .concat(filterOperates)
              }

              return (
                <>
                  {filterOperates.slice(0, max).map((item, index) => (
                    <Fragment key={index}>
                      {index !== 0 && <Divider type="vertical" />}
                      {this.renderTableColumnButton(item, record)}
                    </Fragment>
                  ))}
                  {this.renderTableColumnMore(
                    filterOperates.slice(max),
                    record
                  )}
                </>
              )
            }
            return column
          }

          function checkVisible(row: any) {
            if (_.isFunction(vIf)) {
              return vIf(row)
            }
            return vIf === false ? false : true
          }

          switch (renderType) {
            case 'boolean': // 布尔
              column.render = (text: string, record) =>
                checkVisible(record) && (text ? '是' : '否')
              return column
            case 'img': // 图片
              column.render = (text: string, record) =>
                checkVisible(record) &&
                text && <img src={text} width={width} {...renderProps} alt="" />
              return column
            case 'a': // 链接
              column.render = (_text: string, record) => {
                if (!checkVisible(record)) return null

                // @ts-ignore
                const text: string = column.text || _text
                return (
                  <a href={_text} {...renderProps}>
                    {TableColumnWrap({ text, width, showOverflowTooltip })}
                  </a>
                )
              }
              return column
            case 'time': // 时间
              column.render = (text: string, record) => {
                if (!checkVisible(record)) return null

                if (isNumber(text)) {
                  // eslint-disable-next-line no-param-reassign
                  text = moment(text).format('YYYY-MM-DD HH:mm')
                }
                return TableColumnWrap({ text, width, showOverflowTooltip })
              }
              return column
            case 'date': // 日期
              column.render = (text: string, record) => {
                if (!checkVisible(record)) return null

                if (isNumber(text)) {
                  // eslint-disable-next-line no-param-reassign
                  text = moment(text).format('YYYY-MM-DD')
                }
                return TableColumnWrap({ text, width, showOverflowTooltip })
              }
              return column
            case 'switch':
              column.render = (text: string, record: object) => {
                if (!checkVisible(record)) return null

                const {
                  dataIndex,
                  // @ts-ignore
                  checkedChildren,
                  // @ts-ignore
                  unCheckedChildren,
                  // @ts-ignore
                  url,
                  // @ts-ignore
                  method,
                  // @ts-ignore
                  transform,
                } = column

                return (
                  <Switch
                    checkedChildren={checkedChildren}
                    unCheckedChildren={unCheckedChildren}
                    checked={!!text}
                    onChange={checked =>
                      this.onSwitchChange({
                        dataIndex,
                        checked,
                        url,
                        method,
                        transform,
                        record,
                      })
                    }
                  />
                )
              }
              return column
            case 'tag':
              // @ts-ignore
              const { color, isWrapper, tagOptoo } = column
              column.render = (text: any, _record: object) => {
                if (!checkVisible(_record)) return null
                let _color = color
                if (_.isFunction(color)) {
                  _color = _color(text, _record)
                }
                if (_.isArray(text)) {
                  let result: any[] = []
                  text.forEach((v, i) => {
                    result.push(
                      <Tag color={_color} key={`tag-${i}`}>
                        {v}
                      </Tag>
                    )
                    if (isWrapper) {
                      result.push(<br />)
                    }
                  })
                  return result
                }
                return <Tag color={_color}>{text}</Tag>
              }
              return column
            case 'enumeration': // 枚举
              // @ts-ignore
              let { options } = column
              column.render = (text: React.ReactText, record: any) => {
                if (!checkVisible(record)) return null

                if (_.isArray(options)) {
                  const item = options.find(v => _.get(v, 'value') === text)

                  if (_.isPlainObject(item)) {
                    const { label, color } = item
                    if (color === 'gray') {
                      return (
                        <Tag
                          style={{
                            background: '#fafafa',
                            border: '1px solid #d9d9d9',
                            color: '#d9d9d9',
                          }}
                        >
                          {label}
                        </Tag>
                      )
                    }
                    return <Tag color={color}>{label}</Tag>
                  }
                }

                return text
              }
              return column
            case 'customize':
              if (_.isFunction(customRender)) {
                column.render = (_text: string, _record: object) => {
                  let html = customRender(_text, _record)

                  return _.isString(html) ? (
                    <HtmlFragment __html={html} />
                  ) : (
                    html
                  )
                }
              }
              return column
            case 'operations_new':
              // @ts-ignore
              let __type__ = column.__type__ || `columns[${index}]`
              column.render = (_text, record) => {
                let filterOperates: any[] = []

                if (Array.isArray(operations)) {
                  filterOperates = operations
                    .map((item, i) => {
                      return {
                        ...item,
                        __path__: `${__type__}.operations[${i}]`,
                      }
                    })
                    .filter(o => {
                      // v-if 后面接收一个function
                      if (isFunction(o['v-if'])) {
                        return o['v-if'](record)
                      }
                      // v-if 后面接收一个bool值
                      return o['v-if'] !== false
                    })
                }

                if (Array.isArray(operations3)) {
                  filterOperates = operations3
                    .map((item, i) => {
                      if (item.__noRender !== true) {
                        throw new Error(
                          `operations3 配置错误, 缺少__noRender字段`
                        )
                      }

                      return {
                        // @ts-ignore
                        ..._.get(item, 'props', {}),
                        actionType: 'modalForm',
                        __path__: `${__type__}.operations3[${i}]`,
                      }
                    })
                    .filter((o: JsonSchema.DynamicObject) => {
                      // v-if 后面接收一个function
                      if (isFunction(o['v-if'])) {
                        return o['v-if'](record)
                      }
                      // v-if 后面接收一个bool值
                      return o['v-if'] !== false
                    })
                    .concat(filterOperates)
                }

                return (
                  <>
                    {filterOperates.slice(0, max).map((item, index) => (
                      <Fragment key={index}>
                        {index !== 0 && <Divider type="vertical" />}
                        {this.renderTableColumnButton(item, record)}
                      </Fragment>
                    ))}
                    {this.renderTableColumnMore(
                      filterOperates.slice(max),
                      record
                    )}
                  </>
                )
              }
              return column
            case 'default': // 默认
            default:
              column.render = (text: string, _record: object) => {
                if (!checkVisible(_record)) return null

                let _text: string = text
                if (isPlainObject(text) || isArray(text)) {
                  _text = JSON.stringify(text)
                }
                return TableColumnWrap({
                  text: _text,
                  width,
                  showOverflowTooltip,
                })
              }
              return column
          }
        })
        .filter(item => item['v-if'] !== false)
    )
  }

  // 渲染弹框表单
  renderModalForm = (
    pagestate: JsonSchema.Pagestate,
    uniqueKey: string,
    onDataSourceChange: Function
  ) => {
    if (!this.selectedBtnPath) return null

    const config: any = _.get(this.props, this.selectedBtnPath)

    const rowData = _.get(pagestate, tableRowModalFormAlias)

    if (!isPlainObject(config)) {
      console.error('selectedBtnPath is not valid:', this.selectedBtnPath)
      return null
    }

    let _config = config
    if (config.__noRender && config.props) {
      _config = config.props
    }

    let {
      url,
      method = 'post',
      text,
      title,
      fields = [],
      buttons,
      transform,
      ...rest
    } = _config

    const modalFormProps = {
      ...rest,
      triggerButtonText: null,
      transform: (data: JsonSchema.DynamicObject) => {
        return transformParams(uniqueKey, transform, rowData, data)
      },
      alias: tableRowModalFormAlias,
      url,
      method,
      fields,
      title: title || text,
      pagestate,
      buttons,
      getRef: (c: any) => {
        this.$HtModalForm = c
      },
      onSuccess: onDataSourceChange,
      onSuccessAction: 'trigger:HtList.search',
      'data-pageconfig-path': `${this.props['data-pageconfig-path']}.props.${this.selectedBtnPath}`,
    }

    return <HtModalForm {...modalFormProps} />
  }

  handleDropdownVisibleChange = (visible: boolean) => {
    this.setState({
      isDropdownVisible: visible,
    })
  }

  setColumns = (index: number) => {
    const { columns } = this.props
    const { menuCheck } = this.state
    // @ts-ignore
    menuCheck[index] = !menuCheck[index]
    this.setState({
      menuCheck: menuCheck,
    })
    if (menuCheck[index]) {
      // @ts-ignore
      columns[index]['v-if'] = true
    } else {
      // @ts-ignore
      columns[index]['v-if'] = false
    }
  }

  renderOverlay = () => {
    const { columns } = this.props
    let { menuCheck } = this.state
    return (
      <Menu className="ht-header-menu">
        {columns.map((item, i) => {
          return (
            <Menu.Item
              key={i}
              onClick={() => {
                this.setColumns(i)
              }}
            >
              <span>{item.title}</span>
              {menuCheck[i] && <Icon type="check" />}
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }

  handleChangeTable = (_pagination: any, filters: any, sorter: any) => {
    const { aliasTable = '', pagestate, onDataSourceChange } = this.props

    this.setState({
      sortInfo: sorter.order,
      sortKey: sorter.field,
      filterName: filters,
    })

    const formData = _.get(pagestate, aliasTable)

    pagestate.setStoreState({
      [aliasTable]: {
        ...formData,
        sort: sorter.order,
        sortKey: sorter.field,
        filterName: filters,
        restSort: false,
      },
    })

    if (_.isFunction(onDataSourceChange)) {
      // 触发搜索
      onDataSourceChange()
    }
  }

  render() {
    const { isPageLoading, isDropdownVisible } = this.state
    let {
      uniqueKey,
      columnsSetting,
      columns = [],
      actionColumn,
      dataSource: _tableData,
      pagination,
      scroll,
      selectionButtons,
      selections,
      Extra,
      pagestate,
      onDataSourceChange,
      'data-component-type': _dataComponentType,
      ...otherProps
    } = this.props

    const tableData = _tableData.slice()

    const selectedRowKeys: selectedRowKeys = _.get(
      pagestate,
      tableSelectionRowKeysAlias,
      []
    ).slice()

    const rowSelection = {
      columnWidth: '60px',
      selectedRowKeys: selectedRowKeys,
      onChange: this.onTableSelectChange,
    }

    // columns合并
    let _columns = columns.slice()
    if (actionColumn && (actionColumn.operations || actionColumn.operations2)) {
      _columns.push({
        // @ts-ignore
        __type__: `actionColumn`,
        title: '操作',
        fixed: actionColumn.fixed ? 'right' : false,
        ...omit(actionColumn, 'fixed'),
        onHeaderCell: () => {
          return {
            'data-component-type': 'HtList.actionColumn',
            'data-pageconfig-path': `${this.props['data-pageconfig-path']}.props.actionColumn`,
          }
        },
      })
    }

    // 给数据加上key/序号
    const dataSource = _.isArray(tableData)
      ? tableData.map((item, index) => {
          if (!item.key) {
            item.key = index + 1
          }
          return item
        })
      : []

    const tableProps: TableProps<JsonSchema.DynamicObject> = {
      ...otherProps,
      scroll,
      dataSource,
      onChange: this.handleChangeTable,
      rowSelection:
        (isArray(selectionButtons) && selectionButtons.length) ||
        (isArray(selections) && selections.length)
          ? rowSelection
          : undefined,
      rowKey: (record: JsonSchema.DynamicObject) =>
        record[uniqueKey] || record.key,
      // @ts-ignore
      columns: this.renderColumns(
        _columns,
        `${this.props['data-pageconfig-path']}.props.columns`
      ),
      // @ts-ignore
      pagination,
    }

    return (
      <div className="ht-table">
        <div className={classnames('g-cell', 'ht-table-button-groups')}>
          <div className={classnames('g-cell__bd')}>
            {this.renderSelectionButtons(
              selectionButtons,
              selectedRowKeys,
              `${this.props['data-pageconfig-path']}.props.selectionButtons`
            )}
            {this.renderSelections(
              selections,
              selectedRowKeys,
              `${this.props['data-pageconfig-path']}.props.selections`
            )}
          </div>
          <div className={classnames('g-cell__ft')}>{Extra}</div>
        </div>
        {/* 表格 */}
        <div className="ht-table-setting">
          {columnsSetting && (
            <Dropdown
              trigger={['click']}
              overlay={this.renderOverlay}
              visible={isDropdownVisible}
              onVisibleChange={this.handleDropdownVisibleChange}
              overlayStyle={{ boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)' }}
              placement="bottomRight"
            >
              <Tooltip title="表头筛选">
                <Icon
                  type="setting"
                  className="ht-customized-columns-setting-icon"
                />
              </Tooltip>
            </Dropdown>
          )}
          <Table
            {...tableProps}
            data-component-type={
              _dataComponentType ? _dataComponentType : 'HtTable'
            }
            data-pageconfig-path={`${this.props['data-pageconfig-path']}.props`}
          />
        </div>

        {/* 弹框表单 */}
        {this.renderModalForm(pagestate, uniqueKey, onDataSourceChange)}
        {isPageLoading && <Spin size="large" className="g-spin" />}
      </div>
    )
  }
}
