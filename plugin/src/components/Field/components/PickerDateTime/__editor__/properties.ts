import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor } from '~/types'

let CommonTimePickerApi: Editor.BaseProperties = {
  ...BaseProperty,
}

let a: Editor.BaseProperties = {
  ..._.omit(CommonTimePickerApi, ['required', 'disabled']),
  format: {
    title: '日期时间格式',
    desc: '',
    demo: `
    <p class="g-js-row">默认值为 <span class="g-js-block">YYYY-MM-DD HH:mm:ss</span></p>   
    格式说明: 
    <p class="g-js-row"><span class="g-js-block">Y</span> 年, 支持YYYY(4位)、YY(2位)</p>
    <p class="g-js-row"><span class="g-js-block">M</span> 月</p>
    <p class="g-js-row"><span class="g-js-block">D</span> 日</p>
    <p class="g-js-row"><span class="g-js-block">H</span> 小时(24小时制)</p>
    <p class="g-js-row"><span class="g-js-block">h</span> 小时(12小时制)</p>
    <p class="g-js-row"><span class="g-js-block">m</span> 分钟</p>
    <p class="g-js-row"><span class="g-js-block">s</span> 秒</p>
    <p class="g-js-row">更多配置, 参考<a href="http://momentjs.cn/docs/" target="_blank">moment.js</a></p>
  `,
    type: 'string',
    defaultValue: 'YYYY-MM-DD HH:mm:ss',
  },
  ..._.pick(CommonTimePickerApi, ['required', 'disabled']),
  showToday: {
    title: '今天',
    desc: '是否展示“今天”按钮',
    type: 'bool',
    defaultValue: true,
  },
  disabledTime: {
    title: '禁选范围',
    desc: '判断时间是否可选, 接收一个date函数, 返回true/false',
    type: 'string',
    defaultValue: '<%:= undefined %>',
  },
}

export default a

export { CommonTimePickerApi }
