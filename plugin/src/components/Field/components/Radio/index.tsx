import { Radio } from 'antd'
import { isArray, isPlainObject } from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { JsonSchema } from '~/types'
import ModalAddOption from '../Checkbox/ModalAddOption'
import { ExtraOption, HtRadioProps, HtRadioState } from './interface'

@observer
export default class HtRadio extends Component<HtRadioProps, HtRadioState> {
  static displayName = 'HtRadio'

  static defaultProps = {
    onChange: () => {},
    canAddOption: false,
    optionsSourceType: 'static',
  }

  state = {
    isModalVisible: false,
    // 用户自己添加的options
    extraOptions: [],
  }

  formatOptions = (
    options: JsonSchema.HtFieldOption[],
    labelField: string,
    valueField: string
  ) => {
    if (isArray(options)) {
      return options.map((item: JsonSchema.DynamicObject | string | number) => {
        if (isPlainObject(item)) {
          return {
            // @ts-ignore
            label: item[labelField],
            // @ts-ignore
            value: item[valueField],
          }
        }

        return {
          label: item,
          value: item,
        }
      })
    }

    return []
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
    const { isModalVisible, extraOptions } = this.state
    const {
      defaultValue,
      disabled,
      name,
      optionsSourceType,
      options,
      optionsDependencies,
      value,
      onChange,
      buttonStyle,
      labelField = 'label',
      valueField = 'value',
      canAddOption,
      pagestate,
      ...otherProps
    } = this.props

    let __options =
      optionsSourceType === 'static' ? options : optionsDependencies

    if (!isArray(__options)) {
      __options = []
    }

    let _options = this.formatOptions(__options, labelField, valueField)

    _options = [..._options, ...extraOptions]

    const RadioGroupProps = {
      defaultValue,
      disabled,
      name,
      value,
      onChange,
      buttonStyle,
    }

    return (
      <>
        {buttonStyle ? (
          <Radio.Group {...otherProps} {...RadioGroupProps}>
            {(_options || []).map(({ label, value }, index) => {
              return (
                <Radio.Button key={index} value={value}>
                  {label}
                </Radio.Button>
              )
            })}
          </Radio.Group>
        ) : (
          <Radio.Group
            {...otherProps}
            {...RadioGroupProps}
            options={_options}
          />
        )}
        {canAddOption && (
          <ModalAddOption
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
