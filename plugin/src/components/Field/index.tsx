import { Col, Form, Icon, Tooltip } from 'antd'
import _, {
  get,
  isArray,
  isFunction,
  isPlainObject,
  isString,
  omit,
} from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import HtmlFragment from '~/components/HtmlFragment'
import { JsonSchema } from '~/types'
import { evalJavascript } from '~/utils'
import { _resolveAction } from '~/utils/actions'
import { emitter } from '~/utils/events'
import { fieldMap } from './components/index'
import './index.less'
import { FormItemProps, HtFieldProps } from './interface'
import ruleMap from './rules'

const FormItem = Form.Item

/**
 *
 * @param type
 * @param title
 */
function getTips(type?: string, title = '') {
  let tip = `请输入${title}`
  if (
    type &&
    'Radio Checkbox Select SelectMultiple TreeSelect SelectCascade TimePicker RangePicker WeekPicker MonthPicker DatePicker'.indexOf(
      type
    ) !== -1
  ) {
    tip = `请选择${title}`
  }

  if (type && type === 'Upload') {
    tip = `请上传${title}`
  }

  return tip
}

function isRequestOnChangeValid(v: any): v is JsonSchema.RequestOnChange {
  if (isPlainObject(v)) {
    const { alias, url } = v
    if (isString(alias) && isString(url)) {
      return true
    }
  }

  return false
}

@observer
export default class HtField extends Component<HtFieldProps> {
  static displayName = 'HtField'

  static defaultProps = { type: 'Input' }

  state = {}

  componentDidMount() {
    const { field, form } = this.props
    if (field) {
      const fieldVal = form.getFieldValue(field)
      form.setFieldsValue({ [field]: fieldVal })
      if (fieldVal) {
        this.handleOnChange(fieldVal)
      }
    }
  }

  getComponent = (type?: string) => {
    // 设置默认值
    if (!type) {
      return fieldMap.Input
    }

    // 从fieldMap从获取
    let C = get(fieldMap, type)
    if (C) {
      return C
    }

    // 如果没有, 尝试去掉Ht前缀再次获取
    let reg = /^Ht[A-Z]/
    if (reg.test(type)) {
      C = get(fieldMap, type.slice(2))
    }

    let reg1 = /^HtField\./
    if (reg1.test(type)) {
      C = get(fieldMap, type.slice(8))
    }

    if (!C) {
      console.error(`组件${type}不存在`)
      return null
    }

    return C
  }

  resolveRequestOnChange = (
    eventName: string
  ): Promise<Array<any> | object | undefined> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(async () => {
          const { pagestate, requestOnChange, onChangeRequests } = this.props
          let responseData: Array<any> | object | undefined
          if (isArray(onChangeRequests)) {
            let promissAll: PromiseLike<any>[] = []
            onChangeRequests.forEach((x: any) => {
              const { event = 'onChange' } = x
              if (event === eventName) {
                let p = _resolveAction('request', x, pagestate)
                p && promissAll.push(p)
              }
            })
            responseData = await Promise.all(promissAll)
          }

          // 兼容旧版的requestOnChange
          if (isRequestOnChangeValid(requestOnChange)) {
            responseData = await _resolveAction(
              'request',
              requestOnChange,
              pagestate
            )
          }

          setTimeout(() => {
            resolve(responseData)
          })
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  handleOnChange = async (v: any, eventName = 'onChange') => {
    const {
      setFieldsValue,
      setFieldValues,
      triggerOnChanges,
      form,
    } = this.props

    let res = await this.resolveRequestOnChange(eventName)
    // setFieldValues 和 setFieldsValue 二者取其一, setFieldValues为编辑器兼容属性
    if (isArray(setFieldValues)) {
      let result: JsonSchema.DynamicObject = {}
      setFieldValues.forEach(item => {
        const { event = 'onChange', field, value } = item
        if (event === eventName) {
          let _value = value
          if (isFunction(value)) {
            // @ts-ignore
            _value = value(v, res)
          }
          result[field] = _value
        }
      })

      form.setFieldsValue(result)
    }

    // [旧] 兼容属性 setFieldsValue
    if (isPlainObject(setFieldsValue)) {
      let result = setFieldsValue as { [key: string]: (v: any) => any }
      Object.keys(result).forEach(key => {
        let handler = result[key]

        if (isFunction(handler)) {
          result[key] = handler(v, res)
          return
        }

        result[key] = handler
      })

      form.setFieldsValue(result)
    }

    if (isArray(triggerOnChanges)) {
      triggerOnChanges.forEach(item => {
        const { event = 'onChange', triggerName, triggerOptions } = item
        if (event === eventName) {
          emitter.emit(triggerName, triggerOptions)
        }
      })
    }
  }

  // 监听表单onChange事件
  onChange = async (e: React.FormEvent) => {
    let v = get(e, 'target.value')
    if (!v) {
      v = e
    }

    this.handleOnChange(v, 'onChange')
  }

  onBlur = (e: React.FormEvent) => {
    let v = get(e, 'target.value')
    // 避免onBlur拿到错误的对象获取值为undefined导致后续的错误
    if (_.isUndefined(v)) return
    if (!v) {
      v = e
    }

    this.handleOnChange(v, 'onBlur')
  }

  render() {
    const {
      id,
      colProps,
      style = {},
      title,
      tooltip,
      extra,
      field,
      placeholder,
      required,
      rules = [],
      type = 'Input',
      form,
      labelCol,
      wrapperCol,
      defaultValue,
      onChange,
      requestOnChange,
      onChangeRequests,
      setFieldsValue,
      setFieldValues,
      triggerOnChanges,
      'data-pageconfig-path': dataPagestatePath,
      'data-component-type': dataComponentType,
      otherProps,
      ...rest
    } = this.props

    let extraHtml: React.ReactNode = extra || undefined
    if (extra && _.isString(extra)) {
      extraHtml = <HtmlFragment __html={extra} />
    }

    if (!field) {
      // @ts-ignore
      const { type = 'Alert', colProps, style = {}, ..._rest } = this.props

      const C = _.get(fieldMap, type, 'div')
      const defaultStyle = { overflow: 'hidden' }
      let _style = { ...defaultStyle, ...style }
      return (
        <Col
          id={id}
          style={_style}
          {...colProps}
          data-pageconfig-path={dataPagestatePath}
          data-component-type={dataComponentType}
        >
          <C {..._rest} extra={extraHtml} />
        </Col>
      )
    }

    let ChildComponent = this.getComponent(type)

    const { getFieldDecorator } = form

    const label = title && (
      <span>
        {title}&nbsp;
        {tooltip && (
          <Tooltip title={tooltip}>
            <Icon type="question-circle-o" />
          </Tooltip>
        )}
      </span>
    )

    let _placeholder = placeholder

    if (placeholder === '' || placeholder === undefined) {
      _placeholder = getTips(type, title)
    }

    const formatedRules = rules.map(rule => {
      let type = rule.type

      if (type === 'custom' && _.isString(rule.patternStr2)) {
        rule.pattern = evalJavascript(rule.patternStr2, rest.pagestate)
        return _.omit(rule, 'type')
      }

      if (type && _.get(ruleMap, type)) {
        rule.pattern = _.get(ruleMap, type)
        return _.omit(rule, 'type')
      }

      // 兼容之前配置
      if (rule.patternStr) {
        rule.pattern = new RegExp(rule.patternStr)
      }

      return rule
    })

    if (required) {
      formatedRules.push({
        required: true,
        message: _placeholder,
      })
    }

    if (type === 'JsonEditor') {
      formatedRules.push({
        validator: (_rule, value, cb) => {
          if (value === '' || value === undefined) {
            cb()
          }
          try {
            JSON.parse(value)
            cb()
          } catch (e) {
            cb(e)
          }
        },
      })
    }

    let FormItemProps: FormItemProps = {
      colon: false,
      label,
    }

    if (labelCol) {
      FormItemProps.labelCol = labelCol
    }

    if (wrapperCol) {
      FormItemProps.wrapperCol = wrapperCol
    }

    return (
      <Col
        id={id}
        style={style}
        {...colProps}
        data-pageconfig-path={dataPagestatePath}
        data-component-type={dataComponentType}
      >
        <FormItem extra={extraHtml} {...FormItemProps}>
          {getFieldDecorator(field, {
            initialValue:
              defaultValue === '' || defaultValue === undefined
                ? undefined
                : defaultValue,
            rules: formatedRules,
          })(
            <ChildComponent
              placeholder={_placeholder}
              {...omit(otherProps, ['value'])}
              {...omit(rest, ['value'])}
              extra={extraHtml}
              onChange={this.onChange}
              onBlur={this.onBlur}
            />
          )}
        </FormItem>
      </Col>
    )
  }
}
