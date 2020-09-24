import { TabsPosition, TabsType } from 'antd/es/tabs'
import { HtCardProps } from '~/components/Card/interface'
import { BaseProps } from '~/types'

export interface Tab {
  title: string
  value: string
  disabled?: boolean
  // 显示当前第几个子节点, 为空时, 显示全部
  showIndexs: number[]
}

export interface ListComponentProps extends BaseProps, HtCardProps {
  defaultActiveKey?: string
  tabsType?: TabsType
  tabsPosition?: TabsPosition
  tabBarStyle?: object
  tabs: Tab[]
  content: React.ReactNode[]
}

// export interface ListComponentState<T = any> {}
