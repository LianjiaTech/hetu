declare module '*.css'
declare module '*.less'
declare module '*.module.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module 'react-css-modules'
declare module 'dva-loading'

interface Window {
  ENV: 'dev' | 'test' | 'prod'
  // 父级iframe的名称
  $$iframeParentName?: string
  $$isEditor?: boolean
  $$receiveIframeData?: (v: { type: string; data: dynamicObject }) => void
  $$changeIframePageConfig?: (v: dynamicObject) => void
  $$PUBLIC_URL?: string
  Hetu: any
  __POWERED_BY_QIANKUN__: boolean
}

declare interface dynamicObject {
  [key: string]: any
}

declare type dvaDispatch = (v: { type: string; payload: dynamicObject }) => any | Promise<any>

declare type BaseComponent = {
  pagestate: any
}
