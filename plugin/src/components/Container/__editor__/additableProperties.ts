import { Editor } from '~/types'

import HtGuiContainer from './defaultConfig'
import HtList from '~/components/List/__editor__/defaultConfig'
import HtForm from '~/components/Form/__editor__/defaultConfig'
import HtTabs from '~/components/Tabs/__editor__/defaultConfig'
import HtDivider from '~/components/Divider/__editor__/defaultConfig'
import HtCard from '~/components/Card/__editor__/defaultConfig'
// import HtSteps from '~/components/Steps/__editor__/defaultConfig'

const config: Editor.AdditableProperties = {
  children: {
    title: '通用组件',
    options: [
      {
        label: '列表组件',
        icon: 'ordered-list',
        value: HtList,
      },
      {
        label: '表单组件',
        icon: 'form',
        value: HtForm,
      },
      {
        label: '容器组件',
        icon: 'form',
        value: HtGuiContainer,
      },
      {
        label: 'Tab组件',
        icon: 'form',
        value: HtTabs,
      },
      {
        label: '卡片',
        icon: 'form',
        value: HtCard,
      },
      // {
      //   label: '步骤',
      //   icon: 'form',
      //   value: HtSteps,
      // },
      {
        label: '分隔线',
        icon: 'form',
        value: HtDivider,
      },
    ],
  },
}

export default config
