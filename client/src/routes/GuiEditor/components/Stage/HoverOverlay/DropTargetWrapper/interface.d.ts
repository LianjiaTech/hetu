import React from 'react'
import { ConnectState, ConnectProps } from '~/types/models/connect'
import { IPageConfig } from '~/types/models/global'
import { selectedComponentData, reac } from '~/types/models/guiEditor'
import { ConnectDropTarget } from 'react-dnd'

export { ConnectState, reac, selectedComponentData, IPageConfig }

export interface CollectedProps {
  connectDropTarget: ConnectDropTarget
  isOver: boolean
}

export interface DragObject {}

export interface Props extends ConnectProps, CollectedProps {
  type: string
  index: number
  reac: reac
}

export interface State {}
