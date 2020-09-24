import React, { Component } from 'react'

import { Table, Button, Popconfirm, Form } from 'antd'

import EditableContext from './context'

import EditableCell from './EditableCell'

import { HtEditableTableProps, HtEditableTableState } from './interface'
import { HtEditableCellProps } from './EditableCell/interface'

import { isArray, get, set, cloneDeep, isEqual, omit } from 'lodash'
import { FormComponentProps } from 'antd/es/form'
import { JsonSchema } from '~/types'

import './index.less'

interface EditableRowProps extends FormComponentProps {
  index: number
}

const EditableRow = ({
  form,
  index,
  wrappedComponentRef,
  ...props
}: EditableRowProps) => (
  <EditableContext.Provider value={{ form }}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create<EditableRowProps>()(EditableRow)

// 给dataSource添加key
const addkeyToDataSource = (arr: JsonSchema.DynamicObject[]) => {
  if (!isArray(arr)) {
    if (arr) {
      console.error(`arr must be an array, but got ${JSON.stringify(arr)}`)
    }
    return []
  }
  return arr.map((item, index) => {
    item.key = item.key ? item.key : index + Math.random()
    return item
  })
}

// 子列的前缀
const childrenRowPrefix = '__children__'
const childrenRowReg = new RegExp('^' + childrenRowPrefix)
const isChildrenRow = (text: string) => childrenRowReg.test(text)

const getMapRowMap = (v: JsonSchema.DynamicObject[]) => {
  let rowKeyMap: JsonSchema.DynamicObject = {}
  function generateMap(sourceData: JsonSchema.DynamicObject[], path = '') {
    if (isArray(sourceData)) {
      sourceData.forEach((item, i) => {
        if (rowKeyMap[item.key]) {
          throw new TypeError(
            `the key must be unique, but got same key: ${item.key}`
          )
        }
        rowKeyMap[item.key] = {
          parentPath: path,
          path: path ? `${path}.[${i}]` : `[${i}]`,
          value: item,
        }
        if (item.children) {
          generateMap(
            item.children,
            path ? `${path}.[${i}].children` : `[${i}].children`
          )
        }
      })
    }
  }
  generateMap(v)
  return rowKeyMap
}

export default class HtEditableTable extends Component<
  HtEditableTableProps,
  HtEditableTableState
> {
  static defaultProps: Partial<HtEditableTableProps> = {
    canAdd: true,
    canAddChildren: false,
  }

  static getDerivedStateFromProps(
    nextProps: HtEditableTableProps,
    prevState: HtEditableTableState
  ) {
    if (!isEqual(nextProps.value, prevState.dataSource)) {
      const rowKeyMap = getMapRowMap(addkeyToDataSource(nextProps.value))
      return {
        ...prevState,
        rowKeyMap,
        dataSource: nextProps.value,
      }
    }

    return prevState
  }

  state: HtEditableTableState = {
    rowKeyMap: {},
    dataSource: [],
  }

  getDefaultAddItem = (prefix = '') => {
    const { columns } = this.props

    let newData: JsonSchema.DynamicObject = {
      key: prefix + Math.random(),
    }
    columns.forEach(column => {
      newData[column.dataIndex] = ''
    })

    return newData
  }

  handleDelete = (key: string) => {
    const { dataSource } = this.state
    const { onChange } = this.props

    const newDataSource = dataSource.filter(item => item.key !== key)

    onChange(newDataSource)
  }

  handleDeleteChildren = (key: string) => {
    const { dataSource } = this.state
    const { onChange } = this.props
    let parentPath = get(this.state, ['rowKeyMap', key, 'parentPath'])

    if (!parentPath) {
      throw new TypeError('parentPath 不存在')
    }

    const oldChildren = get(
      dataSource,
      parentPath,
      []
    ) as JsonSchema.DynamicObject[]

    const newChildren = oldChildren.filter(item => item.key !== key)

    let newDataSource = cloneDeep(dataSource)
    set(newDataSource, parentPath, newChildren)

    onChange(newDataSource)
  }

  handleAdd = () => {
    const { onChange } = this.props

    const defaultItem = this.getDefaultAddItem()

    onChange([...this.state.dataSource, defaultItem])
  }

  // 添加子元素
  handeAddChildren = (key: string) => {
    const { dataSource } = this.state
    const { onChange } = this.props

    const defaultItem = this.getDefaultAddItem(childrenRowPrefix)

    const index = dataSource.findIndex(item => key === item.key)

    const oldChildren = get(dataSource, [index, 'children'], [])

    const children = [...oldChildren, defaultItem]

    let newDataSource = cloneDeep(dataSource)
    set(newDataSource, [index, 'children'], children)

    onChange(newDataSource)
  }

  handleSave = (row: JsonSchema.DynamicObject) => {
    const { dataSource } = this.state
    const { onChange } = this.props

    let rowMap = get(this.state, ['rowKeyMap', row.key])
    const { value: oldRow, path } = rowMap
    let newData = { ...oldRow, ...row }
    let newDataSource = cloneDeep(dataSource)
    set(newDataSource, path, newData)
    onChange(newDataSource)
  }

  render() {
    const { dataSource } = this.state
    const { scroll, columns: columnsConfig, canAddChildren } = this.props

    const getEditableCellProps = (
      dataIndex: string,
      arr: JsonSchema.DynamicObject[]
    ) => {
      let result = {}
      if (isArray(arr)) {
        result = columnsConfig.find(item => item.dataIndex === dataIndex) || {}
      }
      return omit(result, ['title', 'dataIndex', 'width', 'fixed'])
    }

    const components = {
      body: {
        row: EditableFormRow,
        cell: (props: HtEditableCellProps) => (
          <EditableCell
            {...getEditableCellProps(props.dataIndex, columnsConfig)}
            {...props}
          />
        ),
      },
    }
    let columns: JsonSchema.DynamicObject[] = cloneDeep(columnsConfig).map(
      col => {
        const { editable = true, dataIndex, title } = col
        if (!editable) {
          return col
        }
        return {
          ...col,
          onCell: (record: JsonSchema.DynamicObject) => ({
            record,
            editable,
            dataIndex,
            title,
            handleSave: this.handleSave,
          }),
        }
      }
    )

    const operationColumn = {
      title: '操作',
      dataIndex: 'operation',
      className: 'ht-cloumn-operation',
      render: (_text: any, record: JsonSchema.DynamicObject) => {
        if (isChildrenRow(record.key)) {
          return (
            <Button
              type="link"
              className="danger"
              onClick={() => this.handleDeleteChildren(record.key)}
            >
              删除
            </Button>
          )
        }
        return (
          <>
            {canAddChildren && (
              <Button
                type="link"
                onClick={() => this.handeAddChildren(record.key)}
              >
                添加
              </Button>
            )}
            <Popconfirm
              title="确认删除"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <Button type="link" className="danger">
                删除
              </Button>
            </Popconfirm>
          </>
        )
      },
    }

    columns.push(operationColumn)

    return (
      <div className="ht-editable-table">
        <Button
          onClick={this.handleAdd}
          size="small"
          style={{ marginBottom: 16 }}
        >
          添加
        </Button>
        <Table
          pagination={false}
          expandIcon={undefined}
          defaultExpandAllRows
          components={components}
          rowClassName={() => 'ht-editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          scroll={scroll}
        />
      </div>
    )
  }
}
