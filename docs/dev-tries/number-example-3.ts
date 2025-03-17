export type Locale = 'en' | 'de'

type RunFlussParams = {
  inputs: {
    locale: Locale
    baseNumber: number
  }
  stepFunctions: {
    squareNumber: (args: { baseNumber: number }) => number
    createString: (args: { locale: Locale; squaredNumber: number }) => string
  }
}

type RunFlussResult = {
  writtenEquation: string
  squaredNumber: number
}

type StepResult = {
  stepId: string
  outputId: string
  result: unknown
}

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

type FlussRunStep = FlussFunction & {
  status: 'running' | 'done' | 'error' | 'waiting'
}

const flussFunctions = JSON.parse(
  `[{"stepId":"TRqTC","stepName":"Square number","description":"Takes a number and returns that number squared.","functionName":"squareNumber","returnType":"number","arguments":[{"source":"start","sourceOutput":"nZEBo","name":"baseNumber","type":"number"}]},{"stepId":"XyASV","stepName":"Create string","description":"Turns a number and it's squared result into a locale specific string.","functionName":"createString","returnType":"string","arguments":[{"source":"start","sourceOutput":"qs56w","name":"locale","type":"Locale"},{"source":"TRqTC","sourceOutput":"Ki3pb","name":"squaredNumber","type":"number"}]},{"stepId":"end","stepName":"End 🛬","description":"End of the Fluss","functionName":"end","returnType":"any","arguments":[]}]`
) as FlussFunction[]

const startNameToId = {
  baseNumber: 'nZEBo',
  locale: 'qs56w',
}

// Extract step functions type
type StepFunctions = RunFlussParams['stepFunctions']

// Get valid function names (keys of stepFunctions)
type StepFunctionName = keyof StepFunctions

// Get the expected argument type for a given function name
type StepFunctionArgs = {
  [K in StepFunctionName]: Parameters<StepFunctions[K]>[0]
}

// Get the expected return type for a given function name
type StepFunctionReturn<T extends StepFunctionName> = ReturnType<
  StepFunctions[T]
>

export const runFluss = async (
  flussArgs: RunFlussParams
): Promise<RunFlussResult> => {
  const { inputs, stepFunctions } = flussArgs

  const allSteps: FlussRunStep[] = flussFunctions.map((step) => ({
    ...step,
    status: 'waiting',
  }))
  const allResults: StepResult[] = (
    Object.keys(inputs) as (keyof typeof inputs)[]
  ).map((inputKey) => ({
    stepId: 'start',
    outputId: startNameToId[inputKey],
    result: inputs[inputKey],
  }))

  const runStepFunction = async <T extends StepFunctionName>(
    funcName: T,
    args: StepFunctionArgs[T]
  ): Promise<StepFunctionReturn<T>> => {
    const functionToRun = stepFunctions[funcName] as StepFunctions[T] // Explicitly type the function
    return functionToRun(args) as StepFunctionReturn<T> // Explicitly type the return value
  }

  // const runStepFunction = async (
  //   funcName: keyof typeof stepFunctions,
  //   args: Record<string, unknown>
  // ) => {
  //   return stepFunctions[funcName](args)
  // }

  // A step can be run if all required arguments are available.
  const stepsThatCanBeRun = allSteps
    .filter((step) => step.status === 'waiting')
    .filter((step) =>
      step.arguments.every((arg) =>
        allResults.some(
          (result) =>
            result.stepId === arg.source && result.outputId === arg.sourceOutput
        )
      )
    )

  if (stepsThatCanBeRun.length === 0) {
    throw new Error('No steps can be run.')
  }

  stepsThatCanBeRun.forEach((step) => {
    step.status = 'running'
    const stepArgs = step.arguments.reduce<Record<string, unknown>>(
      (acc, arg) => {
        const result = allResults.find(
          (result) =>
            result.stepId === arg.source && result.outputId === arg.sourceOutput
        )
        if (!result) {
          throw new Error(
            `No result found for ${arg.source}.${arg.sourceOutput}`
          )
        }
        return { ...acc, [arg.name]: result.result }
      },
      {}
    )
    runStepFunction(
      step.functionName as keyof StepFunctionArgs,
      stepArgs as StepFunctionArgs[keyof StepFunctionArgs]
    )
  })
}
