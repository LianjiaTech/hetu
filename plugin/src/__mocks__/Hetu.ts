import { observable } from 'mobx'
import { resolveLocal, generateHash } from '~/utils/hetuTools'
import { Hetu as OriginHetu, pagestateCache } from '../Hetu'
import _ from 'lodash'

export { pagestateCache }

const dataConfigFields = [
  'uniqueKey',
  'local',
  'remote',
  'dependencies',
  'title',
]
export class Hetu extends OriginHetu {
  constructor(props: any) {
    super(props)

    const { title, local, remote, dependencies, history } = props

    // 添加全局属性
    let pagestate = this.addGlobalAttribute(
      { title, local, remote, dependencies },
      history
    )

    if (local) {
      // 解析 local
      pagestate = resolveLocal(local, pagestate)
    }

    let hash = generateHash(JSON.stringify(_.pick(props, dataConfigFields)))

    pagestateCache[hash] = observable(pagestate)

    this.state = {
      hash,
      isPageInit: true,
      isPageNotFound: false,
      isPageParseError: false,
    }
  }
}
