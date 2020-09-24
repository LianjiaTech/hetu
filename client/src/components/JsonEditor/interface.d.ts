type valueType = string | undefined | null
export interface JsonEditorProps {
  defaultValue?: valueType
  value?: valueType
  disabled?: boolean
  onChange?: (v: string) => void
  height?: number
}

export interface JsonEditorState {
  isEditorVisible: boolean
  height: number
}
