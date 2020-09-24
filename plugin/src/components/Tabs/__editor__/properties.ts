import { Editor } from '~/types'

let a: Editor.BaseProperties = {
  tabsType: {
    title: '标签类型',
    type: 'enum',
    enumList: ['line', 'card'],
    enumDescriptionList: ['line', 'card'],
    defaultValue: 'line',
  },
  defaultActiveKey: {
    title: '默认标签',
    type: 'string',
  },
  tabs: {
    title: '标签选项',
    type: 'arrayOf',
    properties: {
      title: {
        title: '标题',
        type: 'string',
      },
      value: {
        title: '真实值',
        type: 'string',
        demo:
          '不同数据类型的写法: <p class="g-js-row">1. 字符串 <span class="g-js-block">1234</span></p><p class="g-js-row">2. 数字 <span class="g-js-block"><%:= 1234 %></span></p><p class="g-js-row">3. 布尔 <span class="g-js-block"><%:= true %></span></p><p class="g-js-row">注意⚠️: 非字符串类型, 需要用模版变量语法 <span class="g-js-block"><%:= %></span></p>',
      },
      disabled: {
        title: '是否禁用',
        type: 'bool',
        defaultValue: false,
      },
      showIndexs: {
        title: 'showIndexs',
        desc: '当前标签选中时, 显示哪些子节点, 默认显示全部',
        showTooltip: true,
        type: 'json',
        defaultValue: [],
      },
    },
  },
}

export default a
