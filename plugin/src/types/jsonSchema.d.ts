import { Location } from 'history'
import { Emitter } from 'mitt'

export namespace JsonSchema {
  /**
   * 动态对象
   */
  export interface DynamicObject {
    [key: string]: any
  }

  export type Method =
    | 'get'
    | 'delete'
    | 'head'
    | 'options'
    | 'post'
    | 'put'
    | 'patch'

  /**
   * 拓展window.location
   */
  interface HtLocation extends Location {
    query: {
      [key: string]: any
    }
  }

  export interface RemoteConfig {
    // 请求地址
    url: string
    // 请求方法
    method?: Method
    // 请求参数
    params?: DynamicObject
    // 请求数据格式转换
    transform?: (v: any) => any
  }

  export interface Remote {
    [key: string]: RemoteConfig
  }

  export interface DependenciesAjaxConfig {
    type: 'ajax'
    config: RemoteConfig
  }

  export interface Dependencies {
    [key: string]: DependenciesAjaxConfig | any
  }

  export type ElementConfigChildren = never | string | number | ElementConfig

  /**
   * elementConfig配置
   */
  export interface ElementConfig {
    __noRender?: boolean
    type: string
    props: {
      [key: string]: any
    }
    children?: ElementConfigChildren[]
  }

  /**
   * JSON原始配置
   */
  export interface PageConfig {
    title?: string
    /**
     * 本地常量
     */
    local?: DynamicObject
    /**
     * 远程数据
     */
    remote?: Remote
    /**
     * 数据依赖
     */
    dependencies?: Dependencies

    /**
     * 当页面渲染完毕
     */
    onRemoteResolved?: string

    /**
     * ReactNode 节点配置
     */
    elementConfig: ElementConfig
  }

  export type DataConfig = Omit<JsonSchema.PageConfig, 'elementConfig'>

  /**
   * 数据中心
   */
  export interface Pagestate {
    title?: string
    location: HtLocation
    history: import('history').History
    /**
     * 更新数据
     */
    setStoreState: (v: DynamicObject) => Pagestate | undefined
    /**
     * 将JSON渲染成ReactNode
     */
    /**
     * 创建ReactNode节点
     */
    _C: (
      type: string,
      props?: { [key: string]: any },
      ...children: ElementConfigChildren[]
    ) => React.ReactNode
    /**
     * 更新数据
     */
    _S: (path: string[] | string, value: any) => Pagestate | undefined
    /**
     * 本地存储localstorage
     */
    localStorage: StoreJsAPI
    /**
     * cookie
     */
    cookie: Cookies.CookiesStatic

    moment: any

    emitter: Emitter

    queryString: any
  }

  export interface FieldRule {
    type?: string
    message?: string
    whitespace?: boolean
    required?: true
    len?: number
    min?: number
    max?: number
    enum?: string | string[]
    pattern?: RegExp
    // 正则字符
    patternStr?: string
    // 正则表达式
    patternStr2?: string
    transform?: (v: any) => any
    validator?: (
      rule: any,
      value: any,
      callback: any,
      source?: any,
      options?: any
    ) => any
  }

  export interface RequestOnChange {
    event: string
    alias: string
    url: string
    method?: string
    params?: DynamicObject
    // [旧]已弃用
    data?: DynamicObject
    transform?: (v: DynamicObject) => DynamicObject
  }

  export interface TriggerOnChange {
    event: string
    triggerName: string
    triggerOptions: any
  }

  export type OnSuccessAction = string | null

  export interface ColComponentProps {
    span: number
    offset?: number
    pull?: number
    push?: number
    order?: number
  }

  /**
   * Form表单格式转换
   */
  export type FormTransform = (v: DynamicObject, data: DynamicObject) => any

  /**
   * optionss 数据来源
   */
  export type OptionsSourceType = 'static' | 'dependencies' | 'remote'

  export type HtFieldType =
    | 'Input'
    | 'InputNumber'
    | 'Input.Password'
    | 'Input.TextArea'
    | 'Select'
    | 'SelectMultiple'
    | 'SelectCascade'
    | 'SelectTree'
    | 'SelectTrees'
    | 'Steps'
    | 'Radio'
    | 'Checkbox'
    | 'Upload'
    | 'DatePicker'
    | 'DateTimePicker'
    | 'MonthPicker'
    | 'RangePicker'
    | 'WeekPicker'
    | 'TimePicker'
    | 'EditableTable'
    | 'TableEditor'
    | 'JsonEditor'
    | 'Divider'
    | 'Text'
    | 'Alert'

  export interface HtFieldBaseProps {
    'v-if'?: boolean
    field: string
    defaultValue?: any
    title?: string
    rules?: FieldRule[]
    // [旧] 提示信息
    tooltip?: string
    // [新] 提示信息
    extra?: string | React.ReactNode
    type?: string
    // [旧]表单值变化时, 设置一组输入控件的值
    setFieldsValue?: {
      [key: string]: ((v: any) => any) | React.ReactText
    }
    // [新]表单值变化时, 设置一组输入控件的值
    setFieldValues?: {
      event: string
      field: string
      value: ((v: any, responses?: any[]) => any) | React.ReactText
    }[]
    // [旧] 表单值变化时, 发送请求
    requestOnChange?: RequestOnChange
    // [新] 表单值变化时, 发送请求
    onChangeRequests?: RequestOnChange[]
    // 表单值变化时，触发事件
    triggerOnChanges?: TriggerOnChange[]
    // 是否必填
    required?: boolean
    // 是否禁用
    disabled?: boolean
    // field label占的列, 共24列
    labelCol?: ColComponentProps
    // field wrapper占的列, 共24列
    wrapperCol?: ColComponentProps
    // 默认提示
    placeholder?: string
    // 栅格布局
    colProps?: {
      // 栅格占位格数
      span?: number
      // 栅格右移格数
      push?: number
      // 栅格左移格数
      pull?: number
      // 栅格左侧间隔数
      offset?: number
      // 栅格顺序
      order?: number
    }
  }

  export interface HtFieldStandardOption {
    label: string
    value: string
    icon?: string
    disabled?: boolean
    title?: string
  }

  /**
   * HtField options 属性
   */
  export type HtFieldOption =
    | number
    | string
    | HtFieldStandardOption
    | DynamicObject
}
