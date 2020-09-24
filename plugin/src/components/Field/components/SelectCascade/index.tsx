/* eslint-disable max-params */
import { Cascader } from 'antd'
import { CascaderOptionType } from 'antd/es/cascader'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import request from '~/utils/request'
import { HtSelectCascadeProps, HtSelectCascadeState } from './interface'

/**
 * options转换
 * @param options
 * @param labelField
 * @param valueField
 * @param level
 */
function transformOptions(
  options: any[],
  labelField: string,
  valueField: string,
  level: number
) {
  if (_.isArray(options)) {
    let result = []

    for (let v of options) {
      if (!_.isPlainObject(v)) {
        throw new Error(`options 格式错误`)
      }

      const label = _.get(v, labelField)
      const value = _.get(v, valueField)
      const searchable = _.get(v, 'searchable', false)

      let children = _.get(v, 'children')

      if (_.isArray(children) && children.length) {
        children = transformOptions(children, labelField, valueField, level + 1)
      }

      result.push({
        ...v,
        label,
        value,
        level,
        // isLeaf为false会展示箭头
        isLeaf: !searchable,
        children,
      })
    }

    return result
  }

  return []
}

@observer
export default class HtSelectCascade extends React.Component<
  HtSelectCascadeProps,
  HtSelectCascadeState
> {
  static displayName = 'HtSelectCascade'

  static defaultProps = {
    labelField: 'label',
    valueField: 'value',
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (
      _.isArray(prevState._options) &&
      _.isEqual(prevState._preOptions, nextProps.options)
    ) {
      return prevState
    }

    const { options, labelField, valueField } = nextProps

    return {
      ...prevState,
      _preOptions: options.slice(),
      _options: transformOptions(options.slice(), labelField, valueField, 0),
    }
  }

  state: Partial<HtSelectCascadeState> = {
    _options: [],
  }

  loadData = async (selectedOptions: CascaderOptionType[] = []) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    const { loadDataConfigs, labelField, valueField } = this.props

    let level = _.get(targetOption, 'level', 0)

    const config = _.get(loadDataConfigs, level)

    if (!config || !_.isPlainObject(config)) {
      throw new Error(`第${level}级节点对应的配置不存在`)
    }

    const { url, params, searchField = 'key', transform } = config

    const res = await request.get(url, {
      ...params,
      [searchField]: targetOption.value,
    })

    let result = _.get(res, 'data')

    if (_.isFunction(transform)) {
      result = transform(result)
    }

    targetOption.loading = false
    targetOption.children = _.isArray(result)
      ? transformOptions(result, labelField, valueField, level + 1)
      : []

    this.setState({
      _options: this.state._options,
    })
  }

  render() {
    const { _options } = this.state
    const {
      changeOnSelect,
      'data-component-type': dataComponentType,
      'data-pageconfig-path': dataPagestatePath,
      labelField,
      valueField,
      loadDataConfigs,
      options,
      children,
      pagestate,
      value,
      ...rest
    } = this.props

    return (
      <div
        data-component-type={dataComponentType}
        data-pageconfig-path={dataPagestatePath}
      >
        <Cascader
          {...rest}
          value={value && value.slice()}
          options={_options}
          changeOnSelect={changeOnSelect}
          loadData={this.loadData}
        />
      </div>
    )
  }
}
