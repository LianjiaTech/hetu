export function sleep(timeout?: number) {
  jest.useRealTimers()
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}
