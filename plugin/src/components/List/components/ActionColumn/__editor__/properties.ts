/* eslint-disable no-template-curly-in-string */
import QS from 'query-string'
import ModalFormConfig from '~/components/ModalForm/__editor__/properties'
import { Editor, JsonSchema } from '~/types'
import { getProjectFromPath } from '~/utils'

let a = (_formData: JsonSchema.DynamicObject): Editor.BaseProperties => {
  const { route } = QS.parse(window.location.search)
  const projectCode = getProjectFromPath(route as string)

  return {
    width: {
      title: '列宽度',
      type: 'number',
    },
    fixed: {
      title: '固定列',
      type: 'bool',
    },
    operations: {
      title: '列表操作',
      type: 'arrayOf',
      arrayItemProperty(
        _columnIndex: number,
        currentValue: any,
        _allValues: any
      ) {
        return {
          text: {
            title: '按钮名称',
            type: 'string',
          },
          actionType: {
            title: '按钮类型',
            type: 'enum',
            enumList: ['jump', 'open', 'xhr'],
            enumDescriptionList: ['页面内跳转', '打开新页面', '发送http请求'],
            defaultValue: 'jump',
          },
          url: {
            title: '请求地址',
            type: 'string',
            demo: `
            接口格式
            <p class="g-js-row">1. 以项目唯一标识 <span class="g-js-block">/${projectCode}</span> 作为前缀, 使用相对路径</p>
            <p class="g-js-row">2. 可以使用其他项目的唯一标识 </p>
            <p class="g-js-row">3. 打开 <a href="${window.location.origin}/__log__?projectCode=${projectCode}" target="_blank">debug工具</a>调试接口</p>
          `,
          },
          method: {
            visible: currentValue.actionType === 'xhr',
            title: '请求方法',
            type: 'enum',
            defaultValue: 'post',
            enumList: ['get', 'post', 'put', 'patch', 'delete'],
            enumDescriptionList: ['get', 'post', 'put', 'patch', 'delete'],
          },
          transform: {
            title: '数据格式转换',
            doc: '',
            demo: `
            <p class="g-js-row">用法示例: <span class="g-js-block"><%:= row => ({...row}) %></span> </p>
            <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
            <p class="g-js-row">2. <span class="g-js-block">row => ({...row})</span> 是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arrow_functions" target="_blank">es6箭头函数</a>, 相当于 <span class="g-js-block">function(data){ return {...data} }</span> </p>
            <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">row</span> 当前行数据, 函数需要返回处理后的数据</p>
            `,
            type: 'string',
            defaultValue: '<%:= row => ({ ...row }) %>',
          },
          'v-if': {
            title: '是否显示',
            showTooltip: true,
            desc: '',
            demo: `
            <p class="g-js-row">用法: <span class="g-js-block"><%:= row => true %></span></p>
            <p class="g-js-row">隐藏某一行当前字段的数据</p>
            <p class="g-js-row">1. <span class="g-js-block">row => true</span> 是一个箭头函数 </p>
            <p class="g-js-row">2. <span class="g-js-block">row</span> 是当前行的数据</p>
            <p class="g-js-row">3. 函数必须返回 <span class="g-js-block">true</span>或<span class="g-js-block">false</span>, 其他类型 <span class="g-js-block">0 undefined null <span> 都不可以 </p><br/>
            `,
            type: 'string',
            defaultValue: '<%:= row => true %>',
          },
        }
      },
    },
    operations2: {
      title: '弹框编辑',
      desc: '该属性是为了兼容之前到版本.建议跳转到下一个页面, 进行编辑。',
      type: 'arrayOf',
      arrayItemProperty(
        _columnIndex: number,
        _currentValue: any,
        _allValues: any
      ) {
        const _config = ModalFormConfig(_currentValue)

        return {
          ..._config,
          transform: {
            title: '数据格式转换',
            desc: '',
            demo: `
            <p class="g-js-row">用法示例: <span class="g-js-block"><%:= (row, data) => ({...data, bannerId: row.id}) %></span> </p>
            <p class="g-js-row">1. 最外层 <span class="g-js-block"><%:= %></span> 是模版特殊语法, 里面的内容将作为javascript语法片段执行 </p>
            <p class="g-js-row">2. <span class="g-js-block">data => ({...data})</span> 是es6箭头函数</p>
            <p class="g-js-row">3. 函数第一个参数 <span class="g-js-block">row</span> 是当前行数据, 第二个参数 <span class="g-js-block">row</span> 是当前弹框表单的数据, 函数需要返回处理后的数据</p> `,
            type: 'string',
            defaultValue: '<%:= (row, data) => ({  ...row, ...data }) %>',
          },
          'v-if': {
            title: '是否显示',
            desc: '',
            demo: `
            <p class="g-js-row">用法: <span class="g-js-block"><%:= row => true %></span></p>
            <p class="g-js-row">隐藏某一行当前字段的数据</p>
            <p class="g-js-row">1. <span class="g-js-block">row => true</span> 是一个箭头函数 </p>
            <p class="g-js-row">2. <span class="g-js-block">row</span> 是当前行的数据</p>
            <p class="g-js-row">3. 函数必须返回 <span class="g-js-block">true</span>或<span class="g-js-block">false</span>, 其他类型 <span class="g-js-block">0 undefined null <span> 都不可以 </p><br/>
            `,
            type: 'string',
            defaultValue: '<%:= row => true %>',
          },
        }
      },
    },
  }
}
export default a
