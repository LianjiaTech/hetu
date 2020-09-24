import { InterfaceProperty, InterfaceEditConfig } from '~/types/components/interfaceEditConfig'

type TypeSelectedComponentData = {
  dataComponentConfig: InterfaceEditConfig
  /**
   * 所选区域
   */
  reac: {
    x: number
    y: number
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
  }
  /**
   * 所选元素的属性路径, 通过该路径可以直接在pageConfig中找到对应的属性
   * 'elementConfig.props.content.children[0].children[0].children[3]'
   */
  dataPageConfigPath: string
  dataPropsConfig: null
  // 组件类型
  dataComponentType: string
}

type TypeCompontentConfig = {
  /**
   * 组件类型
   */
  type: string
  props: {
    [key: string]: TypeCompontentConfig
  }
  children?: Array<any>
}

type TypePageConfig = {
  /**
   * 页面url, 必须以/project开头, 目前只在静态配置页面中使用, 该字段可忽略
   */
  route?: string
  /**
   * 页面名称
   */
  title: '测试'
  local?: dynamicObject

  remote?: dynamicObject

  dependencies: {
    [key: string]: object
  }
  elementConfig: TypeCompontentConfig
}

type TypeEditConfigMap = {
  [compontentName: string]: InterfaceProperty
}

type TypeForm = {
  getFieldsValue: Function
  getFieldValue: Function
  getFieldInstance: Function
  setFieldsValue: Function
  setFields: Function
  setFieldsInitialValue: Function
  getFieldDecorator: Function
  getFieldProps: Function
  getFieldsError: Function
  getFieldError: Function
  isFieldValidating: Function
  isFieldsValidating: Function
  isFieldsTouched: Function
  isFieldTouched: Function
  isSubmitting: Function
  submit: Function
  validateFields: Function
  resetFields: Function
  validateFieldsAndScroll: Function
}

interface InterfaceGuiEditorProps {
  dispatch: Function
  form: TypeForm
  pageId: number
  pageConfig: TypePageConfig
  selectedComponentData: TypeSelectedComponentData
  editConfigMap: TypeEditConfigMap
}

export {
  TypeSelectedComponentData,
  TypeCompontentConfig,
  TypePageConfig,
  TypeEditConfigMap,
  TypeForm,
  InterfaceGuiEditorProps,
}

export default InterfaceGuiEditorProps
