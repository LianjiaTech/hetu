import { Editor } from '~/types'
import additableProperties from './additableProperties'
import properties from './properties'

const config: Editor.ComponentEditConfig = {
  additableProperties,
  selectedButtons: ['move', 'delete'],
  guiProperties: properties,
}

export default config
