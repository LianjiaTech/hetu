import { store } from '@ice/stark-data'
import { Button, Icon, Modal, Tooltip, Upload } from 'antd'
import { RcFile } from 'antd/es/upload'
import _, { get, isFunction } from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { _resolveAction } from '~/utils/actions'
import request from '~/utils/request'
import './index.less'
import {
  HtUploadFile,
  HtUploadProps,
  HtUploadState,
  IPrivateOptions,
  UploadListType,
} from './interface'
import { formatFileList, formatFileList2 } from './utils'

export const defaultPrivateConfig = {
  // 服务云申请
  Bucket: 'hetu-private',
}

@observer
export default class HtUpload extends Component<HtUploadProps, HtUploadState> {
  static displayName = 'HtUpload'

  static defaultProps = {
    isPrivate: false,
    max: 10,
    disabled: false,
  }

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    isInit: false,
    privateOptions: defaultPrivateConfig,
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const { privateConfig, value, isPrivate } = this.props
    const privateOptions: IPrivateOptions = {
      ...privateConfig,
      ...defaultPrivateConfig,
    }

    if (isPrivate) {
      const data = {
        Bucket: privateOptions.Bucket,
        urls: _.isArray(value) ? value : [],
      }

      if (data.urls.length) {
        const res = await request.post(`/api/s3/url/signed`, data)
        if (res && _.isArray(res.data)) {
          this.setState({
            isInit: true,
            fileList: formatFileList2(res.data),
          })
        }
      }
    } else {
      this.setState({
        isInit: true,
        fileList: formatFileList(value),
      })
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file: HtUploadFile) => {
    const listType = get(this.props, 'uploadProps.listType', 'picture-card')
    if (listType === 'picture-card') {
      this.setState({
        previewImage: file.thumbUrl || file.url,
        previewVisible: true,
      })
    } else {
      // @ts-ignore
      _resolveAction('openWindow', file.thumbUrl || file.url)
    }
  }

  handleChange = (info: any) => {
    const { max, onChange, isPrivate } = this.props

    let fileList = info.fileList

    let successFileList = [] as string[]

    fileList = fileList.slice(-(max as number))

    fileList = fileList.map((item: HtUploadFile) => {
      if (item.response) {
        let url = _.get(item, 'response.Location')
        let thumbUrl = _.get(item, 'response.thumbUrl')
        if (!url) {
          // 上传出错
          item.status = 'error'
          Modal.error({ title: _.get(item.response, 'message', '上传出错') })
          return item
        }

        item.url = url
        item.thumbUrl = isPrivate ? thumbUrl : url
      }

      successFileList.push(item.url as string)
      return item
    })

    this.setState({
      fileList,
    })

    if (isFunction(onChange)) {
      onChange(successFileList)
    }
  }

  beforeUpload = async (file: RcFile) => {
    try {
      const { width, height, maxSize } = this.props

      if (_.isNumber(width) || _.isNumber(height)) {
        await this.checkAspect(file, { width, height })
      }

      if (_.isNumber(maxSize)) {
        await this.checkSize(file, maxSize)
      }

      return file
    } catch (e) {
      Modal.error({ title: e.message })
      throw e
    }
  }

  /* 校验——图片大小 size 单位 KB */
  checkSize = async (file: RcFile, maxSize?: number) => {
    console.log('IMG-Real-SIZE', `${(file.size / 1000).toFixed(1)}kb`)
    if (_.isNumber(maxSize) && file.size > maxSize * 1000) {
      throw new Error(`请上传大小不超过 ${maxSize}kb 的图片!`)
    }

    return file
  }

  /**
   * 校验长宽、尺寸
   */
  checkAspect = (
    file: RcFile,
    { width, height }: { width?: number; height?: number }
  ) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = e => {
        const image = new Image()
        // @ts-ignore
        image.src = e.target.result
        image.onload = function() {
          console.log('IMG-Real-WH', image.width, image.height)

          if (width && image.width !== width) {
            reject(new Error(`请上传宽度为 ${width}px 的图片`))
          }

          if (height && image.height !== height) {
            reject(new Error(`请上传尺寸为高度为 ${height}px 的图片`))
          }

          resolve(file)
        }
        image.onerror = reject
      }
      fileReader.readAsDataURL(file)
    })
  }

  renderUploadButton = (
    listType: UploadListType,
    fileList: HtUploadFile[],
    max: number,
    isPrivate?: boolean
    // eslint-disable-next-line max-params
  ) => {
    const isHidden = fileList && fileList.length >= max

    const Container = (props: any) => {
      if (props.isPrivate) return props.children
      return (
        <Tooltip
          title={
            isPrivate
              ? '非签名访问, 请不要上传涉及公司敏感信息的文件'
              : undefined
          }
        >
          {props.children}
        </Tooltip>
      )
    }

    if (listType === 'picture-card') {
      if (isHidden) return null
      return (
        <Container isPrivate={isPrivate}>
          <div className="ht-upload-select-picture-btn">
            <Icon type="plus" />
            <div className="ant-upload-text">上传</div>
          </div>
        </Container>
      )
    }

    return (
      <Container isPrivate={isPrivate}>
        <Button disabled={isHidden}>
          <Icon type="upload" /> 上传
        </Button>
      </Container>
    )
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const {
      isPrivate,
      privateConfig,
      value,
      uploadProps,
      max,
      width,
      height,
      maxSize,
      disabled,
      pagestate,
      onChange,
      ...otherProps
    } = this.props

    let {
      action,
      listType = 'picture-card' as 'picture-card',
      filename = '',
      ...otherUploadProps
    } = uploadProps

    const projectCode = _.get(pagestate, 'projectDetail.project_code')

    if (window.__POWERED_BY_QIANKUN__) {
      // 在微前端中
      action = store.get('hetu-request-config').baseURL + action
    }

    return (
      <div className="ht-upload-wrapper" {...otherProps}>
        <Upload
          {...otherUploadProps}
          action={action}
          listType={listType}
          fileList={fileList}
          disabled={disabled}
          // @ts-ignore
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={{ filename, projectCode }}
        >
          {this.renderUploadButton(
            listType,
            fileList,
            max as number,
            isPrivate
          )}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
