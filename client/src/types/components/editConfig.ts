/**
 * 属性规范
 */
type InterfaceProperty = {
  type:
    | 'enum' // 枚举类型
    | 'object' // 对象
    | 'array' // 普通数组
    | 'arrayOf' // 对象数组
    | 'string' // 字符串
    | 'image' // 图片
    | 'number' // 数字
    | 'color' // 颜色选择器
    | 'richtext' // 富文本
    | 'bool' // 布尔值
    | 'date' // 日期
    | 'url' // url

  /**
   * 属性名称
   */
  title: string
  /**
   * 属性描述, 作为问号出现在属性左侧, 用于提示用户该属性的含义
   */
  desc?: string
  /**
   * 文档地址
   */
  doc?: string
  /**
   * 默认值, 只有基础类型会有默认值
   */
  defaultValue?: string | number | boolean
  properties?: {
    [datakey: string]: InterfaceProperty
  }
}

type TypeEditConfig = {
  [propKey: string]: InterfaceProperty
}
export default TypeEditConfig

export { InterfaceProperty, TypeEditConfig }
