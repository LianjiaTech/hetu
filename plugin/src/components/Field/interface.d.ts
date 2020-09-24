import { WrappedFormUtils } from 'antd/es/form/Form'
import { BaseProps, JsonSchema } from '~/types'
export { FormItemProps } from 'antd/es/form/FormItem'

/**
 * field
 */
export interface FormField {
  field: string
  title: string
}

export interface HtFieldProps<T = any>
  extends BaseProps,
    JsonSchema.HtFieldBaseProps {
  form: WrappedFormUtils
  onChange?: (v: T) => void
  otherProps?: JsonSchema.DynamicObject
}
