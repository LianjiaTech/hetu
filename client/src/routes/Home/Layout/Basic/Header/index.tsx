import React, { Component } from 'react'
import {
  Button,
  Menu,
  Icon,
  Spin,
  Tag,
  Dropdown,
  Avatar,
  Divider,
  Tooltip,
  Form,
  Modal,
  Rate,
  Input,
  Radio,
  message,
} from 'antd'

import { isArray, get } from 'lodash'
import { connect } from 'dva'
import { TheHeaderProps, IUserInfo } from './interface'

import './index.less'

const FormItem = Form.Item
const { TextArea } = Input

@connect()
class TheHeader extends Component<TheHeaderProps> {
  static displayName = 'TheHeader'

  static defaultProps = {
    // userInfo: {},
  }

  state = {
    avatar: 'https://file.ljcdn.com/hetu-cdn/hetu-display-avatar-1597636530.png',
    visible: false,
  }

  renderHeaderFt = (userInfo: IUserInfo) => {
    const gotoURL = encodeURIComponent(window.location.href)
    const defaultDropdownMenus = [
      { name: '退出登陆', path: `/api/admin/logout?gotoURL=${gotoURL}`, icon: 'logout' },
    ]
    const dropdownMenus = defaultDropdownMenus
    const { avatar: defaultAvatar } = this.state
    const { name, role, avatar } = userInfo
    const displayName = [name, role].filter((i) => i).join('-')

    const menu = (
      <Menu className="menu" selectedKeys={[]}>
        {isArray(dropdownMenus) &&
          dropdownMenus.map((item, index) => (
            <Menu.Item key={index}>
              <a href={item.path}>
                <Icon type={item.icon} /> {item.name}
              </a>
            </Menu.Item>
          ))}
      </Menu>
    )
    return (
      <div className="right">
        <Tooltip title="问题反馈">
          <Button type="link" onClick={this.handleFeedBack} >问题反馈</Button>
        </Tooltip>
        <Dropdown overlay={menu}>
          <span className="action account ">
            <Avatar size="small" className="avatar" srcSet={defaultAvatar} src={avatar || defaultAvatar} />
            <span className="name">{displayName}</span>
          </span>
        </Dropdown>
      </div >
    )
  }

  handleFeedBack = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    const { form, dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'global/feedbackSubmit',
          payload: { ...values },
        }).then((res: any) => {
          if (res.code === 0) {
            message.success('感谢您的反馈！')
            this.setState({
              visible: false,
            })
          }
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  renderModal = () => {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    return (
      <Modal
        title="我要反馈"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        okText="提交"
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <FormItem label="反馈类型:">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '请选择反馈类型',
                },
              ],
            })(
              <Radio.Group>
                <Radio value="功能异常">功能异常</Radio>
                <Radio value="产品建议">产品建议</Radio>
                <Radio value="其他">其他</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="满意度:">
            {getFieldDecorator('score', {
              rules: [
                {
                  required: true,
                  message: '请选择满意度',
                },
              ],
            })(<Rate />)}
          </FormItem>
          <FormItem label="描述:">
            {getFieldDecorator('remark', {
              rules: [
                {
                  required: true,
                  message: '请填写宝贵的建议',
                },
              ],
            })(<TextArea autoSize={{ minRows: 6, maxRows: 10 }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  render() {
    const { userInfo, children, dispatch, form, projectDetail, ...otherProps } = this.props

    return (
      <div className="base-header" {...otherProps}>
        {this.renderHeaderFt(userInfo)}
        {this.renderModal()}
      </div>
    )
  }
}

export default Form.create<TheHeaderProps>()(TheHeader)
