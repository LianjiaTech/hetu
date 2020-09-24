import { versionCompare } from '~/src/library/utils/modules/util'

export const asyncIdMap = new Map()
export const contextMap = new Map()

const hook: any = {
  init(asyncId: string, type: string, triggerAsyncId: string) {
    const ctxSymbol = asyncIdMap.get(triggerAsyncId)
    if (ctxSymbol !== undefined) asyncIdMap.set(asyncId, ctxSymbol)
  },
  destroy(asyncId: string) {
    asyncIdMap.delete(asyncId)
  },
}

export let executionAsyncId: any = () => null
// node 8+
;(async () => {
  if (versionCompare(process.version, '>=', '8.2.0')) {
    const async_hooks = await import('async_hooks')
    async_hooks.createHook(hook).enable()
    executionAsyncId = () => async_hooks.executionAsyncId()
  }
})()

Object.assign(global, {
  __unstable__getContext() {
    const asyncId = executionAsyncId()
    if (asyncId === null) return null
    const ctxSymbol = asyncIdMap.get(asyncId)
    if (ctxSymbol === undefined) return null
    const ctx = contextMap.get(ctxSymbol)
    if (ctx === undefined) return null
    return ctx
  },
})
