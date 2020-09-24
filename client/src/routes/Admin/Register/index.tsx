import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Link } from 'react-router-dom';
import { Row, Col, Form, Input, Button, message } from 'antd'
import md5 from 'md5'
import LoginLayout from '../Layout'
import Api from '~/apis'
import './index.less'

interface IProps extends FormComponentProps { }

interface IState {
  // 下一次可发送验证的时间
  next_get_verify_time: number
  is_get_verify_btn_loading: boolean
  is_submit_btn_loading: boolean
}

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

class ModifyPswForm extends React.Component<IProps, IState> {

  state = {
    next_get_verify_time: 0,
    is_get_verify_btn_loading: false,
    is_submit_btn_loading: false
  }

  componentWillUnmount() {
    clearInterval(this.getVerifyCodeTimeout)
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (err) return
      try {
        this.setState({
          is_submit_btn_loading: true
        })
        await this.asyncSendData(values)
      } finally {
        this.setState({
          is_submit_btn_loading: false
        })
      }
    });
  }

  asyncSendData = async (data: any) => {
    const res = await Api.Admin.asyncRegister({ ...data, password: md5(data.password) })
    message.success(res.message)
  }

  getVerifyCodeTimeout: NodeJS.Timeout
  getVerifyCode = async () => {
    const { next_get_verify_time } = this.state
    const { form } = this.props
    form.validateFields(['email'], async (err, _email) => {
      if (err) return

      try {
        if (next_get_verify_time <= 0) {
          const email = form.getFieldValue('email')
          this.setState({ is_get_verify_btn_loading: true })
          await Api.Admin.asyncGetVerifyCode(email)
          this.setState({
            is_get_verify_btn_loading: false,
            next_get_verify_time: 60
          })
          this.getVerifyCodeTimeout = setInterval(() => {
            if (this.state.next_get_verify_time <= 0) {
              clearInterval(this.getVerifyCodeTimeout)
            } else {
              this.setState({
                next_get_verify_time: this.state.next_get_verify_time - 1
              })
            }
          }, 1000);
        }
      } catch (e) {
        this.setState({
          is_get_verify_btn_loading: false,
        })
        throw e
      }
    })


  }

  render() {
    const { next_get_verify_time, is_get_verify_btn_loading, is_submit_btn_loading } = this.state
    const { children, form } = this.props
    const { getFieldDecorator } = form
    return (
      <div className="register-container">
        <LoginLayout>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    min: 2,
                    max: 20,
                    message: '请输入用户名'
                  }
                ]
              })(<Input size="large" placeholder="请输入用户名" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    type: 'email',
                    message: '请输入合法的邮箱'
                  }
                ]
              })(<Input size="large" placeholder="请输入邮箱账号" />)}
            </FormItem>
            <FormItem >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    min: 6,
                    message: '请输入6位以上字符'
                  }
                ]
              })(<Input.Password size="large" placeholder="请输入账号密码" />)}
            </FormItem>
            <Row>
              <Col span={16}>
                <FormItem >
                  {getFieldDecorator('verify_code', {
                    rules: [
                      {
                        required: true,
                        len: 6,
                        message: '请输入6位验证码'
                      }
                    ]
                  })(<Input size="large" placeholder="请输入验证码" />)}
                </FormItem>
              </Col>
              <Col offset={1} span={7}>
                <Button loading={is_get_verify_btn_loading} block size="large" disabled={next_get_verify_time > 0} onClick={this.getVerifyCode}>{
                  next_get_verify_time > 0 ? `${next_get_verify_time} s` : '获取'
                }</Button>
              </Col>
            </Row>
            <FormItem style={{ marginTop: '10px' }}>
              <Button loading={is_submit_btn_loading} block size="large" type="primary" onClick={this.handleSubmit}>注 册</Button>
              <Link to={`/user/login${window.location.search}`} style={{ display: 'block', textAlign: 'center', marginTop: '12px' }}>
                前往登录
                </Link>
            </FormItem>
          </Form>
        </LoginLayout>

      </div>
    )
  }
}

const WrappedModifyPswForm = Form.create<IProps>()(ModifyPswForm);

export default WrappedModifyPswForm
