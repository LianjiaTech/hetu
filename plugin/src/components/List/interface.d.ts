import { HtCardProps } from '~/components/Card/interface'
import { HtFormProps } from '~/components/Form/interface'
import { TableComponentProps } from '~/components/Table/interfacce'
import { BaseProps } from '~/types'

export interface ListComponentProps
  extends BaseProps,
    HtFormProps,
    TableComponentProps,
    HtCardProps {
  pageSize: number
  isPagination: boolean
  pageSizeOptions: string[]
  scrollWidth?: number
  // 请求响应字段映射
  fieldMap: {
    pageNumKey: string
    pageSizeKey: string
    listKey: string
    totalKey: string
  }
}

export interface ListComponentState<T = any> {
  isPageLoading: boolean
}
