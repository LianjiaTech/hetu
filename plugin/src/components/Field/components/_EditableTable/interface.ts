import { BaseProps, JsonSchema } from '~/types'

export interface HtEditableTableColumn extends BaseProps {
  title: string
  dataIndex: string
  fixed: 'left' | 'right'
  align: 'left' | 'right' | 'center'
  width: number | string
  editable: boolean
}

export interface HtEditableTableProps<T = JsonSchema.DynamicObject> {
  value: T[]
  onChange: (v: T) => void
  canAdd: boolean
  canAddChildren?: boolean
  columns: HtEditableTableColumn[]
  scroll?: {
    x: number
    y: number
  }
}
export interface HtEditableTableState {
  rowKeyMap: JsonSchema.DynamicObject
  dataSource: JsonSchema.DynamicObject[]
}
