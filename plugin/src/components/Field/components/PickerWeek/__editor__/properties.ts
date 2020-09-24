import _ from 'lodash'
import BaseProperty from '~/components/Field/types/baseProperty'
import { Editor } from '~/types'

let a: Editor.BaseProperties = {
  ..._.omit(BaseProperty, ['required', 'disabled']),
  format: {
    title: '时间格式',
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
    defaultValue: 'YYYY-MM-DD WW',
  },
  ..._.pick(BaseProperty, ['required', 'disabled']),
}

export default a
