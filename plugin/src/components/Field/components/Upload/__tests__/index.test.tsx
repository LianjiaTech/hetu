import { Icon, Modal, Upload } from 'antd'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import mockAxios from 'jest-mock-axios'
import React from 'react'
import HtUpload from '~/components/Field/components/Upload/index'
import {
  HtUploadProps,
  HtUploadState,
} from '~/components/Field/components/Upload/interface'
import {
  formatFileList,
  formatFileList2,
} from '~/components/Field/components/Upload/utils'
// import HtField from '~/components/Field/index'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
type FieldMock = Partial<Field & HtUploadProps>

const field0: FieldMock = {
  field: 'file',
  title: '上传图片',
  type: 'Upload',
  max: 2,
  defaultValue: [
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  ],
  maxSize: 1000,
  width: 200,
  height: 200,
  uploadProps: {
    listType: 'picture-card',
    action: '/api/upload',
    accept: '.jpg, .bmp, .png',
  },
  isPrivate: false,
}

const field1: FieldMock = {
  field: 'excel',
  title: '上传excel',
  type: 'Upload',
  uploadProps: {
    action: '/api/upload/excel',
    accept: '.xlsx, .xls',
    listType: 'text',
  },
  isPrivate: true,
  privateConfig: {
    Bucket: 'hetu-private',
  },
  defaultValue: ['test-url'],
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxx',
    fields: [field0, field1],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperUpload0 = wrapper
  .find<React.Component<HtUploadProps, HtUploadState>>(HtUpload)
  .at(0)
const WrapperUpload0Instance = WrapperUpload0.instance()
const WrapperUpload1 = wrapper
  .find<React.Component<HtUploadProps, HtUploadState>>(HtUpload)
  .at(1)
const WrapperUpload1Instance = WrapperUpload1.instance()

describe('正确的props', () => {
  expect(WrapperUpload0.prop('value')).toEqual(field0.defaultValue)
  expect(WrapperUpload0.prop('max')).toEqual(field0.max)
  expect(WrapperUpload0.prop('maxSize')).toEqual(field0.maxSize)
  expect(WrapperUpload0.prop('uploadProps')).toMatchObject({
    action: field0.uploadProps?.action,
    accept: field0.uploadProps?.accept,
    listType: field0.uploadProps?.listType,
  })

  describe('render', () => {
    const WrapperUploads = wrapper.find(Upload)
    const WrapperModals = wrapper.find(Modal)

    test('lenght', () => {
      expect(WrapperUploads).toHaveLength(2)
      expect(WrapperModals).toHaveLength(2)
    })

    for (let i = 0; i < WrapperUploads.length; i++) {
      const WrapperUpload = WrapperUploads.at(i)
      const WrapperModal = WrapperModals.at(i)
      const field = elementConfig.props.fields[i]
      const WrapperUploadInstance = wrapper
        .find(HtUpload)
        .at(i)
        .instance()
      test(`Upload${i} render correct`, () => {
        expect(WrapperUpload.prop('listType')).toEqual(
          field.uploadProps?.listType || 'picture-card'
        )
        expect(WrapperUpload.prop('fileList')).toEqual(expect.any(Array))
        expect(WrapperUpload.prop('disabled')).toEqual(!!field.disabled)
        expect(WrapperUpload.prop('onPreview')).toEqual(
          // @ts-ignore
          WrapperUploadInstance.handlePreview
        )
        expect(WrapperUpload.prop('onChange')).toEqual(
          // @ts-ignore
          WrapperUploadInstance.handleChange
        )
      })

      test(`Modal${i} render corrent`, () => {
        expect(WrapperModal.prop('visible')).toEqual(expect.any(Boolean))
        expect(WrapperModal.prop('footer')).toEqual(null)
        expect(WrapperModal.prop('onCancel')).toEqual(
          // @ts-ignore
          WrapperUploadInstance.handleCancel
        )
      })
    }
  })
})

describe('正确的方法', () => {
  describe('componentDidMount', () => {
    // @ts-ignore
    const mockInit = jest.spyOn(WrapperUpload0Instance, 'init')
    // @ts-ignore
    WrapperUpload0Instance.componentDidMount()
    expect(mockInit).toHaveBeenCalledTimes(1)
    mockInit.mockRestore()
  })

  describe('init', () => {
    test(' isPrivate 为true', () => {
      // @ts-ignore
      WrapperUpload1Instance.init()
      const requestInfo = mockAxios.lastReqGet()
      expect(requestInfo.data).toMatchObject({
        Bucket: field1.privateConfig?.Bucket,
        urls: field1.defaultValue,
      })
    })

    test('isPrivate 为false', async () => {
      const mockSetState = jest.spyOn(WrapperUpload0Instance, 'setState')
      expect.assertions(1)
      // @ts-ignore
      await WrapperUpload0Instance.init()
      expect(mockSetState).toHaveBeenCalledTimes(1)
      mockSetState.mockRestore()
    })
  })

  describe('formatFileList2', () => {
    test('urls is an array', () => {
      const urls = [
        {
          name: 'http://ljcdn.com/asdfasdf.png',
          status: 'done',
          uid: '0.2648469406985543-0',
          url: 'http://ljcdn.com/asdfasdf.png',
        },
      ]
      const res = formatFileList2(urls)

      expect(res).toBeInstanceOf(Array)
      for (let i = 0; i < res.length; i++) {
        let item = res[i]
        expect(item).toMatchObject({
          uid: expect.any(String),
          status: 'done',
          name: item.url,
        })
      }
    })

    test('urls is not an array', () => {
      const urls = 'http://ljcdn.com/asdfasdf.png'
      // @ts-ignore
      const res = formatFileList2(urls)

      expect(res).toEqual([])
    })
  })

  describe('formatFileList', () => {
    test('value is an array', () => {
      const value = ['http://ljcdn.com/asdfasdf.png']
      const res = formatFileList(value)

      expect(res).toBeInstanceOf(Array)
      for (let i = 0; i < res.length; i++) {
        let item = res[i]
        let url = value[i]
        expect(item).toMatchObject({
          uid: expect.any(String),
          status: 'done',
          url,
        })
      }
    })

    test('value is not an array', () => {
      const value = 'http://ljcdn.com/asdfasdf.png'
      const res = formatFileList(value)

      expect(res).toEqual([])
    })
  })

  describe('handleCancel', () => {
    WrapperUpload0Instance.setState({ previewVisible: true })
    expect(WrapperUpload0Instance.state.previewVisible).toEqual(true)
    // @ts-ignore
    WrapperUpload0Instance.handleCancel()
    expect(WrapperUpload0Instance.state.previewVisible).toEqual(false)
  })

  describe('handlePreview', () => {
    const listType = field0.uploadProps?.listType

    const fileMock = {
      url: 'asdfadsf',
      thumbUrl: 'sadfsdaf',
    }
    // @ts-ignore
    WrapperUpload0Instance.handlePreview(fileMock)
    if (listType !== 'text') {
      expect(WrapperUpload0Instance.state).toHaveProperty(
        'previewVisible',
        true
      )
      expect(WrapperUpload0Instance.state).toHaveProperty(
        'previewImage',
        fileMock.thumbUrl || fileMock.url
      )
    }
  })

  describe('handleChange', () => {
    const renderMock = jest
      .spyOn(WrapperUpload0Instance, 'render')
      .mockImplementation(() => null)
    const infoMock = {
      fileList: [
        {
          uid: 'asdfsadf',
          size: 10,
          name: 'sadfdsaf',
          url: 'http://test1',
          type: 'png',
        },
        {
          response: {
            Location: 'http://test2',
          },
        },
      ],
    }

    // @ts-ignore
    WrapperUpload0Instance.handleChange(infoMock)

    expect(WrapperUpload0Instance.state.fileList).toHaveLength(2)
    expect(WrapperUpload0Instance.state.fileList[1]).toHaveProperty(
      'url',
      infoMock.fileList[1].response?.Location
    )

    // @ts-ignore
    expect(WrapperUpload0Instance.props.pagestate.$$HtForm.file).toEqual([
      'http://test1',
      'http://test2',
    ])

    renderMock.mockRestore()
  })

  describe('renderUploadButton', () => {
    let max = 1
    const fileList = [{ url: 'asdfsdaf' }, { url: 'asdfsdaf' }]

    // @ts-ignore
    const res = WrapperUpload0Instance.renderUploadButton(
      'picture-card',
      fileList,
      max
    )

    expect(res).toEqual(null)

    max = 3
    // @ts-ignore
    const res1 = WrapperUpload0Instance.renderUploadButton(
      'picture-card',
      fileList,
      max
    )

    const wrapper1 = mount(res1)
    const WrapperIcon1 = wrapper1.find(Icon).at(0)
    expect(WrapperIcon1.prop('type')).toEqual('plus')
    wrapper1.unmount()

    // @ts-ignore
    const res2 = WrapperUpload0Instance.renderUploadButton(
      'text',
      fileList,
      max
    )

    const wrapper2 = mount(res2)
    const WrapperIcon2 = wrapper2.find(Icon).at(0)
    expect(WrapperIcon2.prop('type')).toEqual('upload')
    wrapper2.unmount()
  })

  describe('checkSize', () => {
    const file = {
      lastModified: 1578033386892,
      name: '人物-03.png',
      size: 6135,
      type: 'image/png',
      uid: 'rc-upload-1594623673557-4',
      webkitRelativePath: '',
    }
    try {
      // @ts-ignore
      WrapperUpload0Instance.checkSize(file, 1000)
    } catch (e) {
      expect(e.message).toEqual(`请上传大小不超过 ${1000}kb 的图片!`)
    }
  })

  test('checkAspect', () => {})

  describe('beforeUpload', () => {
    test('width | height', () => {
      const file = {
        lastModified: 1578033386892,
        name: '人物-03.png',
        size: 6135,
        type: 'image/png',
        uid: 'rc-upload-1594623673557-4',
        webkitRelativePath: '',
      }
      // @ts-ignore
      const mockCheckAspect = jest.spyOn(WrapperUpload0Instance, 'checkAspect')
      // @ts-ignore
      WrapperUpload0Instance.beforeUpload(file)
      expect(mockCheckAspect).toHaveBeenCalledWith(file, {
        width: 200,
        height: 200,
      })
      mockCheckAspect.mockRestore()
    })
  })
})
