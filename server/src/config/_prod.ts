import fs from 'fs'
import ini from 'ini'
import path from 'path'

const relativePath = `../../../system_config.ini`
const filePath = path.resolve(__dirname, relativePath)

const config: { [key: string]: any } = {}

if (fs.existsSync(filePath)) {
  Object.assign(config, ini.parse(fs.readFileSync(filePath, 'utf-8')))
}

export default config
