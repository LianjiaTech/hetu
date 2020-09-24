import React, { Fragment, Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Icon, Tooltip, InputNumber, Switch, Collapse, Button, Select, message } from 'antd'
import { } from 'antd/es/form'
import _ from 'lodash'
import classNames from 'classnames'

import { emitter } from '~/utils/events'
import styles from './index.module.less'
import { InterfaceProperty, InterfaceEditConfig, InterfaceSubProperty, properties } from '~/types/components/interfaceEditConfig'
import { Props, ConnectState } from './interface'

// import { isJavascriptStr } from '~/utils'
import { isKeyboardEvent } from '~/constant/keyboardEvent'

import FormInput from './compontent/input'
import FormItem from './compontent/FormItem'
import JsonEditor from '~/components/JsonEditor/Controled'

const Panel = Collapse.Panel
const ButtonGroup = Button.Group

class TheFormEditor extends Component<Props, {}> {
  static propTypes = {}

  state = {}

  // json类型的表单
  jsonFields: dynamicObject = {}

  componentWillMount() {
    emitter.on('TheFormEditor.submit', this.onSubmit)
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount = () => {
    emitter.off('TheFormEditor.submit', this.onSubmit)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  // 绑定键盘事件
  onKeyDown = (e: KeyboardEvent) => {
    if (isKeyboardEvent(e, 'save')) {
      this.onSubmit(e)
    }
  }

  // 提交表单
  onSubmit = (e?: KeyboardEvent) => {
    e && e.preventDefault()
    const { form, activeTab, updatePageConfigAndReload } = this.props

    if (activeTab !== 'base') {
      return false
    }

    form.validateFieldsAndScroll({ force: true }, async (err: any, allValues: dynamicObject) => {
      if (err) {
        console.log('err', err)
        return err
      }

      updatePageConfigAndReload(allValues)

    })
  }

  /**
   * 渲染FormContent
   * type、children属性不可编辑, 
   * 
   * @param dataProps 当前组件的配置
   * @param dataPageConfigPath 当前属性在pageConfig中的路径
   */
  renderFormContent = (formData: dynamicObject) => {
    const { selectedComponentData, editConfigData, form } = this.props
    let type = selectedComponentData['dataComponentType']

    // 类型二, 组件内置属性, 例如 fields、columns等
    const { getFieldDecorator } = form

    const AdvancedAttributes = this.renderProps(formData, editConfigData, 'extend')

    return (
      <div>
        <FormItem formItemLayout={{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }} label={<span>组件类型</span>}>
          <div style={{ display: 'none' }}>{getFieldDecorator('type', { initialValue: type })(<FormInput disabled />)}</div>
          <span style={{ color: '#FFF' }}>{type}</span>
        </FormItem>
        {this.renderProps(formData, editConfigData, 'default')}
        {
          AdvancedAttributes && (<Collapse activeKey="extend" bordered={false}>
            <Panel key="extend" header="高级属性">
              {AdvancedAttributes}
            </Panel>
          </Collapse>)
        }
      </div>
    )
  }

  /**
   * 将属性渲染为form表单
   * @param compontentProps 组件属性
   * @param compontentPropsConfig 组件属性定义文档
   */
  renderProps = (
    compontentProps: dynamicObject,
    compontentPropsConfig: InterfaceEditConfig,
    group: 'extend' | 'default'
  ) => {
    if (_.isPlainObject(compontentPropsConfig)) {
      // 只对明确声明了的组件属性进行编辑, 方便统一生成文档
      let propEditorItemList = []
      for (let fieldKey of Object.keys(compontentPropsConfig)) {

        let _group = compontentPropsConfig[fieldKey].group || 'default'
        if (_group !== group) {
          continue
        }

        let propConfig = compontentPropsConfig[fieldKey]

        let propValue = compontentProps[fieldKey] !== undefined ? compontentProps[fieldKey] : compontentPropsConfig[fieldKey].defaultValue
        let editorItem = this.renderPropEditorItem(`${fieldKey}`, propConfig, propValue, 1)

        propEditorItemList.push(editorItem)
      }

      return propEditorItemList.length ? propEditorItemList : null
    }

    return null
  }

  /**
   * 获取数组的默认项, 用于添加时的默认值
   */
  getDefaultArrayItem = (properties: properties) => {
    // 生成默认元素值
    let defaultItemValue: { [key: string]: any } = {}
    if (properties) {
      for (let key of Object.keys(properties)) {
        defaultItemValue[key] = properties[key].defaultValue
      }
    }
    return defaultItemValue
  }

  // 将对象渲染为panel, object/arrayOf类型都需要用到
  renderProperties = (
    fieldKey: string,
    propConfig: InterfaceProperty,
    propValue: any,
    isRenderArray = false,
    level: number
  ) => {
    const { dataPageConfigPath } = this.props.selectedComponentData
    /****************************↓↓↓↓↓为方便渲染数组↓↓↓↓↓****************************/
    // 如果是数组的话, 需要绑定操作, 以便添加/删除数据
    // 根据当前路径, 还原出数组key对应的路径
    let propJsPathArray = _.toPath(fieldKey)
    // 最后一位肯定是当前元素的index值
    let currentItemIndex = Number.parseInt(propJsPathArray.pop()) || 0
    // 生成默认元素值
    let defaultItemValue = this.getDefaultArrayItem(propConfig.properties)
    /****************************↑↑↑↑↑方便渲染数组↑↑↑↑↑****************************/

    // 正式的渲染逻辑
    let itemList = []
    for (let key of Object.keys(propConfig.properties)) {
      // 只有单层嵌套, 不考虑多层属性嵌套的情况
      let _propConfig: InterfaceProperty = propConfig.properties[key]

      let defaultValue = _propConfig.defaultValue
      let initialPropertyValue = _.get(propValue, key, defaultValue)

      let item = this.renderPropEditorItem(
        `${fieldKey}.${key}`,
        _propConfig,
        initialPropertyValue,
        level + 1
      )

      itemList.push(item)
    }

    let extraActionList = this.renderExtraActionList(
      fieldKey,
      currentItemIndex,
      defaultItemValue,
    )

    if (isRenderArray) { // 如果为ArrayOf
      return (
        <div key={`${fieldKey}_${dataPageConfigPath}_arrayof`} className={classNames(styles['m-collapse'], `level-${level}`)} >
          <div style={{ display: 'flex', padding: '2px 16px 6px 16px', color: '#fff' }}>
            <span>[{currentItemIndex}]</span>
            <div style={{ textAlign: 'right', flex: 1 }}>{extraActionList}</div>
          </div>
          <div style={{ paddingBottom: "12px" }}>{itemList}</div>
        </div>
      )
    }

    return (
      <div key={`${fieldKey}_${dataPageConfigPath}_object`} className={classNames(styles['m-collapse'], `level-${level}`)} >
        <div style={{ padding: '14px 0 14px 16px', color: 'rgba(255,255,255,.9)' }}>
          {propConfig.title}&nbsp;
          {propConfig.desc && <Tooltip title={propConfig.desc}>
            <Icon type="question-circle-o" />
          </Tooltip>}
        </div>
        <div style={{ padding: '0px 0 8px 16px' }}>{itemList}</div>
      </div>
    )
  }

  renderExtraActionList = (
    relativePath: string,
    currentItemIndex: number,
    defaultItemValue: any,
  ) => {

    const parentRelativePath = relativePath.replace(/\[\d\]$/, '')

    function getFieldValue(form: any, path: string) {
      const formData = form.getFieldsValue()
      return _.get(formData, path)
    }

    let extraActionList = (
      <ButtonGroup>
        <Button
          onClick={() => {
            const currentParentValue: dynamicObject[] = getFieldValue(this.props.form, parentRelativePath)
            // 执行添加操作, 添加到该元素之前
            let newParentValue = [
              ...currentParentValue.slice(0, currentItemIndex),
              defaultItemValue,
              ...currentParentValue.slice(currentItemIndex),
            ]
            this.props.updatePageConfig(parentRelativePath, newParentValue)
          }}
          size="small"
          icon="plus"
        />
        <Button
          onClick={() => {
            const currentParentValue: dynamicObject[] = getFieldValue(this.props.form, parentRelativePath)
            // 删除元素
            let newParentValue = [
              ...currentParentValue.slice(0, currentItemIndex),
              ...currentParentValue.slice(currentItemIndex + 1),
            ]
            this.props.updatePageConfig(parentRelativePath, newParentValue)
            console.info('remove success')
          }}
          size="small"
          icon="delete"
        />
        <Button
          onClick={() => {
            const currentParentValue: dynamicObject[] = getFieldValue(this.props.form, parentRelativePath)
            let currentItem = currentParentValue[currentItemIndex]
            let newParentValue = _.cloneDeep(currentParentValue)
            if (currentItemIndex === 0) {
              console.info('up success')
              return
            } else {
              let beforeItemIndex = currentItemIndex - 1
              let beforeItem = _.cloneDeep(currentParentValue[beforeItemIndex])
              newParentValue[beforeItemIndex] = currentItem
              newParentValue[currentItemIndex] = beforeItem
            }
            console.log('parentRelativePath', parentRelativePath)
            console.log('newParentValue', JSON.stringify(newParentValue))
            this.props.updatePageConfig(parentRelativePath, newParentValue)
            console.info('up success')
          }}
          size="small"
          icon="arrow-up"
        />
        <Button
          onClick={() => {
            const currentParentValue: dynamicObject[] = getFieldValue(this.props.form, parentRelativePath)
            let currentItem = currentParentValue[currentItemIndex]
            let newParentValue = _.cloneDeep(currentParentValue)
            if (currentItemIndex === currentParentValue.length - 1) {
              console.info('down success')
              return
            } else {
              let nextItemIndex = currentItemIndex + 1
              let nextItem = _.cloneDeep(currentParentValue[nextItemIndex])
              newParentValue[currentItemIndex] = nextItem
              newParentValue[nextItemIndex] = currentItem
            }
            this.props.updatePageConfig(parentRelativePath, newParentValue)
            console.info('down success')
          }}
          size="small"
          icon="arrow-down"
        />
      </ButtonGroup>
    )
    return extraActionList
  }

  /**
  * @param fieldKey  字段
  * @param propConfig  字段配置
  * @param fieldValue 字段的值
  * @param level 层级
  */
  renderPropEditorItem = (fieldKey: string, propConfig: InterfaceProperty, fieldValue: any, level: number = 1): React.ReactNode => {
    if (propConfig.visible !== undefined && !propConfig.visible) return null

    const { dataPageConfigPath } = this.props.selectedComponentData
    const { getFieldDecorator } = this.props.form

    fieldKey = fieldKey.trim()
    let dataType = propConfig.type

    const getFieldDecoratorOption = {
      initialValue: fieldValue,
    }

    const showTooltip = propConfig.showTooltip
    const disabled = propConfig.isEditable === false

    let labelItem = propConfig.title

    const desc = propConfig.desc && <>{propConfig.desc}{propConfig.doc && <Button type="link" target="_blank" href={propConfig.doc}>详情</Button>}</>

    switch (dataType) {
      case 'string':
        return (() => {
          return (
            <FormItem key={`${fieldKey}_${dataPageConfigPath}_${dataType}`} extra={desc} showTooltip={showTooltip} propConfig={propConfig} label={labelItem} >
              {getFieldDecorator(fieldKey, getFieldDecoratorOption)(<FormInput disabled={disabled} autoSize={propConfig.autoSize} placeholder={propConfig.placeholder} />)}
            </FormItem>
          )
        })()
      case 'number':
        return (() => {
          return (
            <FormItem key={`${fieldKey}_${dataPageConfigPath}_${dataType}`} extra={desc} label={labelItem} showTooltip={showTooltip} propConfig={propConfig} >
              {getFieldDecorator(fieldKey, getFieldDecoratorOption)(<InputNumber disabled={disabled} />)}
            </FormItem>
          )
        })()
      case 'bool':
        return (() => {
          return (
            <FormItem key={`${fieldKey}_${dataPageConfigPath}_${dataType}`} extra={desc} label={labelItem} showTooltip={showTooltip} propConfig={propConfig} >
              {getFieldDecorator(fieldKey, { ...getFieldDecoratorOption, valuePropName: 'checked' })(
                <Switch disabled={disabled} />,
              )}
            </FormItem>
          )
        })()
      case 'enum':
        return (() => {
          const mode = propConfig.mode
          let optionList = []
          let index = 0
          for (let item of propConfig.enumList) {
            let enumItem = propConfig.enumList[index]
            let enumDesc = propConfig.enumDescriptionList[index]
            optionList.push(
              <Select.Option key={`option-${index}`} value={enumItem}>
                {enumDesc}
              </Select.Option>
            )
            index++
          }
          return (
            <FormItem key={`${fieldKey}_${dataPageConfigPath}_${dataType}`} extra={desc} label={labelItem} showTooltip={showTooltip} propConfig={propConfig} >
              {getFieldDecorator(fieldKey, { ...getFieldDecoratorOption, valuePropName: 'checked' })(
                <Select disabled={disabled} defaultValue={fieldValue} mode={mode}>{optionList}</Select>,
              )}
            </FormItem>
          )
        })()
      case 'object':
        return (() => {
          let objectPanelItem = this.renderProperties(fieldKey, propConfig, fieldValue, false, level + 1)
          return (
            <div key={fieldKey} className={classNames(styles['m-collapse'], `level-${level}`)} >
              {objectPanelItem}
            </div>
          )
        })()
      case 'arrayOf':
        return (() => {
          if (!_.isArray(fieldValue)) {
            fieldValue = []
          }

          let propertyValueList: Array<dynamicObject> = fieldValue
          let index = 0
          let itemList = []
          for (let propertyValue of propertyValueList) {
            let clonePropConfig = _.cloneDeep(propConfig)
            if (_.isFunction(propConfig.arrayItemProperty)) { // 如果propConfig.arrayItemProperty为函数, 则说明列每一项配置是动态获取
              clonePropConfig.properties = propConfig.arrayItemProperty(index, propertyValue, fieldValue)
            }

            // 数组元素每一项的title都应该不一样, 所以这里需要hack掉
            clonePropConfig.title = `[${index}]`
            let childFieldKey = `${fieldKey}[${index}]`
            let item = this.renderProperties(childFieldKey, clonePropConfig, propertyValue, true, level + 1)
            itemList.push(item)
            index++
          }

          return (
            <Collapse
              bordered={false}
              className={classNames(styles['m-collapse'], `level-${level}`)}
              defaultActiveKey={[`${fieldKey}`]}
              key={fieldKey}
            >
              <Panel key={fieldKey} header={labelItem} forceRender className={classNames(styles['m-collapse'], `level-${level}`)} >
                {itemList}
                <Button type="link" onClick={() => {
                  // 生成默认元素值
                  let defaultItemValue = this.getDefaultArrayItem(propConfig.properties)
                  let currentParentValue = this.props.form.getFieldValue(fieldKey) || []
                  // 执行添加操作, 添加到该元素之前
                  let newParentValue = defaultItemValue ? [
                    ...currentParentValue, defaultItemValue,
                  ] : currentParentValue
                  this.props.updatePageConfig(fieldKey, newParentValue)
                  console.info('add success')
                }}>添加选项</Button>
              </Panel>
            </Collapse>
          )
        })()
      case 'json':
      case 'json-inline':
      default:
        return (() => {
          let formItemLayout: any = {
            labelCol: propConfig.labelCol || {
              xs: { span: 24 },
              sm: { span: 24 },
            },
            wrapperCol: propConfig.wrapperCol || {
              xs: { span: 24, offset: 0 },
              sm: { span: 24, offset: 0 },
            }
          }


          let $JsonEditor: any = {}
          function jsonValidator(rule: any, value: any, cb: Function) {
            if ($JsonEditor.errorMessage) {
              return cb($JsonEditor.errorMessage)
            }
            cb()
          }

          this.jsonFields[fieldKey] = 1
          return (
            <FormItem key={`${fieldKey}_${dataPageConfigPath}_${dataType}`} extra={desc} label={labelItem} showTooltip={showTooltip} propConfig={propConfig} formItemLayout={formItemLayout}>
              {getFieldDecorator(fieldKey, {
                initialValue: fieldValue === undefined ? propConfig.defaultValue : fieldValue,
                rules: [
                  {
                    validator: jsonValidator
                  }
                ]
              })(<JsonEditor disabled={disabled} height={propConfig.height} getRef={c => $JsonEditor = c} />)}
            </FormItem>
          )
        })()
    }
  }

  render() {
    const { formData } = this.props
    if (_.isPlainObject(formData)) {
      return <Form className={styles['the-form-guiEditor']}>{this.renderFormContent(formData)}</Form>
    }
    return null
  }
}

const WrapperForm = Form.create<Props>({
  name: 'form',
  mapPropsToFields(props) {
    const { formData } = props
    let result: dynamicObject = {}
    if (_.isPlainObject(formData)) {
      for (let key in formData) {
        _.set(result, key, Form.createFormField({ value: formData[key] }))
      }
    }
    return result
  },
  onValuesChange(props, changeValues: dynamicObject, allValues: dynamicObject) {
    const { onChange } = props
    onChange(allValues)
  }
})(TheFormEditor)

export default connect(({ guiEditor }: ConnectState) => ({
  pageId: guiEditor.pageId,
  pageConfig: guiEditor.pageConfig,
  selectedComponentData: guiEditor.selectedComponentData,
  activeTab: guiEditor.activeTab,
}))(WrapperForm)
