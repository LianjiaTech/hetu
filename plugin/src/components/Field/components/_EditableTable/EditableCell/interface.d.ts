import { BaseProps, JsonSchema } from '~/types/index'

export interface HtEditableCellProps<T = JsonSchema.DynamicObject>
  extends BaseProps {
  record: T
  handleSave: (v: T) => void
  dataIndex: string
  title: string
  type: string
  index: number
  editable: boolean
  onClick: (e: any) => void
}
