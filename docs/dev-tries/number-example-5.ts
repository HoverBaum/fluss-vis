type FlussInputs = {
  locale: Locale
  baseNumber: number
}

type Locale = 'de' | 'en'

// Step function definitions.
type StepFunctions = {
  squareNumber: (args: { baseNumber: number }) => number
  createString: (args: { locale: Locale; squaredNumber: number }) => string
}

type StepFunctionsAll = StepFunctions & {
  start: <T extends FlussInputs>(args: T) => T
  end: <T extends { writtenEquation: string }>(args: T) => T
}

// Our list of step IDs.
type FlussStepId = 'start' | 'end' | 'XyASV' | 'TRqTC'

// Run status union.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// Mapping each ID to its corresponding function type.
type StepFunctionMapping = {
  start: StepFunctionsAll['start']
  end: StepFunctionsAll['end']
  XyASV: StepFunctionsAll['squareNumber'] // returns number
  TRqTC: StepFunctionsAll['createString'] // returns string
}

// Discriminated union for a step:
// If status is 'done', a result property (of the appropriate type) is required;
// otherwise, the result is not present.
type Step<T extends FlussStepId> =
  | {
      id: T
      status: 'done'
      execute: StepFunctionMapping[T]
      result: ReturnType<StepFunctionMapping[T]>
    }
  | {
      id: T
      status: Exclude<FlussRunStatus, 'done'>
      execute: StepFunctionMapping[T]
    }

// A tuple type ensuring one step per ID, in a fixed order.
type StepsTuple = [Step<'start'>, Step<'end'>, Step<'XyASV'>, Step<'TRqTC'>]

// ----------------------------
//    Fluss Input and Output
// ----------------------------

type runFlussParams = {
  inputs: FlussInputs
  stepFunctions: StepFunctions
}

// type RunFlussResult = {
//   writtenEquation: string
//   squaredNumber: number
// }

// Example usage:
// const steps: StepsTuple = [
//   { id: 'start', status: 'waiting', execute: <T>(args: T) => args },
//   { id: 'end', status: 'running', execute: <T>(args: T) => args },
//   {
//     id: 'XyASV',
//     status: 'done',
//     execute: ({ baseNumber }: { baseNumber: number }) =>
//       baseNumber * baseNumber,
//     result: 16, // Because squareNumber returns a number
//   },
//   {
//     id: 'TRqTC',
//     status: 'done',
//     execute: ({
//       locale,
//       squaredNumber,
//     }: {
//       locale: Locale
//       squaredNumber: number
//     }) => `${locale} - ${squaredNumber}`,
//     result: 'en-US - 16', // Because createString returns a string
//   },
// ]

export const runFluss = async (flussArgs: runFlussParams): Promise<void> => {
  const { inputs, stepFunctions } = flussArgs

  const steps: StepsTuple = [
    {
      id: 'start',
      status: 'done',
      execute: (args) => args,
      result: {
        ...inputs,
      },
    },
    { id: 'end', status: 'waiting', execute: (args) => args },
    {
      id: 'XyASV',
      status: 'waiting',
      execute: stepFunctions.squareNumber,
    },
    {
      id: 'TRqTC',
      status: 'waiting',
      execute: stepFunctions.createString,
    },
  ]

  // const allArgumentsReady = (step: Step<FlussStepId>) => {

  // }

  const canBeRun = steps.filter((step) => step.status === 'waiting')

  console.log(canBeRun)
}

await runFluss({
  inputs: {
    locale: 'en',
    baseNumber: 4,
  },
  stepFunctions: {
    squareNumber: ({ baseNumber }) => baseNumber * baseNumber,
    createString: ({ locale, squaredNumber }) => `${locale} - ${squaredNumber}`,
  },
})
