import { Button, Col, Form, Row, Spin } from 'antd'
import _, { get, isArray, isFunction, omit, set } from 'lodash'
import { observer } from 'mobx-react'
import Qs from 'query-string'
import React, { Component } from 'react'
import { JsonSchema } from '~/types'
import { updateComponentAlias } from '~/utils'
import { resolveAction, _resolveAction } from '~/utils/actions'
import message from '~/utils/message'
import request from '~/utils/request'
import HtCard from '../Card'
import Field from '../Field'
import './index.less'
import {
  Field as TypeField,
  form,
  FormButtonType,
  HtFormProps,
  HtFormState,
} from './interface'

const ComponentAlias = '$$HtForm'
const FormFetchDataAlias = '$$HtFormResponse'

updateComponentAlias(ComponentAlias, {})
updateComponentAlias(FormFetchDataAlias, null)

export class HtForm extends Component<HtFormProps, HtFormState> {
  static displayName = 'HtForm'

  static __isContainer__ = true

  static defaultProps: Partial<HtFormProps> = {
    isCard: false,
    alias: ComponentAlias,
    responseAlias: FormFetchDataAlias,
    method: 'post',
    fields: [],
    cols: 1,
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    buttonGroupProps: {},
    buttons: ['back', 'submit'],
    submitButtonText: '保存',
    backButtonText: '返回',
    resetButtonText: '重置',
    redirectToButtonText: '下一步',
    downloadButtonText: '下载',
    isAutoSubmit: false,
    isShowSuccessMessage: true,
    onSuccessAction: null,
    transform: (v: any) => v,
    isResetShouldSubmit: false,
    'data-component-type': 'HtForm',
  }

  state: HtFormState = {
    isPageLoading: false,
  }

  ignoreFields: JsonSchema.DynamicObject = {}

  cols = 0

  lastSubmitTime = new Date().getTime()

  constructor(props: HtFormProps) {
    super(props)
    let getRef = props.getRef
    if (isFunction(getRef)) {
      getRef(this)
    }
  }

  componentDidMount() {
    const { isAutoSubmit } = this.props

    if (isAutoSubmit) {
      this.submit()
    }
  }

  resolveURL = () => {
    const { url, pagestate, alias } = this.props
    if (_.isString(url)) return url

    if (_.isFunction(url)) {
      // @ts-ignore
      const formData = _.get(pagestate, alias)
      return url(formData)
    }

    console.error(url)
    throw new Error(`url 格式错误`)
  }

  // 设置页面loading
  setPageLoading = (isPageLoading: boolean) => {
    return new Promise((resolve, reject) => {
      try {
        this.setState(
          {
            isPageLoading,
          },
          () => {
            resolve()
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  // 跳转页面
  openWindow = async () => {
    const url = this.resolveURL()
    const params = await this.validateFields()

    _resolveAction('openWindow', `${url}?${Qs.stringify(params)}`)
  }

  redirectTo = async () => {
    const { pagestate } = this.props
    const url = this.resolveURL()

    const params = await this.validateFields()

    _resolveAction('redirectTo', `${url}?${Qs.stringify(params)}`, pagestate)
  }

  // 重置表单
  reset = async () => {
    const { form, alias, pagestate, isResetShouldSubmit } = this.props
    const { setStoreState } = pagestate

    form.resetFields()

    const values = form.getFieldsValue()
    setStoreState({ [alias as string]: values })

    isResetShouldSubmit && this.resetAndSubmit()
    this.restSort()
  }

  // 返回
  back = () => {
    const { history } = this.props.pagestate
    history.goBack()
  }

  // 下载
  download = async () => {
    const { pagestate } = this.props

    const url = this.resolveURL()

    const params = await this.validateFields()
    let downloadUrl = `${url}?${Qs.stringify(params)}`

    _resolveAction('openWindow', downloadUrl, pagestate)
  }

  restSort = async () => {
    const { pagestate } = this.props
    const aliasTable = '$$HtList'
    // @ts-ignore
    const formData = pagestate[aliasTable]
    _.set(formData, 'restSort', true)
    pagestate.setStoreState({ [aliasTable]: formData })
  }

  /**
   * 重置 && 提交
   */
  resetAndSubmit = () => {
    const { resetPagination } = this.props
    if (isFunction(resetPagination)) {
      resetPagination()
    }
    this.submit()
  }

  validateFields = (
    e?: React.FormEvent<HTMLFormElement>
  ): Promise<JsonSchema.DynamicObject> => {
    e && e.preventDefault()
    if (e) {
      let currentTime = new Date().getTime()
      // 2s内重复点击无效
      if (currentTime - this.lastSubmitTime < 2000) {
        this.lastSubmitTime = currentTime
        return Promise.reject(new Error('请不要重复提交'))
      }

      this.lastSubmitTime = currentTime
    }

    const { form, transform } = this.props

    return new Promise((resolve, reject) => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return reject(err)
        }

        const params = this.filterFields(values)

        if (isFunction(transform)) {
          return resolve(transform(params))
        } else {
          return resolve(params)
        }
      })
    })
  }

  // 提交表单
  submit = async (e?: React.FormEvent<HTMLFormElement>) => {
    const {
      sendFormData,
      onSuccess,
      responseAlias = FormFetchDataAlias,
      pagestate,
    } = this.props

    // 发送请求, 如果props中有,则使用; 否则, 则使用默认方法
    let sendData = sendFormData || this.sendFormData
    const params = await this.validateFields(e)

    let res = await sendData(params)

    // 将返回结果挂载到数据中心
    pagestate.setStoreState({
      [responseAlias]: res,
    })
    const { onSuccessAction, _onSuccessAction } = this.props

    // 请求成功回调事件
    if (isFunction(onSuccess)) {
      onSuccess(res)
    }

    setTimeout(() => {
      if (_.isArray(_onSuccessAction)) {
        const [type, config] = _onSuccessAction
        _resolveAction(type, config, pagestate)
        return
      }

      if (onSuccessAction) {
        resolveAction(onSuccessAction)
        return
      }
    })
  }

  // 发送表单数据
  sendFormData = async (values: JsonSchema.DynamicObject): Promise<any> => {
    const {
      method = 'get' as JsonSchema.Method,
      isShowSuccessMessage,
    } = this.props

    const url = this.resolveURL()

    if (!url) {
      throw new Error('缺少url')
    }

    let res
    try {
      this.setPageLoading(true)
      res = await request[method as 'get'](url, values)
      if (isShowSuccessMessage) {
        message.success(res.message || '请求成功')
      }
      this.setPageLoading(false)
      return res
    } catch (e) {
      this.setPageLoading(false)
      throw e
    }
  }

  // 过滤表单提交字段
  filterFields = (values: JsonSchema.DynamicObject) => {
    let result: JsonSchema.DynamicObject = {}
    Object.keys(values)
      .filter(filed => !this.ignoreFields[filed])
      .forEach(field => {
        result[field] = values[field]
      })
    return result
  }

  /**
   * 渲染Fields
   */
  renderFields = (fileds: TypeField[], span: number, form: form) => {
    const { pagestate } = this.props

    if (isArray(fileds)) {
      this.cols = 0
      return fileds.map((item, i) => {
        const {
          'v-if': vIf,
          ignore,
          type = 'Input',
          colProps = {},
          field,
          ...rest
        } = item

        if (vIf !== undefined && !vIf) {
          return null
        }

        this.cols += span
        if (ignore && !this.ignoreFields[item.field]) {
          this.ignoreFields[item.field] = 1
        }

        const dataPageconfigPath = `${this.props['data-pageconfig-path']}.props.fields[${i}]`

        let reg = /^HtField\./
        let _type = reg.test(type) ? type : `HtField.${type}`
        return (
          <Field
            colProps={{
              span: _.isNumber(colProps?.span) ? colProps?.span : span,
              ..._.omit(colProps, ['span']),
            }}
            key={i}
            {...omit(rest, ['value'])}
            field={field}
            type={type}
            form={form}
            pagestate={pagestate}
            data-pageconfig-path={dataPageconfigPath}
            data-component-type={_type}
          />
        )
      })
    }

    return null
  }

  /**
   * 渲染Form按钮
   */
  renderButtons = (
    buttons: FormButtonType[],
    span: number,
    labelCol: JsonSchema.ColComponentProps,
    wrapperCol: JsonSchema.ColComponentProps
    // eslint-disable-next-line max-params
  ) => {
    const {
      submitButtonText,
      backButtonText,
      resetButtonText,
      redirectToButtonText,
      downloadButtonText,
      buttonGroupProps,
    } = this.props

    if (!isArray(buttons) || buttons.length === 0) {
      return null
    }

    type ButtonMap = {
      [key in FormButtonType]: React.ReactNode
    }

    const map: ButtonMap = {
      submit: (
        <Button
          className="ht-btn-submit"
          onClick={this.resetAndSubmit}
          type="primary"
        >
          {submitButtonText}
        </Button>
      ),
      reset: (
        <Button className="ht-btn-reset" onClick={this.reset}>
          {resetButtonText}
        </Button>
      ),
      redirectTo: (
        <Button
          className="ht-btn-submit"
          onClick={() => this.redirectTo()}
          type="primary"
        >
          {redirectToButtonText}
        </Button>
      ),
      openWindow: (
        <Button
          className="ht-btn-submit"
          onClick={() => this.openWindow()}
          type="primary"
        >
          {redirectToButtonText}
        </Button>
      ),
      back: (
        <Button className="ht-btn-back" onClick={this.back}>
          {backButtonText}
        </Button>
      ),
      download: (
        <Button
          className="ht-btn-submit"
          onClick={() => this.download()}
          type="primary"
        >
          {downloadButtonText}
        </Button>
      ),
    }

    if (isArray(buttons)) {
      const Buttons = buttons.map((item, i) => {
        let result: any = null

        // @ts-ignore
        if (map[item]) {
          // @ts-ignore
          result = map[item]
        }

        if (React.isValidElement(item)) {
          result = item
        }

        if (!result) {
          throw new TypeError(`${item} is not a valid button type`)
        }

        return (
          result &&
          React.cloneElement(result, {
            key: i,
            className: result.props.className + ' ht-form-btn',
          })
        )
      })

      let offset = labelCol.span

      if (this.cols + span <= 24) {
        offset = 0
      }

      if (wrapperCol.span + offset > 24) {
        offset = 0
      }

      let _span = _.isNumber(buttonGroupProps?.span)
        ? buttonGroupProps?.span
        : span
      let _offset = _.isNumber(buttonGroupProps?.offset)
        ? buttonGroupProps?.offset
        : offset
      return (
        <Col
          style={{ whiteSpace: 'nowrap', paddingTop: '4px' }}
          {..._.omit(buttonGroupProps, ['span', 'offset'])}
          // @ts-ignore
          span={_span + _offset > 24 ? 24 - _offset : _span}
          offset={_offset}
        >
          {Buttons}
        </Col>
      )
    }

    return null
  }

  render() {
    const { isPageLoading } = this.state
    const {
      // Card配置
      isCard,
      extra,
      // description,
      // form配置
      fields,
      cols,
      labelCol,
      wrapperCol,
      buttons,
      form,
      'data-component-type': _dataComponentType,
      title,
      pagestate,
    } = this.props

    const span = 24 / (cols as number)
    const formItemLayout = {
      labelCol,
      wrapperCol,
    }

    return (
      <HtCard
        isCard={isCard}
        title={title}
        extra={extra}
        pagestate={pagestate}
        data-pageconfig-path={`${this.props['data-pageconfig-path']}`}
        data-component-type={_dataComponentType}
        render={() => (
          <div>
            <Form
              onSubmit={this.submit}
              className="ht-form-container"
              {...formItemLayout}
            >
              <Row>
                {this.renderFields(fields as TypeField[], span, form)}
                {this.renderButtons(
                  buttons as FormButtonType[],
                  span,
                  labelCol as JsonSchema.ColComponentProps,
                  wrapperCol as JsonSchema.ColComponentProps
                )}
              </Row>
            </Form>
          </div>
        )}
      >
        {isPageLoading && <Spin size="large" className="g-spin" />}
      </HtCard>
    )
  }
}

const WrapperForm = Form.create<HtFormProps>({
  mapPropsToFields(props: HtFormProps) {
    // @ts-ignore
    const alias = props.alias || ComponentAlias
    const fields = props.fields || []
    const formData = get(props, ['pagestate', alias], {})

    let result: JsonSchema.DynamicObject = {}
    fields.forEach(v => {
      const path = v.field
      if (path) {
        let value = get(formData, path, v.defaultValue)
        // @ts-ignore
        let otherProperties = _.get(WrapperForm.formMap, [alias, path], {})
        set(result, path, Form.createFormField({ ...otherProperties, value }))
      }
    })
    return result
  },
  onFieldsChange(props, _changedFields, allFields) {
    // @ts-ignore
    const alias = props.alias || ComponentAlias
    // @ts-ignore
    _.set(WrapperForm.formMap, [alias], allFields)
  },
  onValuesChange(props, _values, allValues) {
    // @ts-ignore
    const alias = props.alias || ComponentAlias
    // @ts-ignore
    const { setStoreState } = props.pagestate
    if (!isFunction(setStoreState)) return

    let oldData = _.get(props.pagestate, alias, {})

    let formData = { ...oldData, ...allValues }
    setStoreState({ [alias]: formData })
  },
})(observer(HtForm))

// @ts-ignore
WrapperForm.formMap = {}

export default WrapperForm
