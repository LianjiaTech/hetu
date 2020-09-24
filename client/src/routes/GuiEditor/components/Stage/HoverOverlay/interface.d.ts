import React from 'react'
import { ConnectState, ConnectProps } from '~/types/models/connect'
import { IPageConfig } from '~/types/models/global'
import { selectedComponentData, reac, DataComponentType } from '~/types/models/guiEditor'
import { ConnectDropTarget } from 'react-dnd'

export { ConnectState, reac, selectedComponentData, DataComponentType }

export interface CollectedProps {
  connectDropTarget: ConnectDropTarget
  isOver: boolean
  isOverCurrent: boolean
}

export interface DragObject {}

export interface Props extends ConnectProps, CollectedProps {
  isDragging: boolean

  pageConfig: IPageConfig
  hoverComponentData: selectedComponentData
  selectedComponentData: selectedComponentData

  onChange: (newIndex: number) => void
}

export interface State {}
