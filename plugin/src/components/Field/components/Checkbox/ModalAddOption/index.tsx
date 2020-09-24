import { Form, Icon, Input, Modal, Tag } from 'antd'
import { isFunction } from 'lodash'
import React from 'react'
import { JsonSchema } from '~/types/index'
import { ExtraOption } from '../interface'
import './index.less'
import { ModalAddOptionProps } from './interface'

const FormItem = Form.Item

const FormItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class HtModalAddOption extends React.Component<ModalAddOptionProps> {
  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
  }

  onAddTagClick = () => {
    const { onOpen } = this.props
    if (isFunction(onOpen)) {
      onOpen()
    }
  }

  submit = (e?: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault()
    const { form, onOk } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        console.log('提交成功', values)
        if (isFunction(onOk)) {
          onOk(values)
        }
      }
    })
  }

  getOptionsMap = (options: ExtraOption[]) => {
    let labelMap: JsonSchema.DynamicObject = {}
    let valueMap: JsonSchema.DynamicObject = {}
    for (let option of options) {
      try {
        let label = option.label
        let value = option.value
        labelMap[label] = true
        // @ts-ignore
        valueMap[value] = true
      } catch (e) {
        console.error(e)
      }
    }
    return { labelMap, valueMap }
  }

  render() {
    const { visible, form, onCancel, options } = this.props
    const { getFieldDecorator } = form

    const { labelMap, valueMap } = this.getOptionsMap(options)

    const uniqueValidator = (map: JsonSchema.DynamicObject) => {
      return (_rule: any, value: string, cb: Function) => {
        if (map[value]) {
          cb(new Error(`${value} 已存在`))
        }
        cb()
      }
    }

    return (
      <>
        <Tag
          onClick={this.onAddTagClick}
          style={{ background: '#fff', borderStyle: 'dashed' }}
        >
          <Icon type="plus" /> New
        </Tag>
        <Modal
          title="添加选项"
          visible={visible}
          onOk={() => this.submit()}
          onCancel={onCancel}
          destroyOnClose={true}
          className="ht-add-option-modal"
        >
          <Form onSubmit={this.submit} {...FormItemLayout}>
            <FormItem colon={false} label="显示值">
              {getFieldDecorator('label', {
                rules: [
                  {
                    required: true,
                    message: '请输入显示值',
                  },
                  {
                    validator: uniqueValidator(labelMap),
                  },
                ],
              })(<Input placeholder="请输入显示值" />)}
            </FormItem>
            <FormItem colon={false} label="真实值">
              {getFieldDecorator('value', {
                rules: [
                  {
                    required: true,
                    message: '请输入真实值',
                  },
                  {
                    validator: uniqueValidator(valueMap),
                  },
                ],
              })(<Input placeholder="请输入真实值" />)}
            </FormItem>
          </Form>
        </Modal>
      </>
    )
  }
}

export default Form.create<ModalAddOptionProps>()(HtModalAddOption)
