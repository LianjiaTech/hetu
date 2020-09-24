/* eslint-disable max-params */
import { TreeSelect } from 'antd'
import _, { get, isFunction } from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import request from '~/utils/request'
import {
  HtSelectTreeProps,
  HtSelectTreeState,
  TreeNodeDataProps,
  TreeNodeProps,
} from './interface'

const TreeNode = TreeSelect.TreeNode

// 当数据量很大时，会有加载缓慢，性能受到影响
// https://github.com/react-component/tree-select/issues/64
const defaultState = {
  treeData: undefined,
  expandedKeys: [],
}

@observer
export default class HtSelectTree extends Component<
  HtSelectTreeProps,
  HtSelectTreeState
> {
  static displayName = 'HtSelectTree'

  static defaultProps = {
    treeNodeFilterProp: 'title',
    treeData: [],
    showSearch: false,
    disabled: false,
    treeCheckable: true,
    dropdownStyle: {
      maxHeight: '400px',
    },
    labelField: 'label',
    valueField: 'value',
    showCheckedStrategy: 'SHOW_PARENT',
    optionsSourceType: 'all',
    splitTag: '>>>',
  }

  state = defaultState

  async componentDidMount() {
    const { optionsSourceType, searchConfigs = [] } = this.props
    if (optionsSourceType === 'dependencies') {
      this.setState({ treeData: this.props.treeData })
    } else {
      if (searchConfigs.length) {
        const data = (await this.requestData()) || []
        if (data.length) {
          const treeData = (this.state.treeData || []).concat(data)
          this.setState({ treeData })
        }
      }
    }
  }

  // 请求数据
  requestData = async (key = '', level = 0): Promise<any> => {
    const { searchConfigs = [] } = this.props

    // if (!_.isArray(searchConfigs)) return false

    // 多个配置则每个对应一个层级,只有一个则是通用接口
    let config = searchConfigs[level] || searchConfigs[0]
    if (!_.isPlainObject(config)) {
      console.error(`config 格式错误: ${JSON.stringify(config)}`)
      return false
    }

    if (!_.isPlainObject(config)) {
      console.error(
        `${key} 对应的 ${level} 级请求配置不存在, searchConfigs:${JSON.stringify(
          searchConfigs
        )}`
      )
      return false
    }

    const {
      url,
      params,
      searchField = 'key',
      transform,
      ...otherConfig
    } = config

    const res = await request.get(
      url,
      { ...params, [searchField]: key },
      otherConfig
    )

    let result = get(res, 'data', [])

    if (isFunction(transform)) {
      result = transform(result)
    }

    return result
  }

  // 加载数据
  onLoadData = async (selectTreeNode: React.Component<TreeNodeProps>) => {
    const { nodePath, splitTag } = this.props
    // @ts-ignore
    const { value, pos, dataRef } = selectTreeNode.props
    const level = pos.split('-').length - 1

    // 请求时拿最后一节点ID请求
    const path = value.split(splitTag)
    const val = path[path.length - 1]

    const data = (await this.requestData(val, level)) || []
    if (data.length) {
      const treeData = this.state.treeData
      dataRef.children = nodePath
        ? data.map((item: any) => ({
            ...item,
            value: `${value}${splitTag}${item.value}`,
          }))
        : data
      this.setState({ treeData })
    }

    return true
  }

  onTreeExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys,
    })
  }

  // 渲染子组件
  renderTreeNodes = (data?: TreeNodeDataProps[]) => {
    return (
      _.isArray(data) &&
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode
              key={item.key || item.value}
              {..._.omit(item, 'children')}
              title={item.title}
              dataRef={item}
            >
              {this.renderTreeNodes(item.children as TreeNodeDataProps[])}
            </TreeNode>
          )
        }

        return (
          <TreeNode key={item.key || item.value} {...item} dataRef={item} />
        )
      })
    )
  }

  onChange = (value: any[]) => {
    const { labelField, valueField, treeCheckable, onChange } = this.props
    let _value

    if (!treeCheckable) {
      // 单选
      if (!_.isObject(value)) {
        throw new Error(`格式错误: value is not a string`)
      }
      // @ts-ignore
      const { label, value: v } = value
      _value = {
        [labelField]: label,
        [valueField]: v,
      }
      // @ts-ignore
      return onChange([_value])
    }

    // 多选
    if (!_.isArray(value)) {
      throw new Error(`格式错误: value is not an array`)
    }
    _value = value.map(({ label, value }) => ({
      [labelField]: label,
      [valueField]: value,
    }))
    return onChange(_value)
  }

  render() {
    const {
      labelField,
      valueField,
      value,
      onChange,
      disabled,
      treeCheckable,
      showCheckedStrategy,
      // @ts-ignore
      treeData,
      placeholder,
      showSearch,
      searchConfigs = [],
      pagestate,
      optionsSourceType,
      ...otherProps
    } = this.props

    // 转化为label是为了回显，treeNodeLabelProp属性在回显时失效
    // @ts-ignore
    let ret = (value || []).map((item: any) => ({
      ...item,
      label: item[labelField],
      // [labelField]: item.label,
    }))

    return (
      <TreeSelect
        showCheckedStrategy={showCheckedStrategy}
        value={treeCheckable ? ret : ret[0]}
        disabled={disabled}
        treeCheckable={treeCheckable}
        placeholder={placeholder}
        showSearch={showSearch}
        labelInValue
        treeNodeLabelProp={labelField}
        onChange={this.onChange}
        treeExpandedKeys={this.state.expandedKeys}
        loadData={
          optionsSourceType === 'async' && searchConfigs.length
            ? this.onLoadData
            : undefined
        }
        onTreeExpand={this.onTreeExpand}
        {...otherProps}
      >
        {this.renderTreeNodes(this.state.treeData)}
      </TreeSelect>
    )
  }
}
