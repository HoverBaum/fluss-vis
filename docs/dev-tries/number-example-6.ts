/**
 * This script adds execution but types fail us.
 */

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

type Argument = {
  sourceStepId: FlussStepId
  name: string
}

type BaseStep<T extends FlussStepId> = {
  id: FlussStepId
  arguments: Argument[]
  execute: StepFunctionMapping[T]
}

// Discriminated union for a step:
// If status is 'done', a result property (of the appropriate type) is required;
// otherwise, the result is not present.
type Step<T extends FlussStepId> =
  | ({
      status: 'done'
      result: ReturnType<StepFunctionMapping[T]>
    } & BaseStep<T>)
  | ({
      status: Exclude<FlussRunStatus, 'done'>
    } & BaseStep<T>)

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
      arguments: [],
    },
    {
      id: 'end',
      status: 'waiting',
      execute: (args) => args,
      arguments: [
        {
          sourceStepId: 'TRqTC',
          name: 'writtenEquation',
        },
      ],
    },
    {
      id: 'XyASV',
      status: 'waiting',
      execute: stepFunctions.squareNumber,
      arguments: [
        {
          sourceStepId: 'start',
          name: 'baseNumber',
        },
      ],
    },
    {
      id: 'TRqTC',
      status: 'waiting',
      execute: stepFunctions.createString,
      arguments: [
        {
          sourceStepId: 'start',
          name: 'locale',
        },
        {
          sourceStepId: 'XyASV',
          name: 'squaredNumber',
        },
      ],
    },
  ]

  const canBeRun = steps
    .filter((step) => step.status === 'waiting')
    .filter((step) =>
      step.arguments.every(
        (argument) =>
          steps.find((s) => s.id === argument.sourceStepId)!.status === 'done'
      )
    )

  console.log(canBeRun)

  // Execute all steps that can be run.
  canBeRun.forEach((step) => {
    const result = step.execute(
      ...step.arguments.map(
        (argument) =>
          steps.find((s) => s.id === argument.sourceStepId)!.result[
            argument.name
          ]
      )
    )
    step.status = 'done'
    step.result = result
  })
}

// Example usage
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
