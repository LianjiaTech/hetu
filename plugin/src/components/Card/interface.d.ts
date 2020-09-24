import { BaseProps } from '~/types'

export type CardType = 'default' | 'primary' | 'plain'

interface RenderParams {
  Extra?: React.ReactNode
}

export interface HtCardProps extends BaseProps {
  title?: string
  description?: string
  extra?: React.ReactNode[]
  bordered?: boolean
  // 是否渲染为Card
  isCard?: boolean
  /**
   * 为了支持更多到卡片类型, 添加一个cardType属性, 原有到isCard属性继续兼容
   */
  cardType?: CardType
  render?: (v: RenderParams) => React.ReactNode
}
