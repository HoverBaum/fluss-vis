type FlussStepId = string
type FlussStepOutputId = string

type FlussFunctionArgument = {
  source: FlussStepId
  sourceOutput: FlussStepOutputId
  // camelCase name of this argument.
  name: string
  // TypeScript type of this argument.
  type: string
}

type FlussFunction = {
  stepId: FlussStepId
  stepName: string
  description: string
  // camelCase name of the function for this step.
  functionName: string
  // TypeScript type of the return value of this function.
  returnType: string
  arguments: FlussFunctionArgument[]
}

export type Locale = 'en' | 'de'

type StepFunctions = {
  squareNumber: (args: { baseNumber: number }) => number
  createString: (args: { locale: Locale; squaredNumber: number }) => string
}

type runFlussParams = {
  inputs: {
    locale: Locale
    baseNumber: number
  }
  stepFunctions: StepFunctions
}

type RunFlussResult = {
  writtenEquation: string
  squaredNumber: number
}

type FlussRunStatus = 'running' | 'done' | 'error' | 'waiting'

type FlussRunSteps = {
  [K in keyof StepFunctions | 'end']: {
    key: K
    status: FlussRunStatus
    execute: K extends keyof StepFunctions
      ? StepFunctions[K]
      : <Type>(args: Type) => Type
  } & FlussFunction &
    (FlussRunStatus extends 'done' ? { results: unknown } : object)
}

export const runFluss = async (
  flussArgs: runFlussParams
): Promise<RunFlussResult> => {
  const { inputs, stepFunctions } = flussArgs

  const stepsAsArray = (steps: FlussRunSteps) => Object.values(steps)

  const steps: FlussRunSteps = {
    squareNumber: {
      key: 'squareNumber',
      status: 'waiting',
      execute: stepFunctions.squareNumber,
      stepId: 'TRqTC',
      stepName: 'Square number',
      description: 'Takes a number and returns that number squared.',
      functionName: 'squareNumber',
      returnType: 'number',
      arguments: [
        {
          source: 'start',
          sourceOutput: 'nZEBo',
          name: 'baseNumber',
          type: 'number',
        },
      ],
    },
    createString: {
      key: 'createString',
      status: 'waiting',
      execute: stepFunctions.createString,
      stepId: 'XyASV',
      stepName: 'Create string',
      description:
        "Turns a number and it's squared result into a locale specific string.",
      functionName: 'createString',
      returnType: 'string',
      arguments: [
        {
          source: 'start',
          sourceOutput: 'qs56w',
          name: 'locale',
          type: 'Locale',
        },
        {
          source: 'TRqTC',
          sourceOutput: 'Ki3pb',
          name: 'squaredNumber',
          type: 'number',
        },
      ],
    },
    end: {
      key: 'end',
      status: 'waiting',
      execute: (args) => args,
      stepId: 'end',
      stepName: 'End 🛬',
      description: 'End of the Fluss',
      functionName: 'end',
      returnType: 'any',
      arguments: [
        {
          source: 'XyASV',
          sourceOutput: 'VQJps',
          name: 'writtenEquation',
          type: 'string',
        },
      ],
    },
  }

  const allArgumentsReady = (step: FlussRunSteps[keyof FlussRunSteps]) => {
    return step.arguments.every((arg) => {
      const sourceStep = steps[arg.source as keyof FlussRunSteps]
      return sourceStep && sourceStep.status === 'done'
    })
  }

  const canBeRun = stepsAsArray(steps)
    .filter((step) => step.status === 'waiting')
    .filter((step) => {})
}
