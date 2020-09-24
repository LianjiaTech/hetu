import React from 'react'
import CSSModules from 'react-css-modules'

import { Modal, Form, Input, Select, message } from 'antd'
import { connect } from 'dva'

import styles from './index.module.less'

import ENV from '~/constant/env'

import { Props, ConnectState } from './interface'

const Option = Select.Option


@CSSModules(styles, { allowMultiple: true })
class ThePublishModal extends React.Component<Props> {
  static displayName = 'ThePublishModal'

  static defaultProps = {
    visible: false,
  }

  state = {}

  componentDidMount() { }

  onModalOk = () => {
    const { form, dispatch, onClose, projectId,
      pageId, draftId } = this.props

    form.validateFields((err, formData) => {
      if (!err) {
        dispatch({
          type: 'guiEditor/publish',
          payload: {
            ...formData,
            projectId,
            pageId,
            draftId,
          },
        }).then(() => {
          message.success('发布成功')
          // 跳转到编辑页
          onClose()
        })
      }
    })
  }

  renderForm = () => {
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemProps = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }

    return (
      <Form>
        <Form.Item label="发布环境" {...formItemProps}>
          {getFieldDecorator('env', {
            initialValue: ENV.current,
            rules: [{ required: true, message: '请选择' }],
          })(
            <Select placeholder="请选择发布环境" disabled>
              {ENV.envList.map((item, i) => (
                <Option key={i} value={item}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="备注" {...{ ...formItemProps }}>
          {getFieldDecorator('releaseNote', {})(<Input.TextArea placeholder="填写修改内容" />)}
        </Form.Item>
      </Form>
    )
  }

  toggleModalVisible = () => { }

  render() {
    const { visible, onClose } = this.props
    return (
      <Modal visible={visible} title="发布" onOk={this.onModalOk} onCancel={onClose}>
        {this.renderForm()}
      </Modal>
    )
  }
}

const wrapperForm = Form.create()(ThePublishModal)


export default connect(({ guiEditor }: ConnectState) => ({
  projectId: guiEditor.project,
  pageId: guiEditor.pageId,
  draftId: guiEditor.draftId,
}))(wrapperForm)
