// Using Deno for test runs, so a .ts extension.
import { Locale, runFluss } from './number-example-10-generated-1.ts'

const baseNumber = 5
const locale: Locale = 'en'

const squareNumber: Parameters<
  typeof runFluss
>[0]['stepFunctions']['squareNumber'] = async ({ baseNumber }) => {
  return baseNumber * baseNumber
}

const createString: Parameters<
  typeof runFluss
>[0]['stepFunctions']['createString'] = async ({ locale, squaredNumber }) => {
  return locale === 'en'
    ? `The squared result is: ${squaredNumber}`
    : `Die Zahl zum Quadrat ist: ${squaredNumber}`
}

const result = await runFluss({
  inputs: {
    baseNumber,
    locale,
  },
  stepFunctions: {
    squareNumber,
    createString,
  },
})

console.log('\nResult:', result)
