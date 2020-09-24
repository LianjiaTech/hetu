import { ColProps } from 'antd/es/col'
import { ChartProps } from 'bizcharts'
import { BaseProps } from '~/types/index'

/**
 * 配置数据比例尺，该配置会影响数据在图表中的展示方式。
 */
interface ChartScale {
  [key: string]: {
    type: 'identity' | 'linear' | 'cat' | 'time' | 'timeCat' | 'log' | 'pow' // 指定数据类型
    alias: string // 数据字段的别名，会影响到轴的标题内容
    formatter: () => {} // 格式化文本内容，会影响到轴的label格式
    range: [number, number] // 输出数据的范围，默认[0, 1]，格式为 [min, max]，min 和 max 均为 0 至 1 范围的数据。
    tickCount: number // 设置坐标轴上刻度点的个数
    ticks: [] // 用于指定坐标轴上刻度点的文本信息，当用户设置了 ticks 就会按照 ticks 的个数和文本来显示
    sync: boolean // 当 chart 存在不同数据源的 view 时，用于统一相同数据属性的值域范围
  }
}

/**
 * Chart 配置
 */
export interface BizChartProps extends ChartProps, BaseProps {
  title?: string
  // 高度
  height: number
  // 配置数据比例尺，该配置会影响数据在图表中的展示方式。
  scale?: ChartScale
  // 边距
  padding: [number, number, number, number]
  // 过滤数据
  filter?: [string, Function]
  // Chart 数据
  data: any
  // 布局设置
  colProps?: ColProps
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BizChartState {}
