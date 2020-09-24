import React, { Fragment, Component } from 'react'
import CSSModules from 'react-css-modules'
import classnames from 'classnames'
import queryString from 'query-string'
import { Modal, Form, Input, Select, Button, message, Checkbox } from 'antd'
import { connect } from 'dva'

import styles from './index.module.less'
import { TheCardProps, TheCardState } from './interface'

@CSSModules(styles, { allowMultiple: true })
class TheCard extends Component<TheCardProps, TheCardState> {
  static displayName = 'TheCard'

  static defaultProps = {}

  state = {
    isHover: false,
    isModalVisible: false,
    templateData: {},
    isTempModalVisible: false,
  } as TheCardState

  addonBefore?: string

  setHoverStatus = (isHover: boolean) => {
    this.setState({ isHover })
  }

  getEditUrl = (route: string) => {

    const formateSearch = queryString.stringify({
      route,
    })
    return `/guiedit?${formateSearch}`
  }

  toggleModalVisible = (v: boolean) => {
    this.setState({
      isModalVisible: !!v,
    })
  }

  onEditBtnClick = (config: any) => {
    this.setState({
      templateData: config,
      isModalVisible: true,
    })
  }

  showTempModal = () => {
    this.setState({
      isTempModalVisible: true,
    })
  }
  toggleTempModalVisible = () => {
    this.setState({
      isTempModalVisible: false,
    })
  }


  onModalOk = () => {
    const { templateData } = this.state
    const { form, dispatch } = this.props

    form.validateFields(async (err, formData) => {
      if (!err) {
        const { id: projectId } = queryString.parse(window.location.search)
        let { route, title } = formData
        route = this.addonBefore + route
        const pageConfig = { ...templateData, route, title }
        await dispatch({
          type: 'guiEditor/createPage',
          payload: {
            pageConfig,
            projectId
          },
        })

        // 跳转到编辑页
        window.open(this.getEditUrl(pageConfig.route))
        this.toggleModalVisible(false)
      }
    })
  }

  renderForm = () => {
    const { form, projectDetail } = this.props
    const { getFieldDecorator } = form
    const formItemProps = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }

    const routeReg = /^(\/\w+)+$/

    const RouteValidator = (_rule: any, value: any, callback: Function) => {
      if (value) {
        if (!routeReg.test(value)) {
          callback(new Error('以斜杠开头,字母、数字、或下划线组合'))
        }
      }

      callback()
    }

    const { project_code: projectCode, name: projectName } = projectDetail
    this.addonBefore = '/project/' + projectCode

    return (
      <Form>
        <Form.Item label="项目名" {...formItemProps}>
          {projectName}
        </Form.Item>
        <Form.Item label="页面路径" {...formItemProps}>
          {getFieldDecorator('route', {
            rules: [{ required: true, message: '请输入页面路径' }, { validator: RouteValidator }],
          })(<Input placeholder="例如: /abc/list" />)}
        </Form.Item>
        <Form.Item label="页面标题" {...{ ...formItemProps }}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入标题' }],
          })(<Input placeholder="页面标题" />)}
        </Form.Item>
      </Form>
    )
  }

  // 渲染图片弹窗
  renderImg = (data: any) => {
    if (data.id) {
      return (
        <img src={data.imgUrl} alt="" />
      )
    }
  }

  render() {
    const { isHover, isModalVisible, isTempModalVisible } = this.state
    const { data, projectDetail } = this.props
    return (
      <div
        styleName="the-card"
        onMouseOver={() => this.setHoverStatus(true)}
        onMouseLeave={() => this.setHoverStatus(false)}
      >
        <div styleName="the-card-content" style={{ backgroundImage: data.imgUrl }}>
          <img src={data.imgUrl} alt="" height="100%" />
        </div>
        <div styleName={classnames('the-card-footer', { 'is-hover': isHover })}>
          <div styleName="the-card-desc">{data.desc}</div>
          <div styleName="the-button-group">
            <a onClick={() => this.showTempModal()} target="_blank" styleName="the-button">
              预览
            </a>
            <a onClick={() => this.onEditBtnClick(data.config)} target="_blank" styleName="the-button">
              创建
            </a>
          </div>
        </div>
        <Modal
          visible={isModalVisible}
          title="新建页面"
          onOk={this.onModalOk}
          onCancel={() => this.toggleModalVisible(false)}
        >
          {projectDetail && this.renderForm()}
        </Modal>
        <Modal
          styleName="ht-img-modal"
          visible={isTempModalVisible}
          width={800}
          centered
          title="效果预览"
          footer={null}
          onCancel={this.toggleTempModalVisible}
        >
          {this.renderImg(data)}
        </Modal>
      </div>
    )
  }
}

const wrapperCard = Form.create<TheCardProps>()(TheCard)

export default connect(({ global }: any) => ({
  projectDetail: global.projectDetail
}))(wrapperCard)
