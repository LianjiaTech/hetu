import { Editor } from '~/types'
import additableProperties from './additableProperties'
import properties from './properties'

const config: Editor.ComponentEditConfig = {
  selectedButtons: ['add', 'delete'],
  additableProperties,
  guiProperties: properties,
}

export default config
