import { JsonSchema } from '~/types'

export interface HtExceptionProps {
  type: '403' | '404' | '500'
  title?: string
  desc?: string
  img?: string
  actions?: any
  style?: JsonSchema.DynamicObject
}
