import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import {
  FieldComponentType,
  FieldType,
} from '~/components/Field/types/interface'
import { Editor, JsonSchema } from '~/types'

const excludeFieldsMap = {
  'v-if': 1,
  type: 1,
  field: 1,
  tooltip: 1,
  placeholder: 1,
  colProps: 1,
  onChangeRequests: 1,
  setFieldValues: 1,
  triggerOnChanges: 1,
}

type excludeFields = Exclude<
  Editor.BaseProperties,
  keyof typeof excludeFieldsMap
>

/**
 * 获取属性声明配置
 * @param type
 */
function getProperties(
  type: FieldType = 'Input',
  formData: JsonSchema.DynamicObject
): excludeFields | undefined {
  let reg = /^HtField\./
  let _type = reg.test(type) ? type : `HtField.${type}`
  const config = _.get(window.$$editConfigMap, [_type, 'guiProperties'])
  if (_.isFunction(config)) {
    let _config = config(formData)
    return {
      ..._.omit(_config, Object.keys(excludeFieldsMap)),
      ..._.pick(_config, [
        'colProps',
        'onChangeRequests',
        'setFieldValues',
        'triggerOnChanges',
      ]),
    }
  }

  if (config) {
    return {
      ..._.omit(config, Object.keys(excludeFieldsMap)),
      ..._.pick(config, [
        'colProps',
        'onChangeRequests',
        'setFieldValues',
        'triggerOnChanges',
      ]),
    }
  }
  return undefined
}

const _BaseProperty = _.cloneDeep(BaseProperty)

const defaultValue = [
  {
    path: '/aaa/bbb',
    name: '一级菜单',
    icon: 'hdd',
    disabled: 0,
    children: [
      {
        path: '/aaa/bbb/ccc',
        name: '二级菜单',
        disabled: 1,
        icon: 'user',
      },
    ],
  },
]

export default (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  let otherProps: any = {}
  otherProps.defaultValue = {
    title: '默认值',
    type: 'json',
    demo: `
      数据格式示例: 
      <p class="g-js-row"><pre class="g-js-block">${JSON.stringify(
        defaultValue,
        null,
        2
      )}</pre></p>
      <p class="g-js-row">1. 字段<span class="g-js-block">path name icon disabled</span> 均是动态的, 对应列的字段</p>
      <p class="g-js-row">2. 字段<span class="g-js-block">children</span> 为子一级数据, 最多支持2级</p>
    `,
  }
  return {
    ..._.omit(_BaseProperty, ['placeholder']),
    ...otherProps,
    canAdd: {
      title: '允许添加节点',
      type: 'bool',
      defaultValue: true,
    },
    canAddChildren: {
      title: '允许添加子节点',
      type: 'bool',
      defaultValue: false,
    },
    canDelete: {
      title: '允许删除',
      type: 'bool',
      defaultValue: true,
    },
    columns: {
      title: '表格列',
      type: 'arrayOf',
      arrayItemProperty(
        _columnIndex: number,
        currentValue: any,
        _allValues: any
      ) {
        return {
          title: {
            title: '列标题',
            type: 'string',
          },
          dataIndex: {
            title: '列字段',
            type: 'string',
          },
          width: {
            title: '列宽度',
            type: 'string',
            placeholder: '10%',
          },
          type: {
            title: '展示类型',
            type: 'enum',
            defaultValue: 'Input',
            enumList: FieldComponentType,
            enumDescriptionList: FieldComponentType,
          },
          ...getProperties(currentValue.type, currentValue),
          visible: {
            title: '列数据是否显示',
            desc: '',
            demo: `
            <p class="g-js-row">用法: <span class="g-js-block"><%:= (text,row) => true %></span></p>
            <p class="g-js-row">隐藏某一行当前字段的数据</p>
            <p class="g-js-row">1. <span class="g-js-block">(text,row) => true</span> 是一个箭头函数 </p>
            <p class="g-js-row">2. <span class="g-js-block">text</span> 是当前字段的值</p>
            <p class="g-js-row">3. <span class="g-js-block">row</span> 是当前行的数据集合</p>
            <p class="g-js-row">4. 函数必须返回 <span class="g-js-block">true</span>或<span class="g-js-block">false</span>, 其他类型 <span class="g-js-block">0 undefined null <span> 都不可以 </p><br/>
            `,
            type: 'string',
            defaultValue: '<%:= (text, row) => true %>',
          },
          'v-if': {
            title: '表单项是否显示',
            desc: '',
            demo: `
            <p class="g-js-row">用法示例: <span class="g-js-block"><%:= $$TableEditorForm.field1 !== 'aaa' %></span></p>
            <p class="g-js-row">1. <span class="g-js-block">$$TableEditorForm</span> 是弹框表单的别名 </p>
            <p class="g-js-row">2. <span class="g-js-block">field1</span> 是其中的一个字段</p>
            <p class="g-js-row">3. <span class="g-js-block">$$TableEditorForm.field1 !== 'aaa'</span> 是javascript表达式, 表达式的值必须是true/false</p>
            `,
            type: 'string',
            defaultValue: '<%:= true %>',
          },
        }
      },
    },
  }
}
