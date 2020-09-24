import React, { CSSProperties } from 'react'
import { ConnectState, ConnectProps } from '~/types/models/connect'
import { IPageConfig } from '~/types/models/global'
import { selectedComponentData, reac } from '~/types/models/guiEditor'

export { ConnectState, reac }

export interface Props extends ConnectProps {
  pageConfig: IPageConfig

  hoverComponentData: selectedComponentData
  selectedComponentData: selectedComponentData

  style: CSSProperties

  onClick: (e: React.MouseEvent) => void
  onCtrlClick: (e: React.MouseEvent) => void
  onMouseMove: () => void
  onMouseLeave: () => void
}
