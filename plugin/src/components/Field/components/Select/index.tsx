import { Divider, Icon, Select } from 'antd'
import classnames from 'classnames'
import _, { isArray, isPlainObject, throttle } from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { JsonSchema } from '~/types'
import request from '~/utils/request'
import { HtSelectProps, HtSelectState, HtSelectValue } from './interface'

/**
 * value值是否和options匹配
 * @param value
 * @param options
 */
function isAllMatch(
  value: HtSelectValue,
  options: JsonSchema.HtFieldStandardOption[]
): boolean {
  if (!_.isArray(value)) return false

  if (value.length !== options.length) return false

  return options.every(v => v.value && value.includes(v.value))
}

@observer
export default class HtSelect extends Component<HtSelectProps, HtSelectState> {
  static displayName = 'HtSelect'

  static defaultProps = {
    onChange: () => {},
    labelField: 'label',
    valueField: 'value',
    showSearch: true,
    searchOnFocus: true,
    showIcon: false,
    // 是否允许多选
    isMultiple: false,
    optionsSourceType: 'static',
    labelInValue: false,
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    let remote = nextProps.remote

    switch (nextProps.optionsSourceType) {
      case 'remote':
        remote = true
        break
      default:
        remote = false
    }

    if (remote) {
      return {
        ...prevState,
        remote,
      }
    }

    return {
      ...prevState,
      remote,
      plainOptions:
        nextProps.optionsSourceType === 'static'
          ? nextProps.options
          : nextProps.optionsDependencies,
    }
  }

  state = {
    plainOptions: [],
    remote: false,
  }

  handleSearch = throttle((v = '') => {
    const { remote } = this.state
    const { optionsConfig: config } = this.props
    if (remote && config) {
      const {
        url,
        method = 'get',
        params,
        data,
        field = 'keyLike',
        transform,
      } = config
      request[method as 'get'](url, { [field]: v, ...params, ...data }).then(
        (res: any) => {
          if (res && isArray(res.data)) {
            let _data = res.data
            if (_.isFunction(transform)) {
              _data = transform(_data)
            }
            this.setState({
              plainOptions: _data,
            })
          } else {
            this.setState({
              plainOptions: [],
            })
          }
        }
      )
    }
  }, 300)

  componentDidMount() {
    const { value } = this.props

    if (value !== undefined) {
      this.handleSearch()
    }
  }

  formatOptions = (
    options: JsonSchema.HtFieldOption[],
    labelField: string,
    valueField: string
  ): JsonSchema.HtFieldStandardOption[] => {
    if (isArray(options)) {
      let _options = filterOptions(options, valueField)

      return _options.map((item: any) => {
        if (isPlainObject(item)) {
          return {
            ...item,
            label: item[labelField],
            value: item[valueField],
          }
        }
        return {
          label: item,
          value: item,
          icon: item,
        }
      })
    }

    return []
  }

  onFocus = () => {
    const { remote } = this.state
    let { optionsConfig, searchOnFocus } = this.props

    if (remote && optionsConfig && searchOnFocus) {
      this.handleSearch()
    }
  }

  renderIcon = (item: JsonSchema.HtFieldStandardOption, i: number) => {
    const { showIcon } = this.props
    if (!showIcon) return null

    return (
      <Icon type={item.icon} key={`icon-${i}`} style={{ marginRight: '8px' }} />
    )
  }

  onCheckChange = (checked: boolean) => {
    const { onChange, labelField, valueField } = this.props
    const { plainOptions } = this.state
    const _options = this.formatOptions(
      plainOptions,
      labelField as string,
      valueField as string
    )

    const allValues = _options.map(item => item.value)

    onChange(checked ? allValues : [])
  }

  render() {
    const { plainOptions, remote: _remote } = this.state
    let {
      value,
      onChange,
      remote,
      optionsSourceType,
      options,
      optionsDependencies,
      optionsConfig,
      isMultiple,
      labelField,
      valueField,
      showSearch,
      searchOnFocus,
      pagestate,
      labelInValue,
      isCheckAll,
      ...otherProps
    } = this.props

    if (_remote) {
      showSearch = true
    }

    const _options = this.formatOptions(
      plainOptions,
      labelField as string,
      valueField as string
    )

    if (isMultiple) {
      // 如果isMultiple为true
      // @ts-ignore
      otherProps.mode = 'multiple'
      if (isCheckAll) {
        const isAllCheck = isAllMatch(value, _options)
        // 如果开启全选功能
        // @ts-ignore
        otherProps.dropdownRender = menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div
              style={{ padding: 8 }}
              className={classnames({
                'ht-select-dropdown-menu-item': true,
                'ht-select-dropdown-menu-item-selected': isAllCheck,
              })}
              onClick={() => this.onCheckChange(!isAllCheck)}
            >
              全选
              {isAllCheck && (
                <Icon type="check" className="ht-select-selected-icon" />
              )}
            </div>
          </div>
        )
      }
    }

    if (valueField === 'key') {
      // 如果提交字段为key
      console.error('options的提交字段不能为"key"')
    }

    const filterOption = (input: string, option: React.ReactElement) => {
      return option.props.title.indexOf(input) !== -1
    }

    return (
      <div
        onMouseDown={e => {
          e.preventDefault()
        }}
      >
        <Select
          value={value}
          onChange={onChange}
          showSearch={showSearch}
          filterOption={_remote ? false : filterOption}
          defaultActiveFirstOption={false}
          onSearch={this.handleSearch}
          onFocus={this.onFocus}
          labelInValue={labelInValue}
          optionLabelProp="title"
          {...otherProps}
        >
          {isArray(_options) &&
            _options.map((item, i) => (
              <Select.Option
                value={item.value}
                disabled={item.disabled}
                title={item.label}
                key={i}
              >
                {this.renderIcon(item, i)}
                {item.label}
              </Select.Option>
            ))}
        </Select>
      </div>
    )
  }
}

// 过滤options, 去重
function filterOptions(
  options: JsonSchema.HtFieldOption[],
  valueField: string | number
) {
  let map: JsonSchema.DynamicObject = {}
  let value
  return options.filter(item => {
    value = item
    if (isPlainObject(item)) {
      // @ts-ignore
      value = item[valueField]
    }

    if (map[value]) {
      return false
    }

    map[value] = 1
    return true
  })
}
