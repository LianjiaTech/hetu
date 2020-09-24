import { Editor } from '~/types'
import additableProperties from './additableProperties'
import properties from './properties'

const config: Editor.ComponentEditConfig = {
  selectedButtons: ['move', 'delete'],
  additableProperties,
  guiProperties: properties,
}

export default config
