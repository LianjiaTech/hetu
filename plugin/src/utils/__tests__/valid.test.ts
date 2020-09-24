import { isElementConfig } from '../valid'

describe('valid', () => {
  describe('isElementConfig', () => {
    it('test1', () => {
      const type1 = {
        type: 'aaa',
        props: {},
      }
      expect(isElementConfig(type1)).toBe(true)
    })

    it('test2', () => {
      const type1 = {
        type: 'aaa',
        props: null,
      }
      expect(isElementConfig(type1)).toBe(false)
    })

    it('test3', () => {
      const type1 = {
        type: 'aaa',
        props: [],
      }
      expect(isElementConfig(type1)).toBe(false)
    })
  })
})
