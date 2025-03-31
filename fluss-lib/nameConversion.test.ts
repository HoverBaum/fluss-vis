import { expect, test } from 'vitest'
import {
  stepToValidIdentifier,
  stringToValidIdentifier,
} from './nameConversion'

test('stringToValidIdentifier', () => {
  expect(stringToValidIdentifier('')).toBe('')
  expect(stringToValidIdentifier('abc')).toBe('abc')
  expect(stringToValidIdentifier('abc def')).toBe('abcDef')
  expect(stringToValidIdentifier('abc-def')).toBe('abcDef')
  expect(stringToValidIdentifier('abc-def_')).toBe('abcDef_')
  expect(stringToValidIdentifier('abc-def_123')).toBe('abcDef_123')
  expect(stringToValidIdentifier('123abc')).toBe('_123abc')
  expect(stringToValidIdentifier('emoji✨')).toBe('emoji')
  expect(stringToValidIdentifier('emoji🎉')).toBe('emoji')
})

test('stepToValidIdentifier', () => {
  expect(stepToValidIdentifier({ id: '123', name: 'My Step' })).toBe(
    'myStep_123'
  )
  expect(stepToValidIdentifier({ id: '123', name: 'My Step 2' })).toBe(
    'myStep2_123'
  )
  expect(stepToValidIdentifier({ id: '123', name: '' })).toBe('_123')
})
