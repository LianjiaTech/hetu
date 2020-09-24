import { AnyAction } from 'redux';
import { globalState } from './global'
import { editorState } from './editor.d'
import { guiEditorState } from './guiEditor.d'

export interface ConnectState {
  global: globalState
  editor: editorState
  guiEditor: guiEditorState
}

export interface Action {
  type: any;
}

export type Dispatch<T = any> = (action: AnyAction) => Promise<T> | any;

export interface ConnectProps {
  dispatch?: Dispatch;
}
