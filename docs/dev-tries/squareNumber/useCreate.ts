import { FlussInputs } from './01-edits'
import { createFlussRunner } from './createFlussRunner'

const runner = createFlussRunner<
  object,
  FlussInputs,
  {
    wowOne: (args: { baseNumber: number }) => number
  }
>()

runner({
  inputs: {
    locale: 'en',
    baseNumber: 2,
  },
  stepFunctions: {
    wowOne: (args) => {
      console.log('wowOne', args)
      return args.baseNumber * args.baseNumber
    },
  },
  dependencies: {
    wowOne: [
      {
        sourceStepId: 'start',
        argumentName: 'baseNumber',
        sourceProperty: 'baseNumber',
      },
    ],
    end: [
      {
        sourceStepId: 'wowOne',
        argumentName: 'squaredNumber',
      },
    ],
  },
})
  .then((result) => {
    console.log('Result:', result)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
