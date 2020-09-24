type valueType = string | undefined | null
export interface JsonEditorProps {
  defaultValue?: valueType
  value?: valueType
  disabled?: boolean
  height?: number

  onChange?: (v: string) => void
  getRef: (c: any) => void
}

export interface JsonEditorState {
  codeStr?: string
  code?: any
  isEditorVisible: boolean
  height: number
}
