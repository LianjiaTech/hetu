import {
  evalJavascript,
  componentAliasMap,
  updateComponentAlias,
  getLabelByValue,
} from '../index'
import { JsonSchema } from '~/types/jsonSchema'

// @ts-ignore
const pagestate: JsonSchema.Pagestate = { a: 123, b: 'abc' }

test('updateComponentAlias', () => {
  const testAlias = 'teadfkfjasdf'
  const testValue = { aaa: 1 }
  expect(componentAliasMap).not.toHaveProperty(testAlias)
  updateComponentAlias(testAlias, testValue)
  expect(componentAliasMap).toHaveProperty(testAlias, testValue)
})

test('getLabelByValue', () => {
  const options = [
    {
      id: 111,
      name: '你好中国',
    },
    {
      id: 222,
      name: '你好啊中国',
    },
  ]
  const res1 = getLabelByValue(111, options, 'name', 'id')
  const res2 = getLabelByValue(222, options, 'name', 'id')

  expect(res1).toEqual('你好中国')
  expect(res2).toEqual('你好啊中国')
})

it('evalJavascript', () => {
  const expression = 'a + 1'
  const scope = {
    a: 2,
  }
  expect(evalJavascript(expression, scope)).toBe(3)
})
