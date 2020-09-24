/* eslint-disable no-template-curly-in-string */
import { Editor } from '~/types'
/**
 * 提供常用属性定义
 */
export const type: Editor.BasePropertyConfig = {
  title: '组件类型',
  type: 'string',
  isEditable: false,
  defaultValue: 'Input',
}

export const field: Editor.BasePropertyConfig = {
  title: '表单字段',
  type: 'string',
  defaultValue: 'key-1',
}

export const title: Editor.BasePropertyConfig = {
  title: '字段名称',
  type: 'string',
  defaultValue: '属性',
}

export const tooltip: Editor.BasePropertyConfig = {
  title: '字段说明',
  type: 'string',
  defaultValue: '',
}

export const extra: Editor.BasePropertyConfig = {
  title: '字段说明',
  type: 'string',
  defaultValue: '',
}

export const disabled: Editor.BasePropertyConfig = {
  title: '是否禁用',
  type: 'bool',
  defaultValue: false,
}

export const required: Editor.BasePropertyConfig = {
  title: '是否必填',
  type: 'bool',
  defaultValue: false,
}

export const placeholder: Editor.BasePropertyConfig = {
  title: '引导文字',
  type: 'string',
  defaultValue: '',
}

export const defaultValue: Editor.BasePropertyConfig = {
  title: '默认值',
  type: 'string',
}

export const visible: Editor.BasePropertyConfig = {
  title: '是否显示',
  desc: '动态控制表单的显示/隐藏',
  type: 'string',
  group: 'extend',
  defaultValue: '<%:= true %>',
}

export const rules: Editor.BasePropertyConfig = {
  title: '表单检验',
  type: 'arrayOf',
  group: 'extend',
  arrayItemProperty(_columnIndex: number, _currentValue: any, _allValues: any) {
    return {
      type: {
        title: '检验类型',
        type: 'enum',
        enumList: [
          'number',
          'chinese',
          'english',
          'url',
          'email',
          'phone',
          'IDCard',
          'date',
          'custom',
        ],
        enumDescriptionList: [
          '匹配数字',
          '匹配中文',
          '匹配英文',
          '匹配链接url',
          '匹配邮箱email',
          '匹配手机号',
          '匹配身份证号',
          '匹配日期YYYY-MM-DD',
          '自定义',
        ],
      },
      patternStr2: {
        visible: _currentValue.type === 'custom',
        title: '表达式',
        desc: '填写正则表达式, 请先保证正则表达式的正确性',
        type: 'string',
      },
      message: {
        title: '错误提示',
        type: 'string',
      },
    }
  },
}

export const onChangeRequests: Editor.BasePropertyConfig = {
  title: '[变化时] 请求数据',
  desc: '当前字段值变化时,请求数据',
  doc: '',
  type: 'arrayOf',
  defaultValue: [],
  properties: {
    event: {
      title: '触发条件',
      desc: '',
      type: 'enum',
      defaultValue: 'onChange',
      enumList: ['onChange', 'onBlur'],
      enumDescriptionList: ['产生变化', '失去焦点'],
    },
    alias: {
      title: 'alias',
      showTooltip: true,
      desc: '',
      demo: `
        <p class="g-js-row">1. 设置到数据中心的别名(例如, <span class="g-js-block">cityOptions</span> )</p>
        <p class="g-js-row">2. 后面可通过 <span class="g-js-block"><%:= cityOptions %></span> 用来获取数据</p>
      `,
      type: 'string',
    },
    url: {
      title: '请求地址',
      type: 'string',
    },
    method: {
      title: '请求方法',
      type: 'enum',
      defaultValue: 'get',
      enumList: ['get', 'post'],
      enumDescriptionList: ['get', 'post'],
    },
    params: {
      title: '附加参数',
      type: 'json',
      demo: `
        使用示例: 
        <p class="g-js-row">1.使用浏览器url中的查询参数<pre class="g-js-block">${JSON.stringify(
          { id: '<%:= location.query.id %>' },
          null,
          2
        )}</pre></p>
        <p class="g-js-row">2.使用数据中心的变量<pre class="g-js-block">${JSON.stringify(
          { ucid: '<%:= userInfo.id %>' },
          null,
          2
        )}</pre></p>
        <p class="g-js-row">3.使用其他表单项的值<pre class="g-js-block">${JSON.stringify(
          { xxx: '<%:= $$HtForm.type %>' },
          null,
          2
        )}</pre>
          <span class="g-js-block">$$HtForm</span> 是表单全部值的别名;<br/>
          <span class="g-js-block">$$HtForm.type</span> 是字段为type的值
      </p>
      `,
      height: 100,
      defaultValue: {},
    },
    transform: {
      title: '接口返回数据格式转换',
      type: 'string',
      demo: `
      <p class="g-js-row">用法示例: <span class="g-js-block"><%:= data => ({...data}) %></span> </p>
      <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
      <p class="g-js-row">2. <span class="g-js-block">data => ({...data})</span> 是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a>, 相当于 <span class="g-js-block">function(data){ return {...data} }</span> </p>
      <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">data</span> 是请求响应值, 函数需要返回处理后的数据</p>
      `,
      defaultValue: '<%:= data => data %>',
    },
  },
  group: 'extend',
}

export const setFieldValues: Editor.BasePropertyConfig = {
  title: '[变化时] 更新其他字段的值',
  desc: '当前字段值变化时,更新其他字段值',
  doc: '',
  type: 'arrayOf',
  defaultValue: [],
  properties: {
    event: {
      title: '触发条件',
      desc: '',
      type: 'enum',
      defaultValue: 'onChange',
      enumList: ['onChange', 'onBlur'],
      enumDescriptionList: ['产生变化', '失去焦点'],
    },
    field: {
      title: '待更新字段',
      type: 'string',
    },
    value: {
      title: '待更新的值',
      desc: '',
      type: 'string',
      demo: `
        <p class="g-js-row">用法示例: <span class="g-js-block"><%:= (changeVal, posts) => changeVal %></span> </p>
        <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
        <p class="g-js-row">2. <span class="g-js-block"> (changeVal, posts) => changeVal </span> 是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a>, 相当于 <span class="g-js-block">function(data){ return {...data} }</span> </p>
        <p class="g-js-row">3. 函数第1个参数 <span class="g-js-block">changeVal</span> 是当前表单变化后的值</p>
        <p class="g-js-row">4. 函数第2个参数 <span class="g-js-block">posts</span> 是一个数组, 对应上一项配置<span class="g-js-strong">[变化时] 请求数据(onChangeRequests)</span>的返回值 </p>
        <p class="g-js-row">5. 函数返回值, 将作为<span class="g-js-strong">待更新字段</span>的值</p>
        `,
      defaultValue: '<%:= (changeVal, posts) => changeVal %>',
    },
  },
  group: 'extend',
}

export const triggerOnChanges: Editor.BasePropertyConfig = {
  title: '[变化时] 触发事件',
  desc: '当前字段值变化时,触发事件',
  doc: '',
  type: 'arrayOf',
  defaultValue: [],
  properties: {
    event: {
      title: '触发条件',
      desc: '',
      type: 'enum',
      defaultValue: 'onChange',
      enumList: ['onChange', 'onBlur'],
      enumDescriptionList: ['产生变化', '失去焦点'],
    },
    triggerName: {
      title: '联动事件名',
      type: 'enum',
      defaultValue: 'HtList.search',
      enumList: ['HtList.search', 'HtList.resetSearch'],
      enumDescriptionList: ['HtList.search', 'HtList.resetSearch'],
    },
  },
  group: 'extend',
}

export const colProps: Editor.BasePropertyConfig = {
  title: '栅格布局',
  type: 'object',
  properties: {
    span: {
      title: '栅格格数',
      desc: '共24列',
      type: 'number',
    },
    offset: {
      title: '左侧间隔格数',
      desc: '0-24之间',
      type: 'number',
    },
    push: {
      title: '右移格数',
      desc: '0-24之间',
      type: 'number',
    },
    pull: {
      title: '左移格数',
      desc: '0-24之间',
      type: 'number',
    },
    order: {
      title: '顺序',
      desc: '1-100, 值越小, 越靠前',
      type: 'number',
    },
  },
  group: 'extend',
}

export const labelField: Editor.BasePropertyConfig = {
  title: '显示字段',
  desc: '可选项option用于显示的字段',
  type: 'string',
  defaultValue: 'label',
}

export const valueField: Editor.BasePropertyConfig = {
  title: '提交字段',
  desc: '可选项option用于提交的字段(不能为key)',
  showTooltip: true,
  type: 'string',
  defaultValue: 'value',
}
