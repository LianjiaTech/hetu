/* eslint-disable no-template-curly-in-string */
// import { sleep } from '@test/utils'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
// import mockAxios from 'jest-mock-axios'
import _ from 'lodash'
import React from 'react'
import HtField from '~/components/Field'
import { fieldMap } from '~/components/Field/components'
import { HtFieldProps } from '~/components/Field/interface'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()

const alias = '$$HtForm'
const url = 'http://xxx.hetu.com/mock/demo/update123'

const field0: Field = {
  type: 'Input',
  field: 'name',
  title: '姓名',
  defaultValue: '张三',
  required: true,
  disabled: false,
  rules: [],
  tooltip: '气泡提示信息',
  // [旧]表单值变化时, 设置一组输入控件的值
  setFieldsValue: {
    // @ts-ignore
    // eslint-disable-next-line no-template-curly-in-string
    nickname: "<%:=  v => v + 'xxx' %>",
    remark: '',
  },
  // [旧] 表单值变化时, 发送请求
  // @ts-ignore
  requestOnChange: {
    event: 'onChange',
    alias: 'xxx_options',
    url: 'http://xxx.hetu.com/xxx/options',
    method: 'get',
    params: {
      a: 1,
    },
    // eslint-disable-next-line no-template-curly-in-string
    // @ts-ignore
    transform: '<%:=  v => v.list %>',
  },
  // 是否忽略提交
  ignore: false,
  placeholder: '引导文案',
  labelCol: { span: 12 },
  wrapperCol: { span: 10 },
}

const field1: Field = {
  type: 'Input',
  field: 'nickname',
  title: '昵称',
  defaultValue: '张三xxx',
  required: true,
  // [新]表单值变化时, 设置一组输入控件的值
  setFieldValues: [
    {
      event: 'onChange',
      field: 'name',
      value: '',
    },
    {
      event: 'onChange',
      field: 'remark',
      value: "<%:=  v=> ' 备注信息' + v %>",
    },
  ],
  // [新] 表单值变化时, 发送请求
  // @ts-ignore
  onChangeRequests: [
    {
      event: 'onChange',
      alias: 'xxx_options',
      url: 'http://xxx.hetu.com/xxx/options2',
      method: 'get',
      params: {
        a: 1,
      },
      // eslint-disable-next-line no-template-curly-in-string
      // @ts-ignore
      transform: '<%:= v => v.list %>',
    },
  ],
}

const field2: Field = {
  type: 'Input',
  field: 'remark',
  title: '备注',
  defaultValue: '张三xxx',
  required: true,
  // [新]表单值变化时, 设置一组输入控件的值
  setFieldValues: [],
  // [新] 表单值变化时, 发送请求
  onChangeRequests: [],
}

const fields: Field[] = [field0, field1, field2]
const isAutoSubmit = false

const elementConfig = {
  type: 'HtForm',
  props: {
    alias,
    url,
    fields,
    isAutoSubmit,
  },
  children: [],
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

describe('HtField', () => {
  const WrapperHtField = wrapper.find<React.Component<HtFieldProps>>(HtField)
  const WrapperHtField0 = WrapperHtField.at(0)
  const WrapperHtField1 = WrapperHtField.at(1)

  const WrapperHtFieldInstance0 = WrapperHtField.at(0).instance()

  it('正确接收props, 兼容属性setFieldsValue & requestOnChange', () => {
    expect(WrapperHtField).toHaveLength(3)

    expect(WrapperHtField0.prop('pagestate')).toBeDefined()
    expect(WrapperHtField0.prop('form')).toBeDefined()

    expect(WrapperHtField0.props()).toMatchObject({
      ..._.omit(field0, ['ignore', 'setFieldsValue', 'requestOnChange']),
    })
    expect(WrapperHtField0.prop('setFieldsValue')).toEqual(
      expect.objectContaining({
        nickname: expect.any(Function),
      })
    )
    expect(WrapperHtField0.prop('requestOnChange')).toEqual(
      expect.objectContaining({
        event: expect.any(String),
        alias: expect.any(String),
        url: expect.any(String),
        method: expect.any(String),
        params: expect.any(Object),
        transform: expect.any(Function),
      })
    )
  })

  it('正确接收props setFieldValues & onChangeRequests', () => {
    expect(WrapperHtField1.props()).toMatchObject({
      ..._.omit(field1, ['ignore', 'setFieldValues', 'onChangeRequests']),
    })

    expect(WrapperHtField1.prop('setFieldValues')).toHaveLength(
      field1.setFieldValues?.length || 0
    )
    expect(WrapperHtField1.prop('setFieldValues')).toEqual(
      expect.arrayContaining([
        {
          event: expect.any(String),
          field: expect.any(String),
          value: expect.any(Function),
        },
      ])
    )

    expect(WrapperHtField1.prop('onChangeRequests')).toEqual(
      expect.arrayContaining([
        {
          event: expect.any(String),
          alias: expect.any(String),
          url: expect.any(String),
          method: expect.any(String),
          params: expect.any(Object),
          transform: expect.any(Function),
        },
      ])
    )
  })

  it('正确的方法 onChange', () => {
    // @ts-ignore
    const handleOnChange = jest.spyOn(WrapperHtFieldInstance0, 'handleOnChange')

    const mockEvent = { target: { value: 'testSetFieldsValue' } }
    // @ts-ignore
    WrapperHtFieldInstance0.onChange(mockEvent)

    expect(handleOnChange).toBeCalledWith(mockEvent.target.value, 'onChange')

    handleOnChange.mockRestore()
  })

  it('正确的方法 handleOnChange', () => {
    const resolveRequestOnChange = jest
      // @ts-ignore
      .spyOn(WrapperHtFieldInstance0, 'resolveRequestOnChange')
      .mockImplementation(() => Promise.resolve())

    // @ts-ignore
    WrapperHtFieldInstance0.handleOnChange()

    expect(resolveRequestOnChange).toBeCalledTimes(1)

    resolveRequestOnChange.mockRestore()
  })

  // it('正确的方法 resolveRequestOnChange', async () => {
  //   jest.useRealTimers()
  //   const thenFn = jest.fn()
  //   // @ts-ignore
  //   const res = WrapperHtFieldInstance0.resolveRequestOnChange()
  //     .then(thenFn)
  //     .catch(console.info)

  //   await sleep(30)

  //   const targetUrl: string = field0.requestOnChange?.url || ''
  //   const method: string = field0.requestOnChange?.method || 'get'

  //   const requestInfo = mockAxios.getReqMatching({
  //     url: targetUrl,
  //     method,
  //   })

  //   expect(requestInfo.config.params).toMatchObject(
  //     // @ts-ignore
  //     field0.requestOnChange?.params
  //   )
  //   await sleep(30)

  //   const mockResponse = {
  //     status: 200,
  //     data: { code: 0, data: { list: 11234 } },
  //   }
  //   mockAxios.mockResponseFor(targetUrl, mockResponse)

  //   await sleep(30)

  //   expect(thenFn).toBeCalledWith(mockResponse.data.data.list)
  // })

  it('正确的方法 getComponent', () => {
    const error = jest.spyOn(global.console, 'error')
    // @ts-ignore
    const getComponent = WrapperHtFieldInstance0.getComponent
    expect(getComponent()).toEqual(fieldMap.Input)
    expect(getComponent('Checkbox')).toEqual(fieldMap.Checkbox)
    expect(getComponent('HtCheckbox')).toEqual(fieldMap.Checkbox)

    error.mockRestore()
  })

  it('正确的方法 onBlur', () => {
    // @ts-ignore
    const handleOnChange = jest.spyOn(WrapperHtFieldInstance0, 'handleOnChange')
    const mockEvent = { target: { value: 'testSetFieldsValue' } }
    // @ts-ignore
    WrapperHtFieldInstance0.onBlur(mockEvent)
    expect(handleOnChange).toBeCalledWith(mockEvent.target.value, 'onBlur')
    handleOnChange.mockRestore()
  })

  describe('正确的方法 componentDidMount', () => {
    it('defaultValue 转换为formData', () => {
      const formData = WrapperHtFieldInstance0.props.form.getFieldsValue()

      expect(formData).toHaveProperty('name', '张三')
    })

    it('如果值存在,自动触发一次 handleOnChange', () => {
      const handleOnChange = jest
        // @ts-ignore
        .spyOn(WrapperHtFieldInstance0, 'handleOnChange')

      // @ts-ignore
      WrapperHtFieldInstance0.componentDidMount()

      expect(handleOnChange).toHaveBeenCalledWith('张三')

      handleOnChange.mockRestore()
    })
  })
})
