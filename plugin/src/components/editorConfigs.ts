import _ from 'lodash'
import HtButton from '~/components/Button/__editor__'
import HtCard from '~/components/Card/__editor__'
import HtGuiContainer from '~/components/Container/__editor__'
import HtDivider from '~/components/Divider/__editor__'
import HtField from '~/components/Field/__editor__'
import HtForm from '~/components/Form/__editor__'
import HtListActionColumn from '~/components/List/components/ActionColumn/__editor__'
import HtListColumn from '~/components/List/components/Column/__editor__'
import HtList from '~/components/List/__editor__'
import HtModalForm from '~/components/ModalForm/__editor__'
import HtTabs from '~/components/Tabs/__editor__'
import { Editor, JsonSchema } from '~/types'
import { checkEditorConfigValid } from '~/utils/valid'

export let editConfigMap: Partial<Editor.EditConfigMap> = {
  HtButton,
  HtCard,
  HtDivider,
  HtGuiContainer,
  HtForm,
  HtList,
  HtTabs,
  HtModalForm,
  'HtList.column': HtListColumn,
  'HtList.actionColumn': HtListActionColumn,
  ...HtField,
}

window.$$editConfigMap = editConfigMap

// 允许的页面容器类型
export let allowContainers: string[] = [
  'HtGuiContainer',
  'HtCard',
  'HtDivider',
  'HtTabs',
  'HtForm',
  'HtList',
  'HtModalForm',
]

export function addEditConfig(
  name: string,
  config: Editor.ComponentEditConfig
) {
  _.set(editConfigMap, name, config)
}

/**
 * 注册自定义编辑器配置
 * @param map
 */
export function addEditConfigMap(map: JsonSchema.DynamicObject) {
  for (let key in map) {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      // @ts-ignore
      let C = map[key]
      let editorConfig = _.get(map, [key, '__editor__'])

      if (
        !_.get(editConfigMap, [key]) &&
        checkEditorConfigValid(editorConfig)
      ) {
        addEditConfig(key, editorConfig)
        let isContainer = _.get(map, [key, '__isContainer__'])
        if (isContainer) {
          allowContainers.push(key)
        }
      }
    }
  }
}

/**
 * 判断是否为有效的组件类型
 * @param v
 */
export function isValidComponentType(v: string): v is Editor.ComponentType {
  return _.get(editConfigMap, v) !== undefined
}
