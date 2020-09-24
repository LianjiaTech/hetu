import { Button, Icon, Popconfirm, Table } from 'antd'
import _, {
  get,
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isPlainObject,
  isString,
} from 'lodash'
import { observer } from 'mobx-react'
// import { DragDropContextProvider } from 'react-dnd'
// import HTML5Backend from 'react-dnd-html5-backend'
import React from 'react'
import { JsonSchema } from '~/types'
import { getLabelByValue } from '~/utils'
import './index.less'
import { ActionColumn, TableColumn } from './interface'
import { addKeyToArray, Columns, getFormFields } from './_utils'

// 弹框表单
const tableEditModalAlias = '$$TableEditorForm'

@observer
class HtTableEditor extends Columns {
  static displayName = 'HtTableEditor'

  static defaultProps = {
    onChange: () => {},
    canAddChildren: false,
    canAdd: true,
    modalConfig: {
      alias: tableEditModalAlias,
      width: 600,
    },
    disabled: false,
    canDelete: true,
  }

  state = {
    clickedRow: {},
    isAddChildren: false,
    isEditChildren: false,
    alias: get(this.props, 'modalConfig.alias', tableEditModalAlias),
    modalWidth: get(this.props, 'modalConfig.width', 600),
  }

  HtModalEditForm?: {
    toggleModalVisible: (v: boolean) => Promise<void>
  }

  HtModalAddForm?: {
    toggleModalVisible: (v: boolean) => Promise<void>
  }

  // 点击编辑按钮时
  onEditBtnClick = async (
    record: JsonSchema.DynamicObject,
    isEditChildren?: boolean
  ) => {
    const { setStoreState } = this.props.pagestate
    if (isFunction(setStoreState)) {
      const alias = this.state.alias
      setStoreState({
        [alias]: record,
      })

      this.setState(
        {
          clickedRow: record,
          isAddChildren: false,
          isEditChildren,
        },
        () => this.toggleModalEditForm(true)
      )
    }
  }

  // 点击添加按钮时
  onAddBtnClick = () => {
    this.setState({
      isAddChildren: false,
    })
    this.toggleModalAddForm(true)
  }

  // 点击添加子元素按钮时
  onAddChildrenBtnClick = async (record: JsonSchema.DynamicObject) => {
    this.setState(
      {
        clickedRow: record,
        isAddChildren: true,
      },
      () => this.toggleModalAddForm(true)
    )
  }

  // 编辑弹框, 点击提交时
  onEditModalOk = async (modalFormData: JsonSchema.DynamicObject) => {
    await this.toggleModalEditForm(false)
    const { isEditChildren, clickedRow } = this.state
    switch (isEditChildren) {
      case true:
        // @ts-ignore
        this.updateChild(clickedRow.parentKey, clickedRow.key, modalFormData)
        break
      default:
        // @ts-ignore
        this.update(clickedRow.key, {
          ...modalFormData,
          // @ts-ignore
          children: clickedRow.children,
        })
    }
  }

  // 创建数据弹框, 点击提交时
  onAddModalOk = async (formData: JsonSchema.DynamicObject) => {
    await this.toggleModalEditForm(false)
    const { isAddChildren, clickedRow } = this.state

    if (isAddChildren) {
      // 添加二级节点
      // @ts-ignore
      return this.addChild(clickedRow.key, formData)
    }

    // 添加一级节点
    this.add(formData)
  }

  toggleModalEditForm = async (visible: boolean) => {
    const toggleModalVisible = get(this.HtModalEditForm, 'toggleModalVisible')
    if (isFunction(toggleModalVisible)) {
      await toggleModalVisible(visible)
    }
  }

  /**
   * 切换添加弹框可见状态
   */
  toggleModalAddForm = (visible: boolean) => {
    const toggleModalVisible = get(this.HtModalAddForm, 'toggleModalVisible')
    if (isFunction(toggleModalVisible)) {
      toggleModalVisible(visible)
    }
  }

  /**
   * 渲染弹框表单
   */
  renderEditForm = (formFields: JsonSchema.HtFieldBaseProps[]) => {
    const { alias, modalWidth, clickedRow, isEditChildren } = this.state
    const { pagestate } = this.props

    if (isPlainObject(clickedRow)) {
      const modalFormProps = {
        width: modalWidth,
        fields: formFields,
        alias,
        title: isEditChildren ? '编辑子节点' : '编辑',
        pagestate,
        getRef: (c: any) => {
          this.HtModalEditForm = c
        },
        sendFormData: (v: JsonSchema.DynamicObject) => this.onEditModalOk(v),
        onSuccessAction: '',
      }
      const HtModalForm = _.get(window.$$componentMap, 'HtModalForm')

      return React.createElement(HtModalForm, modalFormProps)
    }

    return null
  }

  /**
   * 渲染新增数据弹框
   */
  renderAddForm = (formFields: JsonSchema.HtFieldBaseProps[]) => {
    const { isAddChildren, alias, modalWidth } = this.state
    const { pagestate } = this.props

    const modalFormProps = {
      width: modalWidth,
      fields: formFields,
      alias,
      title: isAddChildren ? '添加子节点' : '添加',
      pagestate,
      getRef: (c: any) => {
        this.HtModalAddForm = c
      },
      sendFormData: (v: JsonSchema.DynamicObject) => this.onAddModalOk(v),
      onSuccessAction: '',
    }
    const HtModalForm = _.get(window.$$componentMap, 'HtModalForm')

    return React.createElement(HtModalForm, modalFormProps)
  }

  /**
   * 渲染表格列
   */
  renderColumns = (columns: TableColumn[], actionColumn?: ActionColumn) => {
    const { canAddChildren, disabled, canDelete } = this.props

    const extraColumn = {
      title: '操作',
      ...actionColumn,
      render: (_text: any, record: JsonSchema.DynamicObject) => {
        if (disabled) {
          return null
        }
        const isChildrenRow = !!record.parentKey
        // 渲染子节点
        if (isChildrenRow) {
          return (
            <div
              style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <Icon
                type="edit"
                className="table-row-link"
                onClick={() => this.onEditBtnClick(record, isChildrenRow)}
              />
              {canDelete && (
                <Icon
                  type="delete"
                  className="table-row-link danger"
                  onClick={() => this.deleteChild(record.parentKey, record.key)}
                />
              )}
            </div>
          )
        }
        return (
          <div
            style={{ whiteSpace: 'nowrap', textAlign: 'right' }}
            onClick={e => e.stopPropagation()}
          >
            {canAddChildren && (
              <Icon
                type="plus"
                className="table-row-link"
                onClick={() => this.onAddChildrenBtnClick(record)}
              />
            )}
            <Icon
              type="edit"
              className="table-row-link"
              onClick={() => this.onEditBtnClick(record)}
            />
            {canDelete && (
              <Popconfirm
                title="确认删除"
                onConfirm={() => this.delete(record.key)}
              >
                <Icon type="delete" className="table-row-link danger" />
              </Popconfirm>
            )}
          </div>
        )
      },
    }

    const _columns = columns
      .map(column => {
        let render = (text: any) => {
          if (
            isString(text) ||
            isNumber(text) ||
            isBoolean(text) ||
            isArray(text)
          ) {
            if (column.type === 'SelectTrees') {
              // @ts-ignore
              const { labelField } = column
              // @ts-ignore
              return (text || []).map((item: any) => item[labelField]).join(',')
            }
            // 如果为基本类型
            let type = column.type || 'Input'
            if (
              ['Select', 'SelectMultiple', 'Radio', 'Checkbox'].indexOf(
                type
              ) !== -1
            ) {
              let {
                options,
                // @ts-ignore
                optionsSourceType,
                // @ts-ignore
                optionsDependencies,
                // @ts-ignore
                labelField,
                // @ts-ignore
                valueField,
              } = column
              let _options = options
              switch (optionsSourceType) {
                case 'static':
                  _options = options
                  break
                case 'dependencies':
                  _options = optionsDependencies
                  break
              }
              return getLabelByValue(text, _options, labelField, valueField)
            }
            return text
          }

          let other
          try {
            other = JSON.stringify(text)
          } catch (e) {
            console.warn(e)
          }
          return other
        }

        return {
          render,
          ...column,
        }
      })
      .filter(v => v.width !== 0 && v.width !== '0')

    return [..._columns, extraColumn]
  }

  render() {
    let {
      disabled,
      canAdd,
      canAddChildren,
      canDelete,
      value,
      onChange,
      columns = [],
      actionColumn,
      scroll,
      pagestate,
      ...otherProps
    } = this.props

    let _dataSource: JsonSchema.DynamicObject[] = []
    // 给数据加上key/序号
    if (Array.isArray(value)) {
      _dataSource = addKeyToArray(value)
    }

    this.dataSource = _dataSource

    const tableProps = {
      ...otherProps,
      scroll,
      dataSource: _dataSource,
      rowKey: (record: JsonSchema.DynamicObject) => record.key,
      columns: this.renderColumns(columns, actionColumn),
      bordered: true,
      defaultExpandAllRows: true,
      expandIcon: undefined,
      pagination: false as false,
      rowClassName: (record: JsonSchema.DynamicObject, index: number) =>
        record.parentKey ? `__children__${index}` : `__parent__${index}`,
    }

    const formFields = getFormFields(columns)

    return (
      <div
        className="ht-table-editor"
        data-pageconfig-path={`${this.props['data-pageconfig-path']}`}
      >
        {/* 新建弹框 */}
        {canAdd && (
          <Button
            disabled={disabled}
            onClick={this.onAddBtnClick}
            size="small"
            style={{ marginBottom: 16 }}
          >
            添加
          </Button>
        )}
        {canAdd && this.renderAddForm(formFields)}

        {/* <DragDropContextProvider backend={HTML5Backend}> */}
        {/* 表格 */}
        <Table
          className={_dataSource.length > 0 ? '' : 'ht-tables-editor'}
          {...tableProps}
        />
        {/* </DragDropContextProvider> */}

        {/* 编辑弹框 */}
        {this.renderEditForm(formFields)}
      </div>
    )
  }
}

export default HtTableEditor
