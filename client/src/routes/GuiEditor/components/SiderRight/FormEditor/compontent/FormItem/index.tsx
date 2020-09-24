import React from 'react'
import { FormItemProps } from 'antd/es/form/FormItem'
import { Button, Form, Tooltip } from 'antd'
import { ColProps } from 'antd/es/col'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { InterfaceProperty, propertyType } from '~/types/components/interfaceEditConfig'
import HtmlFragment from '~/components/HtmlFragment'

import _ from 'lodash'
import './index.less'

interface MenuItem {
  title: string
  value: string
}

interface _FormItemProps extends FormItemProps {
  // 开启自定义菜单
  customContextMenu?: boolean,
  propConfig?: InterfaceProperty
  formItemLayout?: {
    labelCol?: ColProps,
    wrapperCol?: ColProps
  }
  showTooltip?: boolean
}

interface _FormItemState {
  originType?: propertyType
  currentType?: propertyType
  menuData?: MenuItem[]
}

class FormItem extends React.Component<_FormItemProps, _FormItemState> {

  static defaultProps = {
    customContextMenu: false,
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    },
    showTooltip: false
  }

  state = {} as _FormItemState

  static getDerivedStateFromProps(nextProps: _FormItemProps, prevState: _FormItemState) {
    let currentType = _.get(nextProps, 'propConfig.type', 'javascript')
    let originType = prevState.originType
    let menuData: MenuItem[] = [
      {
        title: 'javascript',
        value: 'javascript'
      }
    ]

    if (!originType) { // 如果originType不存在, 让originType等于currentType
      originType = currentType
    }

    if (currentType === 'javascript') {  // 当前组件类型不等于javascript
      menuData = [
        {
          title: originType,
          value: originType
        }
      ]
    }

    return {
      ...prevState,
      originType,
      currentType,
      menuData
    }
  }

  /**
   * 点击自定义菜单
   */
  onMenuItemClick = (e: React.MouseEvent, data: any) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('onMenuItemClick=', data);
    // this.props.propConfig.type = data
  }

  render() {
    const { menuData } = this.state
    const { customContextMenu, propConfig = {}, showTooltip, formItemLayout, label, extra, children, ...rest } = this.props

    const demo = _.get(propConfig, 'demo')
    const _extra = <div style={{ fontSize: '12px', marginLeft: '8px', overflow: 'hidden', 'textOverflow': 'ellipsis' }}>{extra}</div>
    const _label = <div style={{ display: 'flex', lineHeight: '28px' }}>
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255, 0.9)' }}>{label}</div>
      {showTooltip ? <Tooltip overlayClassName="ht-form-item-tooltip" placement="top" title={extra} >{_extra}</Tooltip> : _extra}
      {demo && <Tooltip overlayClassName="ht-form-item-tooltip" trigger="click" title={<HtmlFragment __html={demo} />}><Button size="small" type="link" style={{ fontSize: '12px', lineHeight: '28px' }}>查看用法</Button></Tooltip>}
    </div >
    if (!customContextMenu) {
      return <Form.Item {...formItemLayout} colon={false} label={_label} {...rest}> {children}</Form.Item >
    }

    return (
      <div className="the-gui-form-item" >
        <ContextMenuTrigger id="some_unique_identifier">
          <Form.Item {...formItemLayout} colon={false}  {...rest}>{children}</Form.Item>
        </ContextMenuTrigger>
        <ContextMenu id="some_unique_identifier" className="the-context-menu">
          {menuData.map((v, i) => (
            <MenuItem key={i} data={{ value: v.value }} onClick={this.onMenuItemClick} attributes={{ className: 'the-menu-item' }}>
              {v.title}
            </MenuItem>
          ))}
        </ContextMenu>
      </div>
    )
  }
}


export default FormItem
