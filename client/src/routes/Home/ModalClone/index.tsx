import React from 'react'
import { Modal, Form, Input, message, Select } from 'antd'

import queryString from 'query-string'
import _ from 'lodash'
import Api from '~/apis'

import { TheCloneModalProps, TheCloneModalState } from './interface'

class TheCloneModal extends React.Component<TheCloneModalProps, TheCloneModalState> {
  static displayName = 'TheCloneModal'

  static defaultProps = {
    visible: false,
  }

  state: TheCloneModalState = {
    projectList: []
  }

  async componentDidMount() {

    const projectList = await Api.Project.getAsyncProjectList()
    this.setState({
      projectList
    })
  }

  randomStr?: string

  onChange = () => {
    this.props.onChange(false)
    setTimeout(() => {
      this.randomStr = getRandomStr(8)
    })
  }

  onModalOk = () => {
    const { form, pageConfig: _pageConfig } = this.props

    form.validateFields(async (err, formData) => {
      if (!err) {
        const { projectId, ...otherData } = formData
        const pageConfig = { ..._pageConfig, ...otherData }

        await this.createPage(pageConfig, projectId)

        message.success('页面克隆成功,即将进入编辑页面')
        // 跳转到编辑页
        setTimeout(() => {
          let search = queryString.stringify({
            query: window.location.search.replace('?', ''),
            route: formData.route,
          })
          window.open(`/guiedit?${search}`)
        }, 1000)
      }
    })
  }

  createPage = async (pageConfig: any, projectId: number) => {
    if (_.isPlainObject(pageConfig)) {
      let path = _.get(pageConfig, 'route')
      let name = _.get(pageConfig, 'title')

      if (!projectId) {
        throw new Error('请先选择项目')
      }

      const content = JSON.stringify(pageConfig)

      const res = await Api.Page.createAsyncPage({
        path,
        name,
        content,
        projectId,
      })

      return res
    }
  }

  renderForm = () => {
    const { projectList } = this.state
    const { form, pageConfig, projectDetail } = this.props
    const { getFieldDecorator } = form
    const formItemProps = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }

    const routeReg = /^\/project(\/.+)+$/

    const RouteValidator = (_rule: any, value: any, callback: Function) => {
      if (value) {
        if (!routeReg.test(value)) {
          callback(new Error('参考格式: /project/项目名/**/*'))
        }
      }

      callback()
    }
    this.randomStr = this.randomStr || getRandomStr(8)

    let initialRoute = pageConfig.route + this.randomStr

    if (!routeReg.test(initialRoute)) {
      initialRoute = '/project' + initialRoute
    }

    const filterOption = (input: string, option: React.ReactElement) => {
      return option.props.title.indexOf(input) >= 0
    }

    return (
      <Form>
        <Form.Item label="页面路径" {...formItemProps}>
          {getFieldDecorator('route', {
            initialValue: initialRoute,
            rules: [
              { required: true, message: '请输入页面路径' },
              { validator: RouteValidator },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="页面标题" {...{ ...formItemProps }}>
          {getFieldDecorator('title', {
            initialValue: pageConfig.title,
            rules: [{ required: true, message: '请输入标题' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="所属项目" {...{ ...formItemProps }}>
          {getFieldDecorator('projectId', {
            initialValue: projectDetail.id,
            rules: [{ required: true, message: '请选择' }],
          })(<Select showSearch filterOption={filterOption}>
            {_.isArray(projectList) && projectList.map((item, i) => (
              <Select.Option value={item.id} key={i} title={item.name}>{item.name}</Select.Option>
            ))}
          </Select>)}
        </Form.Item>
      </Form>
    )
  }

  toggleModalVisible = () => { }

  render() {
    const { visible, onChange } = this.props
    return (
      <Modal
        visible={visible}
        title="克隆页面"
        onOk={this.onModalOk}
        onCancel={this.onChange}
      >
        {this.renderForm()}
      </Modal>
    )
  }
}

/**
 * 生成n位长度的字符串
 * @param n 
 */
function getRandomStr(n: number): string {
  var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var result = ''
  for (var i = 0; i < n; i++) {
    result += str[parseInt(`${Math.random() * str.length}`)]
  }
  return result
}

export default Form.create<TheCloneModalProps>()(TheCloneModal)

