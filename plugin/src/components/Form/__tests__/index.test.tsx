import { sleep } from '@test/utils'
import { Button } from 'antd'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import mockAxios from 'jest-mock-axios'
import React from 'react'
import HtField from '~/components/Field'
import { HtForm } from '~/components/Form'
import { Field, HtFormProps, HtFormState } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

jest.mock('~/utils/actions')
const history = createBrowserHistory()
const goBack = jest.spyOn(history, 'goBack')

const alias = '$$HtFormTest'
const url = '/demo/update123'
const method = 'post'
const fields: Field[] = [
  {
    field: 'name',
    title: '姓名',
    type: 'Input',
    defaultValue: '张三',
    required: true,
  },
  {
    field: 'age',
    title: '年龄',
    ignore: true,
  },
]
const buttons = [
  'submit',
  'reset',
  'back',
  'redirectTo',
  'openWindow',
  'download',
]
const cols = 2
const labelCol = { span: 8 }
const wrapperCol = { span: 12 }
const submitButtonText = '搜索'
const backButtonText = '返回上一页'
const resetButtonText = '清空'
const redirectToButtonText = '下一步'
const downloadButtonText = '下载'
const isAutoSubmit = false
const isShowSuccessMessage = false
const onSuccessAction = 'null'
const transform = (v: any) => ({ ...v, id: 123 })

const elementConfig = {
  type: 'HtForm',
  props: {
    alias,
    url,
    method,
    fields,
    buttons,
    cols,
    labelCol,
    wrapperCol,
    submitButtonText,
    backButtonText,
    resetButtonText,
    downloadButtonText,
    redirectToButtonText,
    isAutoSubmit,
    isShowSuccessMessage,
    onSuccessAction,
    transform,
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)
const WrapperForm = wrapper.find<React.Component<HtFormProps, HtFormState>>(
  HtForm
)
const WrapperFormInstance = WrapperForm.instance()

afterAll(() => {
  goBack.mockRestore()
})

describe('HtForm', () => {
  it('正确的DOM结构', () => {
    const htmlStr = wrapper.html()
    expect(htmlStr).toMatch(/data-component-type="HtForm"/)
    expect(htmlStr).toMatch(/data-pageconfig-path="elementConfig"/)
  })

  it('正确接收props', () => {
    const FormInstance = wrapper.find(HtForm)
    expect(FormInstance.prop('pagestate')).not.toBeUndefined()
    expect(FormInstance.prop('url')).toEqual(url)
    expect(FormInstance.prop('method')).toEqual(method)
    expect(FormInstance.prop('fields')).toEqual(fields)
    expect(FormInstance.prop('buttons')).toEqual(buttons)
    expect(FormInstance.prop('cols')).toEqual(cols)
    expect(FormInstance.prop('labelCol')).toEqual(labelCol)
    expect(FormInstance.prop('wrapperCol')).toEqual(wrapperCol)
    expect(FormInstance.prop('submitButtonText')).toEqual(submitButtonText)
    expect(FormInstance.prop('backButtonText')).toEqual(backButtonText)
    expect(FormInstance.prop('resetButtonText')).toEqual(resetButtonText)
    expect(FormInstance.prop('redirectToButtonText')).toEqual(
      redirectToButtonText
    )
    expect(FormInstance.prop('downloadButtonText')).toEqual(downloadButtonText)
    expect(FormInstance.prop('isAutoSubmit')).toEqual(isAutoSubmit)
    expect(FormInstance.prop('isShowSuccessMessage')).toEqual(
      isShowSuccessMessage
    )
    expect(FormInstance.prop('onSuccessAction')).toEqual(onSuccessAction)
    // @ts-ignore
    expect(FormInstance.prop('transform')({ a: 1 })).toEqual({ a: 1, id: 123 })
  })
})

describe('HtForm组件内部方法正确', () => {
  it('正确的方法 setPageLoading', () => {
    // @ts-ignore
    WrapperFormInstance.setPageLoading(true)
    expect(WrapperForm.state().isPageLoading).toBe(true)
    // @ts-ignore
    WrapperFormInstance.setPageLoading(false)
    expect(WrapperForm.state().isPageLoading).toBe(false)
  })

  it('正确的方法 reset', () => {
    // @ts-ignore
    const setStoreStateMock = jest.spyOn(
      WrapperFormInstance.props.pagestate,
      'setStoreState'
    )
    WrapperFormInstance.props.form.setFieldsValue({ name: '王五' })

    // @ts-ignore
    expect(WrapperFormInstance.props.pagestate[alias].name).toBe('王五')

    // @ts-ignore
    WrapperFormInstance.reset()

    // @ts-ignore
    expect(WrapperFormInstance.props.pagestate[alias].name).toBe('张三')

    expect(setStoreStateMock).toHaveBeenCalledWith({
      [alias]: { name: '张三' },
    })
  })

  it('正确的方法 back', () => {
    // @ts-ignore
    WrapperFormInstance.back()
    expect(history.goBack).toHaveBeenCalledTimes(1)
  })

  it('redirectTo', () => {
    // @ts-ignore
    WrapperFormInstance.redirectTo()
  })

  it('openWindow', () => {
    // @ts-ignore
    WrapperFormInstance.openWindow()
  })

  it('download', () => {
    // @ts-ignore
    WrapperFormInstance.download()
  })
})

it('正确的方法 resetAndSubmit && submit && sendFormData', async () => {
  expect(mockAxios).toHaveBeenCalledTimes(0)

  WrapperFormInstance.props.form.setFieldsValue({ name: '王巴巴' })
  // @ts-ignore
  WrapperFormInstance.submit()

  await sleep(10)

  expect(mockAxios).toHaveBeenCalledTimes(1)
  const requestInfo = mockAxios.lastReqGet()

  expect(requestInfo.data).toHaveProperty('name', '王巴巴')
})

it('正确的方法 renderButtons', () => {
  const Buttons = wrapper.find(Button)
  expect(Buttons).toHaveLength(buttons.length)
  const buttonMap: any = {
    submit: {
      htmlType: 'button',
      children: submitButtonText,
      // @ts-ignore
      onClick: WrapperFormInstance.resetAndSubmit,
    },
    reset: {
      htmlType: 'button',
      children: resetButtonText,
      // @ts-ignore
      onClick: WrapperFormInstance.reset,
    },
    back: {
      htmlType: 'button',
      children: backButtonText,
      // @ts-ignore
      onClick: WrapperFormInstance.back,
    },
    redirectTo: {
      htmlType: 'button',
      children: redirectToButtonText,
      // @ts-ignore
      onClick: WrapperFormInstance.redirectTo,
    },
    openWindow: {
      htmlType: 'button',
      children: redirectToButtonText,
      // @ts-ignore
      onClick: WrapperFormInstance.openWindow,
    },
    download: {
      htmlType: 'button',
      children: downloadButtonText,
      // @ts-ignore
      onClick: WrapperFormInstance.download,
    },
  }
  // 提交按钮
  expect(Buttons.at(0).props()).toMatchObject(buttonMap[buttons[0]])
  expect(Buttons.at(1).props()).toMatchObject(buttonMap[buttons[1]])
  expect(Buttons.at(2).props()).toMatchObject(buttonMap[buttons[2]])
})

it('正确的方法 renderFields', () => {
  const Fields = wrapper.find(HtField)
  let visibleFields = fields.filter(
    // @ts-ignore
    v => !(!v['v-if'] && v['v-if'] !== undefined)
  )
  expect(Fields).toHaveLength(visibleFields.length)
  expect(Fields.at(0).props()).toMatchObject({
    'data-pageconfig-path': `elementConfig.props.fields[0]`,
    'data-component-type':
      `HtField.${visibleFields[0].type}` || 'HtField.Input',
  })
})

it('正确的方法 filterFields', () => {
  // @ts-ignore
  const filterFields = WrapperFormInstance.filterFields
  const result = filterFields({
    name: 'aaa',
    age: 12,
  })

  expect(result.name).toEqual('aaa')
  expect(result.age).toBeUndefined()
})
