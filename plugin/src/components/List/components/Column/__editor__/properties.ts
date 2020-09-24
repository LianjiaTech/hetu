/* eslint-disable no-template-curly-in-string */
import { Editor, JsonSchema } from '~/types/index'
import ActionColumn from '../../ActionColumn/__editor__/properties'
import ActionColumn_new from '../../ActionColumn2/__editor__/properties'

let a = (formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  let renderTypeOperationsProps = {}
  let filterOptions = {}

  if (formData.renderType === 'operations') {
    renderTypeOperationsProps = ActionColumn(formData)
  }

  if (formData.renderType === 'operations_new') {
    renderTypeOperationsProps = ActionColumn_new(formData)
  }

  if (formData.renderType === 'switch') {
    renderTypeOperationsProps = {
      checkedChildren: {
        title: '开启文案',
        type: 'string',
        defaultValue: '开',
      },
      unCheckedChildren: {
        title: '关闭文案',
        type: 'string',
        defaultValue: '关',
      },
      url: {
        title: '接口地址',
        type: 'string',
      },
      method: {
        title: '请求方法',
        type: 'enum',
        enumList: ['get', 'post'],
        enumDescriptionList: ['get', 'post'],
        defaultValue: 'post',
      },
      transform: {
        title: '数据转换',
        doc: '',
        demo: `
        用法示例: <span class="g-js-block"><%:= row => ({...row}) %></span> <br/> 
        <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
        <p class="g-js-row">2. <span class="g-js-block">row => ({...row})</span> 是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a> </p>
        <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">row</span> 是当前行数据, 函数需要返回处理后的数据</p> `,
        type: 'string',
        defaultValue: '<%:= row => ({ ...row }) %>',
      },
    }
  }

  if (formData.renderType === 'a') {
    renderTypeOperationsProps = {
      text: {
        title: '按钮名称',
        type: 'string',
        defaultValue: '预览',
      },
    }
  }

  if (formData.renderType === 'customize') {
    renderTypeOperationsProps = {
      customRender: {
        title: '自定义渲染',
        demo: `
          使用说明:
          <p class="g-js-row"><span class="g-js-block"><%:= (text, row) =>  text %></span></p>
          <p class="g-js-row">1. 第一个参数<span class="g-js-block">text</span> 是当前行所在列的值</p>
          <p class="g-js-row">2. 第二个参数<span class="g-js-block">row</span> 是当前行的所有数据</p>
          <p class="g-js-row">3. 函数接受一个返回值, 可以为javascript基本类型, 也可为html片段</p>
        `,
        desc: '',
        type: 'string',
        height: '120',
        defaultValue: '<%:= (text, row) =>  text %>',
      },
    }
  }

  if (formData.renderType === 'enumeration') {
    renderTypeOperationsProps = {
      options: {
        title: '枚举选项',
        type: 'arrayOf',
        defaultValue: [],
        properties: {
          label: {
            title: '显示值',
            type: 'string',
          },
          value: {
            title: '真实值',
            type: 'string',
            demo:
              '不同数据类型的写法: <p class="g-js-row">1. 字符串 <span class="g-js-block">1234</span></p><p class="g-js-row">2. 数字 <span class="g-js-block"><%:= 1234 %></span></p><p class="g-js-row">3. 布尔 <span class="g-js-block"><%:= true %></span></p><p class="g-js-row">注意⚠️: 非字符串类型, 需要用模版变量语法 <span class="g-js-block"><%:= %></span></p>',
          },
          color: {
            title: '颜色',
            type: 'enum',
            enumList: ['red', 'orange', 'green', 'blue', 'gray', 'white'],
            enumDescriptionList: ['red', 'orange', 'green', 'blue', 'gray', ''],
          },
        },
      },
    }
  }

  if (formData.filterColumns) {
    filterOptions = {
      filterOptions: {
        title: 'filtersValue选项',
        type: 'arrayOf',
        defaultValue: [],
        properties: {
          text: {
            title: '显示值',
            type: 'string',
          },
          value: {
            title: '真实值',
            type: 'string',
            demo:
              '不同数据类型的写法: <p class="g-js-row">1. 字符串 <span class="g-js-block">1234</span></p><p class="g-js-row">2. 数字 <span class="g-js-block"><%:= 1234 %></span></p><p class="g-js-row">3. 布尔 <span class="g-js-block"><%:= true %></span></p><p class="g-js-row">注意⚠️: 非字符串类型, 需要用模版变量语法 <span class="g-js-block"><%:= %></span></p>',
          },
        },
      },
    }
  }
  return {
    title: {
      title: '标题',
      type: 'string',
      defaultValue: '标题',
    },
    dataIndex: {
      visible: !['operations', 'operations_new'].includes(formData.renderType),
      title: '字段',
      type: 'string',
    },
    width: {
      title: '宽度',
      type: 'number',
    },
    tooltip: {
      visible: !['operations', 'operations_new'].includes(formData.renderType),
      title: '字段说明',
      type: 'string',
      defaultValue: '',
    },
    renderType: {
      visible: !['operations', 'operations_new'].includes(formData.renderType),
      title: '类型',
      type: 'enum',
      demo: `
        <p clas="g-js-row">用法说明</p>
        <p clas="g-js-row">1. <span class="g-js-block">开关</span> 用于发送请求, 更新列表中某一条数据, 某一个字段的值</p>
        <p clas="g-js-row">2. <span class="g-js-block">枚举</span> 用于枚举字段转义, 例如返回城市字段的值为10000, 需要转换为北京</p>
        <p clas="g-js-row">3. <span class="g-js-block">自定义</span> 用于渲染自定义html片段</p>
      `,
      enumList: [
        'default',
        'a',
        'img',
        'switch',
        'time',
        'date',
        'enumeration',
        'customize',
      ],
      enumDescriptionList: [
        '文字',
        '链接',
        '图片',
        '开关',
        '时间',
        '日期',
        '枚举',
        '自定义',
      ],
      defaultValue: 'default',
    },
    // 列操作属性
    ...renderTypeOperationsProps,
    showOverflowTooltip: {
      visible:
        formData.width > 0 &&
        !['operations', 'operations_new'].includes(formData.renderType),
      title: '超宽隐藏',
      type: 'bool',
      defaultValue: false,
    },
    sort: {
      visible: !['operations', 'operations_new'].includes(formData.renderType),
      title: '开启排序',
      type: 'bool',
      defaultValue: false,
    },
    filterColumns: {
      visible: !['operations', 'operations_new'].includes(formData.renderType),
      title: '开启筛选',
      type: 'bool',
      defaultValue: false,
    },
    ...filterOptions,
    'v-if': {
      title: '是否显示',
      showTooltip: true,
      desc: '',
      demo: `
        <p class="g-js-row">用法1: <span class="g-js-block"><%:= row => true %></span></p>
        <p class="g-js-row">隐藏某一行当前字段的数据, 与某一行数据有关</p>
        <p class="g-js-row">1. <span class="g-js-block">row => true</span> 是一个箭头函数 </p>
        <p class="g-js-row">2. <span class="g-js-block">row</span> 是当前行的数据</p>
        <p class="g-js-row">3. 函数必须返回 <span class="g-js-block">true</span>或<span class="g-js-block">false</span>, 其他类型 <span class="g-js-block">0 undefined null <span> 都不可以 </p><br/>
        
        <p class="g-js-row">用法2: <span class="g-js-block"><%:= $$HtList.type === 'aaa' %></span></p>
        <p class="g-js-row">隐藏整列的数据, 与某一行数据无关, 可动态展示某列</p>
        <p class="g-js-row">1. <span class="g-js-block"><%:=  %></span> 内部的表达式的值必须全等于布尔(boolean)值 </p>
        <p class="g-js-row">2. 与用法1的区别是, 一个是函数, 一个是布尔(boolean)值</p>
      `,
      type: 'string',
      defaultValue: '<%:= row => true %>',
    },
  }
}

export default a
