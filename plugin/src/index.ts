// fix: Input.Password ConfigProvider prefixCls not work
import 'antd/lib/input/style/index.css'
// https://github.com/ant-design/ant-design/issues/15260
import 'antd/lib/button/style/index.css'
import 'antd/lib/message/style/index.css'
import 'antd/lib/modal/style/index.css'
import 'antd/lib/notification/style/index.css'
import 'regenerator-runtime/runtime'

export * from './components/editorConfigs'
export * from './components/index'
export * from './templates'
export { Hetu as default } from './Hetu'
export { customRequest } from './utils/request'
