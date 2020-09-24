import { ColProps } from 'antd/es/col'
import { FormComponentProps } from 'antd/es/form'
import { WrappedFormUtils } from 'antd/es/form/Form'
import { HtCardProps } from '~/components/Card/interface'
import { BaseProps, JsonSchema } from '~/types'
import { _onSuccessActionConfig } from '~/utils/actions'

export type FormButtonType =
  | 'submit'
  | 'reset'
  | 'back'
  | 'redirectTo'
  | 'openWindow'
  | 'download'

export interface HtFormState {
  isPageLoading: boolean
}

interface Field extends JsonSchema.HtFieldBaseProps {
  // 表单提交时, 是否忽略改表单值
  ignore?: boolean
}

type IButtonGroupProps = ColProps

export interface HtFormProps
  extends BaseProps,
    FormComponentProps,
    HtCardProps {
  // 请求url
  url?: string | ((v: any) => string)
  // 请求方法
  method?: JsonSchema.Method
  // 表单项
  fields?: Field[]
  // fields 为几列布局
  cols?: number
  // field label占的列, 共24列
  labelCol?: JsonSchema.ColComponentProps
  // field wrapper占的列, 共24列
  wrapperCol?: JsonSchema.ColComponentProps
  // 按钮
  buttons?: (FormButtonType | React.ReactNode)[]
  // 按钮组样式
  buttonGroupProps?: IButtonGroupProps
  // submit按钮文案
  submitButtonText?: string
  // back按钮文案
  backButtonText?: string
  // reset按钮文案
  resetButtonText?: string
  // redirectTo按钮文案
  redirectToButtonText?: string
  // download按钮文案
  downloadButtonText?: string
  // 是否自动提交
  isAutoSubmit?: boolean
  // 是否显示请求成功信息
  isShowSuccessMessage?: boolean
  // 发送请求前数据转换
  transform?: (v: JsonSchema.DynamicObject) => any
  // 发送请求的方法
  sendFormData?: (v: JsonSchema.DynamicObject) => Promise<any>
  // 请求成功回调行为, 可选值有`redirectTo: 跳转地址 | goBack: 返回 | reload: 刷新页面`, 如果设置为false, 则什么也不做
  onSuccessAction?: JsonSchema.OnSuccessAction
  _onSuccessAction?: _onSuccessActionConfig
  // 表单提交成功回调
  onSuccess?: Function
  // 表单值挂载到pagestate的字段名
  alias?: string
  // 请求响应挂载到pagestate到字段名
  responseAlias?: string
  // 获取当前组件实例
  getRef?: (v: any) => void
  // 重置分页
  resetPagination?: () => void

  // 重置是否应该执行提交
  isResetShouldSubmit?: boolean
}

export type form = WrappedFormUtils<any>

export type formField = JsonSchema.HtFieldBaseProps
