import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor } from '~/types'

let a: Editor.BaseProperties = {
  ..._.omit(BaseProperty, ['required', 'disabled', 'defaultValue']),
  defaultValue: {
    title: '默认值',
    type: 'string',
    defaultValue: '<%:= [] %>',
  },
  format: {
    title: '日期格式',
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
  separator: {
    title: '分隔符',
    type: 'string',
    defaultValue: '~',
  },
  ..._.pick(BaseProperty, ['required', 'disabled']),
  showTime: {
    title: '选择时间',
    desc: '增加时间选择功能',
    type: 'bool',
    defaultValue: false,
  },
}

export default a
