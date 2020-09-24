
export type DataComponentType = any
export interface reac {
  top: number
  left: number
  width: number
  height: number
}

export interface dataPropsConfig {
  moveLeft: {
    isHidden: boolean
  }
  moveRight: {
    isHidden: boolean
  }
  delete: {
    isHidden: boolean
  }
  clone: {
    isHidden: boolean
  }
  drag: {
    isHidden: boolean
  }
}

export interface selectedComponentData {
  parentNode: Node
  reac: reac
  dataPageConfigPath: string
  dataComponentType: DataComponentType
}

export type activeTab = 'code' | 'base'

export interface editorState {
  // iframe 查询参数
  query: null
  // 页面id
  pageId?: string
  // 草稿id
  draftId?: string
  // 项目id
  project?: string
  // 页面配置
  pageConfig?: dynamicObject
  // 编译结果
  pagestate?: dynamicObject
  hoverComponentData?: selectedComponentData
  selectedComponentData?: selectedComponentData
  isIframeLoading: boolean
  // 右侧激活等面板
  activeTab: activeTab
  // 是否锁屏
  isLockIframe: boolean
}
