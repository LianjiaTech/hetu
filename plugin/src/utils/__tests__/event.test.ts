import { EventHandlerMap, emitter } from '../events'

describe('events', () => {
  const eventName = 'testEventName1234'
  const eventHandle = jest.fn()
  const eventParams = 'dsajfhajsdfhkjsadf'
  emitter.on(eventName, eventHandle)

  it(`EventHandlerMap has event:${eventName}`, () => {
    expect(EventHandlerMap).toHaveProperty(
      eventName,
      expect.arrayContaining([eventHandle])
    )
  })

  it(`emit event:${eventName}`, () => {
    emitter.emit(eventName, eventParams)

    expect(eventHandle).toBeCalledWith(eventParams)
  })

  it(`off event:${eventName}`, () => {
    emitter.off(eventName, eventHandle)

    expect(EventHandlerMap).not.toHaveProperty(
      eventName,
      expect.arrayContaining([eventHandle])
    )
  })
})
