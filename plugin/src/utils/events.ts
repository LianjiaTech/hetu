import mitt from 'mitt'

export let EventHandlerMap = {}

export const emitter = mitt(EventHandlerMap)
