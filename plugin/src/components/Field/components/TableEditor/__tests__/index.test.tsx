import { Table } from 'antd'
import { mount } from 'enzyme'
import { createBrowserHistory } from 'history'
import React from 'react'
import HtTableEditor from '~/components/Field/components/TableEditor/index'
import {
  HtTableEditorProps,
  HtTableEditorState,
} from '~/components/Field/components/TableEditor/interface'
import { Field } from '~/components/Form/interface'
import { Hetu } from '~/Hetu'

const history = createBrowserHistory()
type FieldMock = Partial<Field & HtTableEditorProps>

const field0: FieldMock = {
  field: 'hobby1234',
  title: '兴趣',
  type: 'TableEditor',
  disabled: false,
  canAdd: false,
  canDelete: false,
  canAddChildren: true,
  modalConfig: {
    alias: 'xxass',
    width: 50,
  },
  defaultValue: [
    {
      path: 'hetu.com',
      name: '河图',
      icon: 'hdd',
      disabled: 0,
      children: [
        {
          path: 'family.hetu.com',
          name: '个人中心',
          disabled: 1,
          icon: 'user',
        },
      ],
    },
  ],
  columns: [
    {
      title: '页面路径',
      dataIndex: 'path',
      width: '30%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: '是否禁用',
      dataIndex: 'disabled',
      width: '15%',
      type: 'Radio',
      options: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
    },
    {
      title: '爱好',
      dataIndex: 'hobby',
      width: '15%',
      type: 'SelectMultiple',
      options: [
        { label: '骑马', value: '1' },
        { label: '射箭', value: '2' },
        { label: '玩游戏', value: '3' },
        { label: '睡觉', value: '4' },
      ],
    },
  ],
  scroll: {
    x: 1200,
  },
}

const elementConfig = {
  type: 'HtForm',
  props: {
    url: 'xxxzxvc',
    fields: [field0],
  },
}

const wrapper = mount(<Hetu elementConfig={elementConfig} history={history} />)

const WrapperTableEditor0 = wrapper
  .find<React.Component<HtTableEditorProps, HtTableEditorState>>(HtTableEditor)
  .at(0)
const WrapperTableEditor0Instance = WrapperTableEditor0.instance()
const WrapperTable = WrapperTableEditor0.find(Table).at(0)

test('正确的props', () => {
  expect(WrapperTableEditor0.prop('pagestate')).toEqual(expect.any(Object))

  expect(WrapperTableEditor0.prop('value')).toEqual(field0.defaultValue)
  expect(WrapperTableEditor0.prop('disabled')).toEqual(field0.disabled)
  expect(WrapperTableEditor0.prop('scroll')).toEqual(field0.scroll)
  expect(WrapperTableEditor0.prop('columns')).toEqual(field0.columns)
  expect(WrapperTableEditor0.prop('canAdd')).toEqual(field0.canAdd)
  expect(WrapperTableEditor0.prop('canDelete')).toEqual(field0.canDelete)
  expect(WrapperTableEditor0.prop('modalConfig')).toEqual(field0.modalConfig)
  expect(WrapperTableEditor0.prop('canAddChildren')).toEqual(
    field0.canAddChildren
  )
})

describe('正确的方法', () => {
  test('render', () => {
    expect(WrapperTable.prop('scroll')).toEqual(field0.scroll)
    expect(WrapperTable.prop('dataSource')).toEqual(expect.any(Array))
    const mockRow = { key: 'sadfdsa' }
    // @ts-ignore
    expect(WrapperTable.prop('rowKey')(mockRow)).toEqual(mockRow.key)

    // @ts-ignore
    const _columns = WrapperTableEditor0Instance.renderColumns(
      field0.columns,
      field0.actionColumn
    )

    // @ts-ignore
    const columns: any[] = WrapperTable.prop('columns')

    expect(columns).toHaveLength(_columns.length)

    for (let i = 0; i < _columns.lenght; i++) {
      const item = columns[i]
      const _item = _columns[i]
      expect(item).toEqual(
        expect.objectContaining({
          title: _item.title,
          dataIndex: _item.dataIndex,
          width: _item.width,
          render: expect.any(Function),
        })
      )
    }

    expect(WrapperTable.prop('bordered')).toEqual(true)
    expect(WrapperTable.prop('defaultExpandAllRows')).toEqual(true)
    expect(WrapperTable.prop('expandIcon')).toEqual(undefined)
    expect(WrapperTable.prop('pagination')).toEqual(false)
    expect(WrapperTable.prop('rowClassName')).toEqual(expect.any(Function))
  })

  test('HtModalEditForm', () => {
    // @ts-ignore
    const HtModalEditForm = WrapperTableEditor0Instance.HtModalEditForm
  })
  test('HtModalAddForm', () => {})
  test('onEditBtnClick', () => {})
  test('onAddBtnClick', () => {})
  test('onAddChildrenBtnClick', () => {})
  test('onEditModalOk', () => {})
  test('onAddModalOk', () => {})
  test('toggleModalEditForm', () => {})
  test('toggleModalAddForm', () => {})
  test('renderEditForm', () => {})
  test('renderAddForm', () => {})
  test('renderColumns', () => {})
})
