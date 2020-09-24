import { Form } from 'antd'
import { WrappedFormUtils } from 'antd/es/form/Form'
import { get, isFunction } from 'lodash'
import React from 'react'
import { JsonSchema } from '~/types/index'
import Checkbox from '../../Checkbox'
import Input from '../../Input'
import InputNumber from '../../InputNumber'
import DatePicker from '../../PickerDate'
// 时间选择器
import MonthPicker from '../../PickerMonth'
import RangePicker from '../../PickerRange'
import TimePicker from '../../PickerTime'
import WeekPicker from '../../PickerWeek'
// 数据输入, Field组件类型
import Radio from '../../Radio'
import Select from '../../Select'
import Upload from '../../Upload'
import EditableContext from '../context'
import { HtEditableCellProps } from './interface'

const FieldComponents = {
  Checkbox,
  DatePicker,
  MonthPicker,
  WeekPicker,
  RangePicker,
  TimePicker,
  Input,
  InputNumber,
  Upload,
  Radio,
  Select,
}

/**
 * 获取组件
 * @param type 组件名, 例如Input
 * @param components
 */
const getComponent = (type: string, components: JsonSchema.DynamicObject) => {
  if (get(components, type)) {
    return get(components, type)
  }

  throw new TypeError(`组件${type}不存在`)
}

class EditableCell extends React.Component<HtEditableCellProps, any> {
  state: any = {
    editing: false,
  }

  input?: HTMLElement

  form?: WrappedFormUtils<any>

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        if (this.input && isFunction(this.input.focus)) {
          this.input.focus()
        }
      }
    })
  }

  save = (e: React.CompositionEvent) => {
    const { record, handleSave } = this.props
    this.form &&
      this.form.validateFields((error, values) => {
        if (error && error[e.currentTarget.id]) {
          return
        }
        this.toggleEdit()
        handleSave({ ...record, ...values })
      })
  }

  renderCell = ({ form }: { form: WrappedFormUtils }) => {
    if (!form) return null
    this.form = form
    const {
      children,
      dataIndex,
      record,
      className,
      title,
      type = 'Input',
      editable,
      handleSave,
      onClick,
      ...otherProps
    } = this.props
    const { editing } = this.state

    const C = getComponent(type, FieldComponents)

    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title}为必填项`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <C
            {...otherProps}
            ref={(node: HTMLElement) => {
              this.input = node
            }}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div className="ht-editable-cell-value-wrap" onClick={this.toggleEdit}>
        {children}
      </div>
    )
  }

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    )
  }
}

export default EditableCell
