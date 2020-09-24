import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import { JsonEditorProps, JsonEditorState } from './Controled.d'
import './index.less'
import _ from 'lodash';

import './_utils'

const toJS = (json: string) => JSON.parse(json)
const toJson = (val: any) => JSON.stringify(val, null, 2)

class JsonEditor extends React.Component<JsonEditorProps, JsonEditorState> {

  static defaultProps = {
  }

  state: JsonEditorState = {
    height: this.props.height,
    isEditorVisible: false
  }

  $EditorWrapper: HTMLElement

  errorMessage?: string

  static getDerivedStateFromProps(nextProps: JsonEditorProps, prevState: JsonEditorState) {
    if (!prevState.codeStr) {
      let codeStr = ''
      try {
        codeStr = toJson(nextProps.value)
      } catch (e) {
        codeStr = ''
      }
      return {
        ...prevState,
        codeStr
      }
    }

    return {
      ...prevState,
      code: nextProps.value,
    }
  }

  componentDidMount() {
    const { getRef } = this.props
    const rect = this.$EditorWrapper.getBoundingClientRect()
    let height = rect && rect.height
    if (height < 60) {
      height = 60
    }

    this.setState({
      isEditorVisible: true,
      height
    })

    if (_.isFunction(getRef)) {
      getRef(this)
    }
  }

  editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
  }

  onChange = (newValue: string, _e: monacoEditor.editor.IModelContentChangedEvent) => {
    const { onChange } = this.props
    let jsCode, valid
    try {
      if (newValue) {
        jsCode = toJS(newValue)
      }
      valid = true
    } catch (e) {
      valid = false
      console.warn(`json格式错误:`, newValue)
    } finally {
      if (valid) {
        onChange(jsCode)
      }
      this.errorMessage = valid ? undefined : `json格式错误:${newValue}`
      this.setState({ codeStr: newValue })
    }
  }

  render() {
    const { isEditorVisible, height, codeStr } = this.state
    const { defaultValue, disabled } = this.props

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

    return (
      <div className="ht-json-editor" style={{ height }} ref={c => this.$EditorWrapper = c}>
        {isEditorVisible &&
          <MonacoEditor language="json" theme="vs-dark" value={codeStr} options={options} onChange={this.onChange} editorDidMount={this.editorDidMount} />
        }
      </div>
    )
  }
}

export default JsonEditor
