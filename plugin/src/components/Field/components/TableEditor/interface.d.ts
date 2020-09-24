import { BaseProps, JsonSchema } from '~/types'

/**
 * Table组件列配置
 */
export interface TableColumn {
  visible: boolean | ((text: any, row: any) => boolean)
  title: string
  dataIndex?: string
  fixed?: 'left' | 'right' | boolean
  align?: 'left' | 'right' | 'center'
  width: number | string
  render?: (text: any, record: {}) => React.ReactNode
  type?: string
  options?: JsonSchema.HtFieldOption[]
}

export interface ActionColumn {
  width: number
  fixed: 'left' | 'right' | boolean
}

/**
 * HtTableEditor组件props
 */
export interface HtTableEditorProps<T = JsonSchema.DynamicObject[]>
  extends BaseProps {
  value: T
  onChange: (v: T) => void
  disabled?: boolean
  scroll?: {
    x?: number
    y?: number
  }
  // 表格列
  columns: TableColumn[]
  // 操作列
  actionColumn?: ActionColumn
  // 允许动态添加
  canAdd?: boolean
  // 允许动态添加子节点
  canAddChildren?: boolean
  // 允许删除
  canDelete?: boolean
  // 弹框配置
  modalConfig?: {
    alias: string
    width?: number
  }
}

/**
 * Table组件state
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HtTableEditorState {}
