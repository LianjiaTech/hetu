import { CoordType, GeomAdjustType, GeomType } from 'bizcharts'
import { BizChartProps } from '~/components/BChart/Chart/interface'
import { HtCardProps } from '~/components/Card/interface'
import { HtFormProps } from '~/components/Form/interface'
import { TableComponentProps } from '~/components/Table/interfacce'
import { BaseProps, JsonSchema } from '~/types'

/**
 * 坐标轴配置
 */
interface AxisConfig {
  // 当前坐标轴对应数据源中的字段名(必填)
  name: string
  // 当前坐标轴是否需要可见，默认值true。
  visible: boolean
  // 设置当前坐标轴的摆放位置，可设置的值为top、bottom、left、right
  position: 'top' | 'bottom' | 'left' | 'right'
  // 当前坐标轴标题是否需要显示
  title: boolean
  // 设置坐标轴线的样式
  line: {
    // 线颜色
    stroke: string
    // 填充色
    fill: string
    // 配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
    lineDash: [number, number]
    // 线宽
    lineWidth: number
  }
  // 坐标轴文本距离轴线的距离
  labelOffset: number
}

/**
 * 几何标记组件
 */
interface CoordConfig {
  // 坐标系类型, 可选值有, 'rect 直角坐标系' | 'polar 极坐标系' | 'theta 极坐标系' | 'helix 极坐标系'' .默认为 rect
  // 详情见 https://bizcharts.net/products/bizCharts/api/coord?from=search#api
  type: CoordType
  // 坐标系旋转，angle 表示旋转的度数，单位为角度
  rotate: number
  // 放大、缩小，默认按照坐标系中心放大、缩小。 参数为长度2的数组，第一个值代表 x 方向缩放比例，第二个值代表 y 方向缩放比例。
  scale: [number, number]
  // 镜像, 沿 x 方向镜像或者沿 y 轴方向映射。默认值为：'y'. 如果参赛是个数组，将依次调用.例如['x', 'y'] 则先执行x方向翻转reflect('x') 再执行y方向翻转reflect('y'),以此类推。
  reflect: 'x' | 'y' | ['x', 'y'] | ['y', 'x']
  // 将坐标系 x 轴和 y 轴交换.
  transpose: boolean
  /** **************polar、theta 类型的极坐标系配置******************/
  // 设置半径，值为 0 至 1 的小数
  radius: number
  // 内部极坐标系的半径，[0 - 1]的小数
  innerRadius: number
  // 起始角度（弧度）
  startAngle: number
  // 结束角度（弧度）
  endAngle: number
  /** **************polar、theta 类型的极坐标系配置******************/
}

interface LabelConfig {
  // 指定 label 上显示的文本内容, 例如 ["x*y", (x, y) => `${x}:${y}`]
  content?: [string, Function]
  // 设置文本处于几何图形的哪个位置
  position?: 'top' | 'middle' | 'bottom'
  // 设置文本距离几何图形的距离
  offset: number
}

export interface GeomConfig {
  // 几何标记类型 https://bizcharts.net/products/bizCharts/api/geom#api
  type: GeomType
  // 额外的控制函数 https://bizcharts.net/products/bizCharts/api/geom?from=search#adjust
  // stack: 层叠图 dodge: 分组图 jitter: 扰动图 symmetric: 对称图
  adjust?: GeomAdjustType[]
  // 确定 x 轴和 y 轴的数据字段。例如['x', 'y']
  position?: [string, string]
  // 将数据值映射到图形的颜色上的方法。值为数据字段名
  color?: string
  // 将数据值映射到图形的形状上的方法。值为数据字段名
  shape?: string
  // 几何标记大小
  size?: string
  // 将数据值映射到 Tooltip 上, 默认为false, 不显示
  tooltip?: [string, Function] | false
  // 几何标记上的标注文本组件
  Label?: LabelConfig[]
}

/**
 * 图例配置
 */
interface LegendConfig {
  // 设置图例的显示位置，默认值为 bottom-center
  position: 'bottom' | 'top' | 'left' | 'right'
  // x方向偏移量
  offsetX: number
  // y方向偏移量
  offsetY: number
}

/**
 * 鼠标悬停提示信息
 */
interface TooltipConfig {
  // 标题对应字段
  title: string
  // 格式化 tooltip 的显示内容
  itemTpl: {
    // 标题
    title: string
    // 值
    value: string | number
  }[]
}

// 用于绘制图表的辅助元素, 配置参考 https://bizcharts.net/products/bizCharts/api/guide#position
export interface GuideConfig {
  type:
    | 'Line'
    | 'Image'
    | 'Text'
    | 'Region'
    | 'Html'
    | 'Arc'
    | 'RegionFilter'
    | 'DataMarker'
    | 'DataRegion'
  // 指定 giude 是否绘制在 canvas 最上层。 默认值:false, 即绘制在最下层。
  top?: boolean
  // 指定辅助文本的显示位置
  position?: Object | Function | []
  // 辅助文本的显示内容
  content: string
  // 样式
  style?: JsonSchema.DynamicObject
  // x方向的偏移量
  offsetX?: number
  // y方向的偏移量
  offsetY?: number
}

export interface ViewConfig {
  content: {
    Coord: CoordConfig[]
    Geom: GeomConfig[]
    Axis: AxisConfig[]
    Legend: LegendConfig[]
    Tooltip: TooltipConfig | TooltipConfig[]
    Guide: GuideConfig[]
  }
  scale: any
  data?: any
  alias: string
}

/**
 * chart content
 */
interface ChartContent {
  // 几何标记组件
  Coord: CoordConfig[]
  // 坐标轴配置
  Axis: AxisConfig[]
  // 几何标记
  Geom: GeomConfig[]
  // 图例
  Legend: LegendConfig[]
  // 当鼠标悬停在图表上的某点时, 提示信息
  Tooltip: TooltipConfig
  // 用于绘制图表的辅助元素
  Guide: GuideConfig[]
  // 用于绘制多个不同坐标系的图表
  View: ViewConfig[]
}

export type ChartContentProperties = keyof ChartContent

/**
 * chart配置
 */
export interface ChartConfig extends BizChartProps {
  alias: string
  title: string
  // chart content
  content: ChartContent
  // chart标题后的提示内容
  tooltip?: string
}

export interface TableConfig extends TableComponentProps {
  alias?: string
  pageSize?: number
}

export interface HtChartProps extends BaseProps, HtCardProps {
  /**
   * form配置
   */
  formConfig: HtFormProps

  /**
   * 图表配置
   */
  chartConfig: ChartConfig[]

  /**
   * table配置
   */
  tableConfig?: TableConfig

  // 请求响应挂载到pagestate到字段名
  responseAlias?: string
}

export interface HtChartState<T = any> {
  // 每一页数据量
  pageSize?: number
  // 当前页数
  current: number
  // 总页数
  total?: number
  // 数据
  dataSource?: T[]
  isPageLoading: boolean
}
