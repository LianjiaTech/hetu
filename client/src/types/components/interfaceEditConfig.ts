import { ColProps } from 'antd/lib/col'

export interface properties {
  [datakey: string]: InterfaceSubProperty
}

export type propertyType =
  | 'enum' // 枚举类型
  | 'object' // 对象
  | 'arrayOf' // 对象数组
  | 'string' // 字符串
  | 'number' // 数字
  | 'bool' // 布尔值
  | 'json' // 复杂属性, 无法描述的属性, 则使用json(将属性作为纯文本进行编辑)
  | 'json-inline'

/**
 * 属性规范
 */
export interface InterfaceSubProperty {
  type: propertyType

  /**
   * 属性名称
   */
  title: string
  /**
   * 属性描述, 作为问号出现在属性左侧, 用于提示用户该属性的含义
   */
  desc?: string | React.ReactNode
  /**
   * 文档地址
   */
  doc?: string
  /**
   * 默认提示信息
   */
  placeholder?: string
  /**
   * 默认值, 只有基础类型会有默认值
   */
  defaultValue?: string | number | boolean | Array<string | number>
  /**
   * 是否可编辑, 用于处理取值固定, 用户不必输入, 但是必须传入的属性, 默认为true
   */
  isEditable?: boolean

  /**
   * 模式, 可选值有 multiple
   */
  mode?: 'multiple'

  /**
   * type=string时, 输入框配置
   */
  autoSize?: {
    minRows: number
    maxRows: number
  }
  /**
   * 对于array型数据, 如果需要严格限制其取值范围, 则添加该属性(视为enum属性)
   * 不存在要求类型为: A/B/C & 任意值 的情况, 这种情况下应该填任意值
   */
  allowArrayItem?: {
    /**
     * 初始默认值
     */
    defaultValue: string | number
    /**
     * 枚举值允许的值列表
     */
    enumList: Array<string | number>
    /**
     * 枚举值对应的解释, 和枚举值一一对应
     */
    enumDescriptionList: Array<string | number>
  }

  /**
   * 枚举值允许的值列表
   */
  enumList?: Array<React.ReactText>
  /**
   * 枚举值对应的解释, 和枚举值一一对应
   */
  enumDescriptionList?: Array<string | number>

  /**
   * 子属性
   */
  properties?: properties

  /**
   * ArrayOf 节点属性
   */
  arrayItemProperty?: (index: number, currentValue: any, allValues: any[]) => properties

  /**
   * 是否显示, formData为当前表单的值
   */
  visible?: boolean

  // 是否显示tooltip
  showTooltip?: boolean

  // 当前输入框的高度
  height?: number

  labelCol?: ColProps

  wrapperCol?: ColProps

  demo?: string
}

export interface InterfaceProperty extends InterfaceSubProperty {
  /**
   * 用于属性分组, 默认只展示常用属性
   */
  group?: 'default' | 'extend'
}

export interface InterfaceEditConfig {
  [propKey: string]: InterfaceProperty
}

export default InterfaceEditConfig
