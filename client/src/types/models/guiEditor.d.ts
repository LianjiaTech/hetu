import { pageConfig } from './global'
import { selectedComponentData, reac, DataComponentType } from './editor.d'

export { selectedComponentData, reac, DataComponentType }

export type activeTab = 'code' | 'base'

export interface ContainerData {
  type: string
  path: string
}

export interface guiEditorState {
  // iframe 查询参数
  query: null
  // 页面id
  pageId: null
  // 草稿id
  draftId: null
  // 项目id
  project: null
  // 页面配置
  pageConfig?: pageConfig
  // 编译结果
  pagestate?: any
  hoverComponentData?: selectedComponentData
  selectedComponentData?: selectedComponentData
  insertComponentData?: selectedComponentData
  containerData: ContainerData
  isIframeLoading: boolean
  // 是否展示占位符元素(用于添加组件)
  isInsertItemMode: boolean
  // 插入的ComponentData
  // 是否处于拖拽中
  isDragging: boolean
  // 右侧激活面板,默认为可视化编辑器
  activeTab: activeTab
  // 是否锁屏
  isLockIframe: true
}
