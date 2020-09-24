import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd'
import queryString from 'query-string'
import md5 from 'md5'
import LoginLayout from '../Layout'
import Api from '~/apis'
import './index.less'

interface IProps extends FormComponentProps { }

interface IState {
  is_submit_btn_loading: boolean
}

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

class LoginForm extends React.Component<IProps, IState> {

  state = {
    is_submit_btn_loading: false
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
    const res = await Api.Admin.asyncLogin({ ...data, password: md5(data.password) })
    message.success(res.message)
    const { gotoURL } = queryString.parse(window.location.search)
    setTimeout(() => {
      window.location.href = `${window.location.origin}/api/admin/login?code=${res.data.code}&gotoURL=${encodeURIComponent(gotoURL as string)}`
    }, 1000);
  }

  render() {
    const { is_submit_btn_loading } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <div className="login-container">
        <LoginLayout>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
            <FormItem style={{ marginTop: '10px' }}>
              <Button loading={is_submit_btn_loading} block size="large" type="primary" onClick={this.handleSubmit}>登 录</Button>
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <Link to={`/user/register${window.location.search}`} style={{ margin: '0 8px' }}>
                  免费注册
                </Link>
                <Link to={`/user/password/modify${window.location.search}`} style={{ margin: '0 8px' }}>
                  忘记密码
                </Link>
              </div>
            </FormItem>
          </Form>
        </LoginLayout>
      </div>
    )
  }
}

const WrappedLoginForm = Form.create<IProps>()(LoginForm);

export default WrappedLoginForm
