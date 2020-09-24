import { Editor } from './editor'
import { JsonSchema } from './jsonSchema'

export { JsonSchema, Editor }

/**
 * hetu组件通用Props
 */
export interface BaseProps {
  pagestate: JsonSchema.Pagestate
  id?: string
  className?: string
  style?: any
  'v-if'?: boolean
  // 属性在pageconfig中的路径
  'data-pageconfig-path'?: string
  // 组件类型, 例如 HtList、HtForm
  'data-component-type'?: string
}
