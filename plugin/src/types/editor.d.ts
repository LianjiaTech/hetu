import { ColProps } from 'antd/lib/col'

export namespace Editor {
  export type EditConfigMap = {
    [key in ComponentType]: ComponentEditConfig
  }

  export type FieldEditConfigMap = {
    [key in FieldComponentType]: ComponentEditConfig
  }

  export type ComponentType =
    | FieldComponentType
    | 'HtGuiContainer'
    | 'HtDivider'
    | 'HtTabs'
    | 'HtCard'
    | 'HtList'
    | 'HtList.column'
    | 'HtList.actionColumn'
    | 'HtForm'
    | 'HtButton'
    | 'HtModalForm'

  /**
   * 组件的可视化编辑配置
   */
  export interface ComponentEditConfig {
    // 选中时显示的按钮
    selectedButtons?: ButtonType[]
    // 支持的动态添加的属性, 对应编辑器左侧面板
    additableProperties?: AdditableProperties
    // 可视化编辑的属性, 对应编辑器右侧基本编辑
    guiProperties: BaseProperties | ((formData: any) => BaseProperties)
  }

  /**
   * 可动态添加的属性
   */
  export interface AdditableProperties {
    [key: string]: {
      // 字段的中文名
      title: string
      // 顺序
      order?: number
      // 可选项
      options?: AdditablePropertiesOption[]
      // 带分组的可选项
      optionGroups?: AdditablePropertiesOptionGroup[]
    }
  }

  /**
   * 按钮类型
   */
  export type ButtonType = 'delete' | 'move' | 'add'

  /**
   * 基本编辑配置
   */
  export interface BaseProperties {
    [key: string]: BasePropertyConfig
  }

  /**
   * 编辑属性配置
   */
  export interface BasePropertyConfig extends BaseConfig {
    /**
     * 用于属性分组, 默认只展示常用属性
     */
    group?: 'default' | 'extend'
  }

  /**
   * 可视化编辑基础属性
   */
  export interface BaseConfig {
    /**
     * 数据类型
     */
    type: DataType
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

    // demo示例, 支持html片段
    demo?: string

    /**
     * 默认提示信息, 引导文案
     */
    placeholder?: string
    /**
     * 默认值, 只有基础类型会有默认值
     */
    defaultValue?: any
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
    autosize?: {
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
    enumDescriptionList?: Array<string | number | null>

    /**
     * 子属性
     */
    properties?: SubProperties

    /**
     * ArrayOf 节点属性
     */
    arrayItemProperty?: (
      index: number,
      currentValue: any,
      allValues: any[]
    ) => SubProperties

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
  }

  /**
   * FormItem/Field 组件类型
   */
  export type FieldComponentType =
    | 'HtField.Input'
    | 'HtField.InputNumber'
    | 'HtField.Input.Password'
    | 'HtField.Input.TextArea'
    | 'HtField.Select'
    | 'HtField.SelectMultiple'
    | 'HtField.SelectCascade'
    | 'HtField.SelectTree'
    | 'HtField.SelectTrees'
    | 'HtField.Steps'
    | 'HtField.Radio'
    | 'HtField.Checkbox'
    | 'HtField.Upload'
    | 'HtField.DatePicker'
    | 'HtField.DateTimePicker'
    | 'HtField.MonthPicker'
    | 'HtField.RangePicker'
    | 'HtField.WeekPicker'
    | 'HtField.TimePicker'
    | 'HtField.TableEditor'
    | 'HtField.JsonEditor'
    | 'HtField.Divider'
    | 'HtField.Text'
    | 'HtField.Alert'

  export interface AdditablePropertiesOptionGroup {
    // 组名
    title: string
    options: AdditablePropertiesOption[]
  }

  /**
   * 可选项
   */
  export interface AdditablePropertiesOption {
    // 组件中文名
    label: string
    // 组件名
    value: any
    // icon
    icon?: string
    // 描述
    desc?: string
    // 分组名
    group?: string
  }

  export interface SubProperties {
    [key: string]: BaseConfig
  }

  export type DataType =
    | 'enum' // 枚举类型
    | 'object' // 对象
    | 'arrayOf' // 对象数组
    | 'string' // 字符串
    | 'number' // 数字
    | 'bool' // 布尔值
    | 'json' // 复杂属性, 无法描述的属性, 则使用json(将属性作为纯文本进行编辑)
    | 'json-inline' // 内联json
}
