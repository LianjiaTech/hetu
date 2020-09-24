import classNames from 'classnames'
import { isString } from 'lodash'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { observer } from 'mobx-react'

import './index.less'
import { JsonEditorProps, JsonEditorState } from './interface'
import './_utils'

@observer
class JsonEditor extends React.Component<JsonEditorProps, JsonEditorState> {
  static defaultProps = {
    height: 100,
  }

  state: JsonEditorState = {}

  editorDidMount = (
    _editor: monacoEditor.editor.IStandaloneCodeEditor,
    _monaco: typeof monacoEditor
  ) => {}

  onChange = (
    newValue: string,
    _e: monacoEditor.editor.IModelContentChangedEvent
  ) => {
    const { onChange } = this.props
    onChange(newValue)
  }

  render() {
    const { height, defaultValue, value, disabled, className } = this.props

    const options: monacoEditor.editor.IEditorConstructionOptions = {
      lineNumbers: 'off',
      lineDecorationsWidth: 0,
      minimap: {
        enabled: false,
      },
      lineNumbersMinChars: 2,
      roundedSelection: false,
      formatOnPaste: true,
      renderLineHighlight: 'none',
      overviewRulerBorder: false,
      scrollbar: {
        arrowSize: 6,
      },
      readOnly: disabled,
    }

    let _value = value
    if (value === undefined) {
      _value = defaultValue === undefined ? null : defaultValue
    }

    if (!isString(_value)) {
      _value = null
    }

    return (
      <div className={classNames('ht-json-editor', className)}>
        <MonacoEditor
          height={height}
          language="json"
          theme="vs-light"
          value={_value}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
      </div>
    )
  }
}

export default JsonEditor
