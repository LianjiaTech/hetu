/* eslint-disable no-template-curly-in-string */
import { Editor } from '~/types'
import HtButton from '~/components/Button/__editor__/defaultConfig'
import HtModalForm from '~/components/ModalForm/__editor__/defaultConfig'
import HtList from '~/components/List/__editor__/defaultConfig'
import HtForm from '~/components/Form/__editor__/defaultConfig'
import HtGuiContainer from '~/components/Container/__editor__/defaultConfig'
import HtCard from '~/components/Card/__editor__/defaultConfig'

const config: Editor.AdditableProperties = {
  extra: {
    title: '右上角按钮',
    options: [
      {
        label: '页面跳转',
        icon: 'border',
        value: HtButton,
      },
      {
        label: '表单弹框',
        icon: 'alert',
        value: HtModalForm,
      },
    ],
  },
  content: {
    title: '内容',
    options: [
      {
        label: '列表页',
        icon: 'ordered-list',
        value: HtList,
      },
      {
        label: '表单页',
        icon: 'form',
        value: HtForm,
      },
      {
        label: '容器组件',
        icon: 'form',
        value: HtGuiContainer,
      },
      {
        label: '卡片',
        icon: 'form',
        value: HtCard,
      },
    ],
  },
}

export default config
