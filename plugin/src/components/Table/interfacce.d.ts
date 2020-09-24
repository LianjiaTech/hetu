import { ModalFormComponentProps } from '~/components/ModalForm/interface'
import { BaseProps, JsonSchema } from '~/types'

/**
 * 操作类型
 */
export type actionType = 'xhr' | 'jump' | 'open' | 'download' | 'modalForm'

/**
 * 表格列
 */
export interface TableColumnOperation {
  'v-if'?: boolean
  text?: string
  triggerButtonText?: string
  title?: string
  actionType: actionType
  url: string
  fields?: JsonSchema.HtFieldBaseProps[]
  target?: string
  method?: JsonSchema.Method
  transform?: (v: JsonSchema.DynamicObject) => any
}

/**
 * 表格列操作-普通操作
 */
interface TableColumnOperations {
  'v-if'?: boolean
  text: string
  url: string
  actionType?: 'jump' | 'xhr'
  transform?: (v: JsonSchema.DynamicObject) => any
}

/**
 * 表格列操作-弹框编辑
 */
interface TableColumnOperations2 {
  'v-if'?: boolean
  text: string
  url: string
  width?: number
  fields: JsonSchema.HtFieldBaseProps[]
  transform?: (v: JsonSchema.DynamicObject) => any
}

type TableColumnOperations3 = JsonSchema.ElementConfig

/**
 * Table组件列配置
 */
export interface TableColumn {
  'v-if'?: boolean
  title: any
  dataIndex?: string
  fixed?: 'left' | 'right' | boolean
  align?: 'left' | 'right' | 'center'
  width?: number | string
  operations?: TableColumnOperations[]
  operations2?: TableColumnOperations2[]
  operations3?: TableColumnOperations3[]
  render?: (text: any, record: {}) => React.ReactNode
  renderType?:
    | 'default'
    | 'a'
    | 'img'
    | 'time'
    | 'date'
    | 'boolean'
    | 'operations'
    | 'operations_new'
    | 'switch'
    | 'tag'
    | 'enumeration'
    | 'customize'
  renderProps?: object
  max?: number
  // 超过长度是否隐藏
  showOverflowTooltip?: boolean
  // 提示信息
  tooltip?: string
  filterDropdown?: any
  filterIcon?: any
  // 排序
  sort?: boolean
  // 筛选
  filterColumns?: boolean
  filterOptions?: any

  onHeaderCell?: (column: TableColumn) => JsonSchema.DynamicObject
}

/**
 * 表格的批量操作按钮
 */
export interface SelectionButton extends ModalFormComponentProps {
  selectionKey?: string
  selectionTitle?: string
}

/**
 * Table组件props
 */
export interface TableComponentProps extends BaseProps {
  // 表格唯一标识
  uniqueKey: string
  dataSource: JsonSchema.DynamicObject[]
  scroll?: {
    x: number
    y?: number
  }
  columns: TableColumn[]
  // 表头设置
  columnsSetting?: boolean
  // 列操作-普通操作
  actionColumn: {
    // 宽度
    width: number
    // 是否固定
    fixed: boolean
    // 列表操作-普通操作
    operations: TableColumnOperations[]
    // 其他操作-数据编辑
    operations2: TableColumnOperations2[]
  }
  pagination:
    | false
    | {
        // 每一页请求数据量
        pageSize?: number
        // 当前第几页
        current: number
        //  总页数
        total: number
        // 用于显示数据总量和当前数据顺序
        showTotal: (v: number) => string
        // 分页器变化
        onChange: (current: number, pageSize: number) => void
        // 每页显示条目数
        showSizeChanger?: boolean
        // 每页显示条目数变化
        onShowSizeChange?: (current: number, pageSize: number) => void
        pageSizeOptions?: string[]
      }
  selectionButtons: SelectionButton[]
  selections: React.ReactNode[]
  // dataSourc变化时触发
  onDataSourceChange: () => void
  onChange?: (pagination: any, filters: any, sorter: any) => void
  aliasTable?: string

  Extra?: React.ReactNode
}

/**
 * Table组件state
 */
export interface TableComponentState {
  isPageLoading: boolean
  // 弹框是否可见
  isFormModalvisible: boolean
  isDropdownVisible?: boolean
  menuCheck?: any[]
  sortInfo?: string | boolean
  sortKey?: any
  filterName?: any
}

/**
 * 列表多选框
 */
export type selectedRowKeys = string[]
