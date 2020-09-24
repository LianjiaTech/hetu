import { Button, Form, Modal, Spin } from 'antd'
import _, { get, isFunction } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import HtForm from '~/components/Form'
import { updateComponentAlias } from '~/utils'
import { emitter } from '~/utils/events'
import './index.less'
import { ModalFormComponentProps, ModalFormComponentState } from './interface'

export const HtModalFormAlias = '$$HtModalForm'

updateComponentAlias(HtModalFormAlias, {})

interface DefaultProps extends Partial<ModalFormComponentProps> {
  top: number
}

@observer
export class ModalForm extends React.Component<
  ModalFormComponentProps & DefaultProps,
  ModalFormComponentState
> {
  static displayName = 'HtModalForm'

  static defaultProps: DefaultProps = {
    alias: HtModalFormAlias,
    mask: true,
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 17,
    },
    top: 100,
    onSuccessAction: null,
    _onSuccessAction: null,
    'data-component-type': 'HtModalForm',
  }

  state = {
    isPageLoading: false,
    visible: false,
    // 弹框距离页面顶部的距离
    top: this.props.top,
  }

  HtForm?: any

  constructor(props: ModalFormComponentProps) {
    // @ts-ignore
    super(props)
    const { getRef } = props
    if (isFunction(getRef)) {
      getRef(this)
    }
  }

  componentDidMount() {
    emitter.on('iframe.size.get', (v: DOMRect) => {
      // iframe相对浏览器窗口的距离
      let iframePositionY = _.get(v, 'y', 0)

      let top = this.props.top - iframePositionY
      // 小于零处理
      top = top < 0 ? 0 : top

      // 大于最大值处理
      let iframeHeight = _.get(v, 'height', 0)
      // 假设弹框的高度200
      let maxTop = iframeHeight - 200
      top = top > maxTop ? maxTop : top

      console.log('modal top=', top)
      this.setState({
        top,
      })
    })
  }

  toggleModalVisible = (visible: boolean): Promise<void> => {
    if (visible && window.$$child) {
      window.$$child.emit('iframe.getSize')
    }
    return new Promise((resolve, reject) => {
      try {
        this.setState(
          {
            visible,
          },
          () => {
            resolve()
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  // 取消事件
  onCancel = () => {
    const { onCancel } = this.props

    this.toggleModalVisible(false)
    this.reset()
    if (isFunction(onCancel)) {
      onCancel()
    }
  }

  // 提交成功事件
  onSuccess = (res: any) => {
    const { onSuccess } = this.props
    this.toggleModalVisible(false)
    this.reset()

    if (isFunction(onSuccess)) {
      onSuccess(res)
    }
  }

  reset = () => {
    const { alias } = this.props
    const setStoreState = get(this.props, 'pagestate.setStoreState')
    setStoreState({ [alias as string]: {} })
  }

  render() {
    const { isPageLoading, visible, top } = this.state

    const ButtonCancel = <Button onClick={this.onCancel}>取消</Button>

    let {
      buttonType,
      disabled,
      // form表单配置
      alias,
      url,
      method,
      fields,
      transform,
      cols,
      labelCol,
      wrapperCol,
      buttons = ['cancel', 'submit'],
      submitButtonText,
      sendFormData,

      // 弹框配置
      title,
      triggerButtonText,
      triggerButtonProps,
      onCancel,
      onSuccess,
      onSuccessAction,
      _onSuccessAction,
      pagestate,
      className,
      mask,

      // 编辑器属性
      'data-pageconfig-path': dataPagestatePath,
      'data-component-type': dataComponentType,
      ...otherProps
    } = this.props

    // @ts-ignore
    const _buttons = buttons.map((button: any) => {
      if (button === 'cancel') {
        return ButtonCancel
      }
      return button
    })

    const HtFormProps = {
      alias,
      pagestate,
      url,
      method,
      fields,
      transform,
      cols,
      labelCol,
      wrapperCol,
      buttons: _buttons,
      submitButtonText,
      sendFormData,
      onSuccess: this.onSuccess,
      onSuccessAction,
      _onSuccessAction,
    }

    if (window.$$child) {
      mask = false
    }

    return (
      <>
        {triggerButtonText && (
          <Button
            {...triggerButtonProps}
            type={buttonType}
            disabled={disabled}
            className={`ht-modal-trigger-btn ${className}`}
            onClick={() => this.toggleModalVisible(true)}
            data-pageconfig-path={dataPagestatePath}
            data-component-type={dataComponentType}
          >
            {triggerButtonText}
          </Button>
        )}

        <Modal
          {...otherProps}
          mask={mask}
          title={title || triggerButtonText}
          visible={visible}
          destroyOnClose={true}
          footer={null}
          onCancel={this.onCancel}
          style={{ top }}
        >
          <HtForm
            {...HtFormProps}
            getRef={(C: any) => {
              this.HtForm = C
            }}
            data-component-type={dataComponentType}
            data-pageconfig-path={dataPagestatePath}
            isCard={false}
          />
        </Modal>

        {isPageLoading && <Spin size="large" className="g-spin" />}
      </>
    )
  }
}

const wrapperForm = Form.create<ModalFormComponentProps>()(ModalForm)

export default wrapperForm
