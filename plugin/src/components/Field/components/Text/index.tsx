import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import HtmlFragment from '~/components/HtmlFragment'
import JsonEditor from '../JsonEditor'
import './index.less'
import { Props } from './interface'

export class HtText extends React.Component<Props> {
  static displayName = 'HtText'

  static defaultProps = {}

  state = {}

  render() {
    const { defaultValue, value, jsonFormat, pagestate, isWrap } = this.props

    let _value = value === undefined ? defaultValue : value

    if (jsonFormat && _.isObject(_value)) {
      // 如果使用json格式化 并且返回的是obj（其他类型可以直接用text展示不需要json展示）
      const formatValue = JSON.stringify(_value, null, 2)
      return (
        <JsonEditor
          className="ht-text-jsonEditor"
          value={formatValue}
          onChange={() => {}}
          disabled={true}
          defaultValue={formatValue}
          pagestate={pagestate}
          height={300}
        />
      )
    }

    if (isWrap) {
      // 如果需要换行展示
      return (
        <HtmlFragment
          block
          __html={_value.replace(new RegExp(/(\r\n)|(\n)/g), '<br/>')}
        />
      )
    }

    if (_.isArray(_value) || _.isObject(_value)) {
      _value = JSON.stringify(_value, null, 2)
    }

    if (_.isFunction(_value) || _.isBoolean(value)) {
      _value = _value.toString()
    }

    return <HtmlFragment __html={_value} />
  }
}

export default observer(HtText)
