import { ConnectState, ConnectProps } from '~/types/models/connect'
import { IPageConfig } from '~/types/models/global'
import { selectedComponentData, reac } from '~/types/models/guiEditor'
import { ConnectDragSource } from 'react-dnd'

export { ConnectState, reac, selectedComponentData, IPageConfig }

export interface CollectedProps {
  connectDragSource: ConnectDragSource
}

export interface DragObject {
  index: number
}

export interface Props extends ConnectProps, CollectedProps {
  type: string

  index: number

  isDragging: boolean

  pageConfig: IPageConfig
  selectedComponentData: selectedComponentData

  onChange: (newIndex: number) => void
  onSort: (dragIndex: number, targetIndex: number) => Promise<any>
}
export interface State {}
