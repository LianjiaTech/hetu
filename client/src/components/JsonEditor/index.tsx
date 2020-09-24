import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import { JsonEditorProps, JsonEditorState } from './interface'
import './index.less'
import { isString } from 'lodash';
import { isJavascriptStr } from '~/utils'

import './_utils'

class JsonEditor extends React.Component<JsonEditorProps, JsonEditorState> {

  static defaultProps = {
  }

  state: JsonEditorState = {
    height: this.props.height,
    isEditorVisible: false
  }

  $EditorWrapper: HTMLElement

  componentDidMount() {
    const rect = this.$EditorWrapper.getBoundingClientRect()
    let height = rect && rect.height
    if (height < 60) {
      height = 60
    }

    this.setState({
      isEditorVisible: true,
      height
    })
  }

  editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
  }

  onChange = (newValue: string, _e: monacoEditor.editor.IModelContentChangedEvent) => {
    const { onChange } = this.props
    onChange(newValue)
  }

  render() {
    const { isEditorVisible, height } = this.state
    const { defaultValue, value, disabled } = this.props

    const options: monacoEditor.editor.IEditorConstructionOptions = {
      lineNumbers: 'off',
      lineDecorationsWidth: '0ch',
      minimap: {
        enabled: false,
      },
      overviewRulerLanes: 0,
      lineNumbersMinChars: 2,
      roundedSelection: false,
      formatOnPaste: true,
      renderLineHighlight: "none",
      renderWhitespace: "none",
      renderIndentGuides: false,// 删除垂直引导线
      copyWithSyntaxHighlighting: true,
      scrollbar: {
        arrowSize: 6,
      },
      tabCompletion: false,
      readOnly: disabled,
      fontSize: 14
    }

    let _value = value
    if (value === undefined) {
      _value = defaultValue === undefined ? null : defaultValue
    }

    if (!isString(_value) || isJavascriptStr(_value)) {
      try {
        _value = JSON.stringify(_value, null, 2)
      } catch (e) {
        // do nothing
        _value = null
      }
    }

    return (
      <div className="ht-json-editor" style={{ height }} ref={c => this.$EditorWrapper = c}>
        {isEditorVisible &&
          <MonacoEditor language="json" theme="vs-dark" value={_value} options={options} onChange={this.onChange} editorDidMount={this.editorDidMount} />
        }
      </div>
    )
  }
}

export default JsonEditor
