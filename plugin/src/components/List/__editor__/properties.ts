/* eslint-disable no-template-curly-in-string */
import QS from 'query-string'
import { Editor, JsonSchema } from '~/types'
import { getProjectFromPath } from '~/utils'

let config = (formDate: JsonSchema.DynamicObject): Editor.BaseProperties => {
  let otherConfigs = {}
  let pageSize = {}
  let pageSizeOptions = {}

  if (formDate.cardType === 'primary') {
    otherConfigs = {
      description: {
        title: '描述内容',
        type: 'string',
      },
    }
  }

  if (formDate.isPagination !== false) {
    // 如果展示分页就显示分页条数和分页选项
    pageSize = {
      pageSize: {
        title: '分页条数',
        desc: '每一页展示的数据量',
        defaultValue: 20,
        type: 'number',
        group: 'default',
      },
    }
    pageSizeOptions = {
      pageSizeOptions: {
        title: '分页选项',
        type: 'json',
        defaultValue: ['10', '20', '50', '100', '500', '1000'],
        group: 'default',
      },
    }
  }

  const { route } = QS.parse(window.location.search)
  const projectCode = getProjectFromPath(route as string)

  return {
    url: {
      title: '接口地址',
      demo: `
        接口格式
        <p class="g-js-row">1. 以项目唯一标识 <span class="g-js-block">/${projectCode}</span> 作为前缀, 使用相对路径</p>
        <p class="g-js-row">2. 可以使用其他项目的唯一标识 </p>
        <p class="g-js-row">3. 打开 <a href="${window.location.origin}/__log__?projectCode=${projectCode}" target="_blank">debug工具</a>调试接口</p>
      `,
      defaultValue: '',
      type: 'string',
      group: 'default',
    },
    uniqueKey: {
      title: '表格主键',
      desc: '编辑/删除等操作都是使用这个字段',
      showTooltip: true,
      defaultValue: 'id',
      type: 'string',
      group: 'default',
    },

    isAutoSubmit: {
      title: '自动搜索',
      desc: '第一次访问页面时, 自动搜索一次',
      defaultValue: true,
      type: 'bool',
      group: 'default',
    },
    columnsSetting: {
      title: '表头筛选',
      type: 'bool',
      defaultValue: false,
    },
    isPagination: {
      title: '展示分页',
      type: 'bool',
      defaultValue: true,
    },
    ...pageSize,
    ...pageSizeOptions,
    scrollWidth: {
      title: '表格宽度',
      desc: '单位px, 超出这个宽度会出现滚动条',
      type: 'number',
    },
    method: {
      title: '请求方法',
      type: 'enum',
      defaultValue: 'get',
      enumList: ['get', 'post'],
      enumDescriptionList: ['get', 'post'],
      group: 'default',
    },
    alias: {
      title: '表单值别名',
      desc: '用于获取搜索表单的字段',
      defaultValue: '$$HtList',
      type: 'string',
      group: 'default',
    },
    buttons: {
      title: '表单按钮',
      desc: '',
      showTooltip: true,
      type: 'enum',
      mode: 'multiple',
      defaultValue: ['back', 'submit'],
      enumList: ['submit', 'back', 'reset', 'download'],
      enumDescriptionList: ['查询', '返回', '重置', '下载'],
      group: 'default',
    },
    cardType: {
      title: '卡片类型',
      type: 'enum',
      enumList: ['default', 'primary', 'plain'],
      enumDescriptionList: ['default', 'primary', 'plain'],
      defaultValue: 'default',
      group: 'default',
    },
    title: {
      title: '卡片标题',
      desc: '默认为页面标题',
      type: 'string',
    },
    ...otherConfigs,
    transform: {
      title: 'transform',
      demo: ` 
      <p class="g-js-row">用法示例: <span class="g-js-block"><%:=  data => ({...data}) %></span></p>
      <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
      <p class="g-js-row">2. <span class="g-js-block">data => ({...data})</span> 是<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a>, 相当于 <span class="g-js-block">function(data){ return {...data} }</span> </p>
      <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">data</span> 是请求响应值, 函数需要返回处理后的数据 </p>`,
      showTooltip: true,
      type: 'string',
      defaultValue: '<%:=  data => ({ ...data }) %>',
      group: 'default',
    },
    fieldMap: {
      title: '请求/响应字段映射',
      type: 'object',
      properties: {
        pageNumKey: {
          title: 'pageNum',
          desc: '当前页字段',
          defaultValue: 'pageNum',
          type: 'string',
        },
        pageSizeKey: {
          title: 'pageSize',
          desc: '分页大小字段',
          defaultValue: 'pageSize',
          type: 'string',
        },
        listKey: {
          title: 'list',
          desc: '列表数据字段',
          defaultValue: 'list',
          type: 'string',
        },
        totalKey: {
          title: 'total',
          desc: '数据总数字段',
          defaultValue: 'total',
          type: 'string',
        },
      },
    },
    cols: {
      title: '[表单项] 栅栏数',
      desc: '搜索表单一行显示几列',
      defaultValue: 3,
      type: 'number',
      group: 'extend',
    },
    labelCol: {
      title: '[表单项] 标题布局',
      desc: '在这里统一设置表单项的标题布局',
      type: 'object',
      showTooltip: true,
      properties: {
        span: {
          title: '标题宽度',
          type: 'number',
          defaultValue: 6,
        },
        offset: {
          title: '右移距离',
          type: 'number',
          defaultValue: 0,
        },
      },
      group: 'extend',
    },
    wrapperCol: {
      title: '[表单项] 标题布局',
      desc: '在这里统一设置表单项的内容布局',
      type: 'object',
      showTooltip: true,
      properties: {
        span: {
          title: '标题宽度',
          type: 'number',
          defaultValue: 12,
        },
        offset: {
          title: '右移距离',
          type: 'number',
          defaultValue: 0,
        },
      },
      group: 'extend',
    },
    submitButtonText: {
      title: '[按钮文案] submit',
      type: 'string',
      defaultValue: '保存',
      group: 'extend',
    },
    resetButtonText: {
      title: '[按钮文案] reset',
      type: 'string',
      defaultValue: '重置',
      group: 'extend',
    },
    backButtonText: {
      title: '[按钮文案] back',
      type: 'string',
      defaultValue: '返回',
      group: 'extend',
    },
    buttonGroupProps: {
      title: '[按钮组] 栅格布局',
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
      },
      group: 'extend',
    },
  }
}
export default config
