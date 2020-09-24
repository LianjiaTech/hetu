import { cloneDeep, isFunction, isPlainObject } from 'lodash'
import md5 from 'md5'
import React from 'react'
import { JsonSchema } from '~/types'
import {
  HtTableEditorProps,
  HtTableEditorState,
  TableColumn,
} from './interface'

interface ColumnItem extends JsonSchema.DynamicObject {
  key?: string
  children?: ColumnItem[]
}

export class Columns extends React.Component<
  HtTableEditorProps,
  HtTableEditorState
> {
  dataSource: JsonSchema.DynamicObject[] = []

  handleChange(v: ColumnItem[]) {
    const { onChange } = this.props
    isFunction(onChange) && onChange(v)
  }

  // 查询
  get(parentKey: string) {
    let result = this.dataSource.find(v => v.key === parentKey)
    return result ? cloneDeep(result) : result
  }

  // 查询index
  getIndex(parentKey: string) {
    return this.dataSource.findIndex(v => v.key === parentKey)
  }

  // 添加
  add(record: ColumnItem) {
    this.dataSource = [...this.dataSource, record]
    this.handleChange(this.dataSource)
  }

  // 更新
  update(parentKey: string, data: ColumnItem) {
    let index = this.getIndex(parentKey)
    if (index === -1) {
      throw new Error(`parentKey:${parentKey} 不存在`)
    }
    this.dataSource[index] = data

    this.handleChange(this.dataSource)
  }

  // 删除
  delete(parentKey: string) {
    let index = this.getIndex(parentKey)
    if (index === -1) {
      throw new Error(`parentKey:${parentKey} 不存在`)
    }

    this.dataSource.splice(index, 1)

    this.handleChange(this.dataSource)
  }

  // 添加子节点
  addChild(parentKey: string, child: ColumnItem) {
    let record = this.get(parentKey)
    let index = this.getIndex(parentKey)
    if (!record) {
      throw new Error(`parentKey:${parentKey} 不存在`)
    }

    if (Array.isArray(record.children)) {
      record.children.push(child)
    } else {
      record.children = [child]
    }
    this.dataSource[index] = record
    this.handleChange(this.dataSource)
  }

  // 删除子节点
  deleteChild(parentKey: string, childKey: string) {
    let record = this.get(parentKey)
    let index = this.getIndex(parentKey)
    if (!record) {
      throw new Error(`parentKey:${parentKey} 不存在`)
    }
    if (Array.isArray(record.children)) {
      let childIndex = record.children.findIndex(v => v.key === childKey)
      record.children.splice(childIndex, 1)
    }

    this.dataSource[index] = record
    this.handleChange(this.dataSource)
  }
  // 更新子节点
  updateChild(parentKey: string, childKey: string, child: ColumnItem) {
    let record = this.get(parentKey)
    let index = this.getIndex(parentKey)
    if (!record) {
      throw new Error(`parentKey:${parentKey} 不存在`)
    }
    if (!Array.isArray(record.children)) {
      throw new Error(`record.children:${record.children} is not an array`)
    }

    let childIndex = record.children.findIndex(v => v.key === childKey)
    if (childIndex === -1) {
      throw new Error(`childKey:${childKey} 不存在`)
    }

    record.children[childIndex] = child
    this.dataSource[index] = record
    this.handleChange(this.dataSource)
  }
}

export function addUniqueKey(obj: JsonSchema.DynamicObject): string {
  return md5(JSON.stringify(obj))
}

/**
 * 给数组添加唯一的key
 *
 * @param arr
 * @param path
 */
export function addKeyToArray(
  arr: JsonSchema.DynamicObject[],
  parentKey = ''
): ColumnItem[] {
  if (!Array.isArray(arr)) return []
  return arr
    .filter(v => isPlainObject(v))
    .map((item, i) => {
      let key = item.key
        ? item.key
        : addUniqueKey({
            ...item,
            __index__: i,
            parentKey,
          })
      if (item.children) {
        let children = addKeyToArray(item.children, key)
        return {
          ...item,
          key,
          parentKey,
          children,
        }
      }

      return {
        ...item,
        parentKey,
        key,
      }
    })
}

/**
 * 获取Fields配置
 *
 * @param columns
 */
export function getFormFields(
  columns: TableColumn[]
): JsonSchema.HtFieldBaseProps[] {
  if (Array.isArray(columns)) {
    return columns
      .filter(v => isPlainObject(v))
      .map(column => {
        const {
          title,
          dataIndex,
          fixed,
          align,
          width,
          render,
          ...rest
        } = column
        let result: JsonSchema.HtFieldBaseProps = {
          field: dataIndex ? dataIndex : '',
          title,
          ...rest,
        }
        return result
      })
  }

  return []
}
