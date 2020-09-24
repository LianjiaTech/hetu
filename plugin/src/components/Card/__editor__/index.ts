import { Editor } from '~/types'
import additableProperties from './additableProperties'
import properties from './properties'

const config: Editor.ComponentEditConfig = {
  selectedButtons: ['delete', 'move'],
  additableProperties,
  guiProperties: properties,
}

export default config
