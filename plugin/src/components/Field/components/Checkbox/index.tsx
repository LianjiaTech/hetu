import { Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { isArray, isFunction, isPlainObject } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'

import { JsonSchema } from '~/types'
import {
  ExtraOption,
  HtCheckboxProps,
  HtCheckboxState,
  HtCheckboxValue,
} from './interface'
import ModalAddOption from './ModalAddOption'

@observer
export default class HtCheckbox extends React.Component<
  HtCheckboxProps,
  HtCheckboxState
> {
  static displayName = 'HtCheckbox'

  static defaultProps = {
    onChange: () => {},
    labelField: 'label',
    valueField: 'value',
    allCheck: false,
    canAddOption: false,
    optionsSourceType: 'static',
  }

  plainOptions: HtCheckboxValue = []

  state = {
    indeterminate: true,
    checkAll: false,
    isModalVisible: false,
    // 用户自己添加的options
    extraOptions: [],
  }

  formatOptions = (
    options: JsonSchema.HtFieldOption[],
    labelField: string,
    valueField: string
  ) => {
    this.plainOptions = []
    if (isArray(options)) {
      return options.map((item: any) => {
        if (isPlainObject(item)) {
          this.plainOptions.push(item[valueField])
          return {
            label: item[labelField],
            value: item[valueField],
          }
        } else {
          this.plainOptions.push(item as string)
          return {
            label: item,
            value: item,
          }
        }
      })
    }

    return []
  }

  onCheckAllChange = (e: CheckboxChangeEvent) => {
    const { onChange } = this.props
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    })

    if (isFunction(onChange)) {
      onChange(e.target.checked ? this.plainOptions : [])
    }
  }

  onModalConfirm = (formData: ExtraOption) => {
    const { extraOptions } = this.state

    this.setState({
      extraOptions: [...extraOptions, formData],
      isModalVisible: false,
    })
  }

  onModalCancel = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  onModalOpen = () => {
    this.setState({
      isModalVisible: true,
    })
  }

  render() {
    const { indeterminate, checkAll, isModalVisible, extraOptions } = this.state
    const {
      defaultValue,
      disabled,
      // @ts-ignore
      name,
      optionsSourceType,
      options,
      optionsDependencies,
      value,
      onChange,
      labelField = 'label',
      valueField = 'value',
      allCheck,
      canAddOption,
      addModalConfig,
      pagestate,
      ...otherProps
    } = this.props

    let __options =
      optionsSourceType === 'static' ? options : optionsDependencies
    if (!isArray(__options)) {
      __options = []
    }
    let _options = this.formatOptions([...__options], labelField, valueField)

    _options = [..._options, ...extraOptions]

    const RadioGroupProps = {
      defaultValue,
      disabled,
      name,
      value,
      onChange,
      options: _options,
    }

    return (
      <>
        {allCheck && (
          <Checkbox
            disabled={disabled}
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >
            全部
          </Checkbox>
        )}
        <Checkbox.Group {...otherProps} {...RadioGroupProps} />
        {canAddOption && (
          <ModalAddOption
            {...addModalConfig}
            visible={isModalVisible}
            onOpen={this.onModalOpen}
            onOk={this.onModalConfirm}
            onCancel={this.onModalCancel}
            options={_options}
          />
        )}
      </>
    )
  }
}
