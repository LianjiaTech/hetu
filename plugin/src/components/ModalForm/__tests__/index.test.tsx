/* eslint-disable no-template-curly-in-string */
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import { ModalForm } from '~/components/ModalForm/index'
import {
  ModalFormComponentProps,
  ModalFormComponentState,
} from '~/components/ModalForm/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
const props = {
  disabled: true,
  alias: '$$abcdefg',
  url: '/api/form/update',
  method: 'post',
  fields: [
    {
      field: 'name',
      title: '姓名',
    },
    {
      field: 'age',
      title: '年龄',
      type: 'InputNumber',
    },
  ],
  transform: '<%:= v => ({...v, id: 1234 }) %>',
  cols: 3,
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
  buttons: ['submit'],
  submitButtonText: '提交啦啦啦',
  sendFormData: jest.fn(),

  title: '弹框表单',
  triggerButtonText: '点我',
  triggerButtonProps: {
    type: 'primary',
  },
  onCancel: jest.fn(),
  onSuccess: jest.fn(),
  onSuccessAction: 'HtModalForm_testEvent',
  _onSuccessAction: ['HtModalForm_testEvent', { a: 1 }],
  className: 'test-class',
}

const elementConfig = {
  type: 'HtModalForm',
  props: props,
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperModalForm = wrapper
  .find<React.Component<ModalFormComponentProps, ModalFormComponentState>>(
    ModalForm
  )
  .at(0)
const WrapperModalFormInstance = WrapperModalForm.instance()

describe('正确的props', () => {
  Object.keys(props).forEach(key => {
    switch (key) {
      case 'transform':
        test(`props ${key}`, () => {
          // @ts-ignore
          expect(WrapperModalForm.prop(key)).toEqual(expect.any(Function))
        })
        break
      default:
        test(`props ${key}`, () => {
          // @ts-ignore
          expect(WrapperModalForm.prop(key)).toEqual(props[key])
        })
    }
  })
})

describe('正确的方法', () => {
  test('toggleModalVisible', () => {
    expect(WrapperModalFormInstance.state.visible).toEqual(false)
    // @ts-ignore
    WrapperModalFormInstance.toggleModalVisible(true)
    expect(WrapperModalFormInstance.state.visible).toEqual(true)

    // @ts-ignore
    WrapperModalFormInstance.toggleModalVisible(false)
    expect(WrapperModalFormInstance.state.visible).toEqual(false)
  })

  test('onCancel', () => {
    // @ts-ignore
    const resetMock = jest.spyOn(WrapperModalFormInstance, 'reset')
    const toggleModalVisibleMock = jest.spyOn(
      WrapperModalFormInstance,
      // @ts-ignore
      'toggleModalVisible'
    )
    // @ts-ignore
    WrapperModalFormInstance.onCancel()

    expect(resetMock).toBeCalledTimes(1)
    expect(toggleModalVisibleMock).toBeCalledTimes(1)
    expect(props.onCancel).toHaveBeenCalledTimes(1)

    resetMock.mockRestore()
    toggleModalVisibleMock.mockRestore()
    props.onCancel.mockRestore()
  })

  test('onSuccess', () => {
    // @ts-ignore
    const resetMock = jest.spyOn(WrapperModalFormInstance, 'reset')
    const toggleModalVisibleMock = jest.spyOn(
      WrapperModalFormInstance,
      // @ts-ignore
      'toggleModalVisible'
    )
    // @ts-ignore
    WrapperModalFormInstance.onSuccess()

    expect(resetMock).toBeCalledTimes(1)
    expect(toggleModalVisibleMock).toBeCalledTimes(1)
    expect(props.onSuccess).toHaveBeenCalledTimes(1)

    resetMock.mockRestore()
    toggleModalVisibleMock.mockRestore()
    props.onSuccess.mockRestore()
  })

  test('reset', () => {
    const setStoreStateMock = jest.spyOn(
      WrapperModalFormInstance.props.pagestate,
      'setStoreState'
    )
    // @ts-ignore
    WrapperModalFormInstance.reset()

    expect(setStoreStateMock).toBeCalledTimes(1)
    setStoreStateMock.mockRestore()
  })
})
