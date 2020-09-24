import { TreeNode } from 'antd/es/tree-select'
import { BaseProps, JsonSchema } from '~/types'

export { TreeNode as TreeNodeData }
export type TreeSelectValue = string[] | string[][] | any[]

interface SearchConfigProps {
  url: string
  params?: object
  searchField?: string
  transform?: (v: any) => []
}

export interface HtSelectTreeProps extends BaseProps {
  value: TreeSelectValue
  defaultValue?: TreeSelectValue
  onChange: (value: TreeSelectValue) => void
  disabled?: boolean
  // 是否允许多选
  treeCheckable?: boolean
  placeholder?: string
  showSearch?: boolean
  searchConfigs?: SearchConfigProps[]
  treeNodeFilterProp?: 'title' | 'value'
  labelField: string
  valueField: string
  dropdownStyle?: JsonSchema.DynamicObject
  // 组件初始值, 必须要这个初始值, 否则无法做表单级联
  treeData: JsonSchema.DynamicObject[]
  showCheckedStrategy: 'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD'
  splitTag: string
  nodePath: boolean
  optionsSourceType: 'all' | 'async' | 'dependencies'
}

export declare type TreeNodeDataProps = TreeNode

export interface TreeNodeProps {
  dataRef: TreeNode
}

export interface HtSelectTreeState {
  preTreeData?: TreeNode[]
  treeData?: TreeNode[]
  expandedKeys: string[]
}
