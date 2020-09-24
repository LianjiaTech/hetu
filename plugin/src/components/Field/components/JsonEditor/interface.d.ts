import { BaseProps } from '~/types'

type valueType = string | undefined | null
export interface JsonEditorProps extends BaseProps {
  defaultValue: valueType
  value: valueType
  disabled: boolean
  onChange: (v: string) => void
  height?: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonEditorState {}
