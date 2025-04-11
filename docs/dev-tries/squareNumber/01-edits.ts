// State for a single step.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// FLUSS_GEN: CustomTypes - dynamic
export type Locale = 'en' | 'de'

// FLUSS_GEN: FlussInputs - dynamic

export type FlussInputs = {
  locale: Locale
  baseNumber: number
}

// FLUSS_GEN: StepFunctionTypes - dynamic

export type SquareNumberStepFunction = (args: {
  baseNumber: number
}) => Promise<number> | number

export type CreateStringStepFunction = (args: {
  locale: Locale
  squaredNumber: number
}) => Promise<string> | string

export type EndStepFunction = (args: {
  writtenEquation: string
}) => Promise<{ writtenEquation: string }> | { writtenEquation: string }

// FLUSS_GEN: StepIO - dynamic

type StepIO = {
  start: {
    input: FlussInputs
    output: FlussInputs
  }
  squareNumber: {
    input: Parameters<SquareNumberStepFunction>[0]
    output: ReturnType<SquareNumberStepFunction>
  }
  createString: {
    input: Parameters<CreateStringStepFunction>[0]
    output: ReturnType<CreateStringStepFunction>
  }
  end: {
    input: Parameters<EndStepFunction>[0]
    output: ReturnType<EndStepFunction>
  }
}

// Base type for a step definition
type FlussStepBase<TId extends string, TInput, TOutput> = {
  id: TId
  status: FlussRunStatus
  execute?: (args: TInput) => Promise<TOutput> | TOutput
  arguments: Array<{
    sourceStepId: string
    argumentName: keyof TInput
    sourceProperty?: string
  }>
  result?: TOutput
  error?: Error
}

// Define the base types for a flow
type FlowStep<TInput, TOutput> = {
  input: TInput
  output: TOutput
}

// Type for defining a complete flow's structure
type FlowDefinition<
  TSteps extends Record<string, FlowStep<Record<string, unknown>, unknown>>,
  TInput extends Record<string, unknown>,
  TOutput,
> = {
  steps: TSteps
  flowInput: TInput
  flowOutput: TOutput
}

// Generic type for the flow configuration
type FlussFlow<
  TFlow extends FlowDefinition<
    Record<string, FlowStep<Record<string, unknown>, unknown>>,
    Record<string, unknown>,
    unknown
  >,
> = {
  [K in keyof TFlow['steps']]: FlussStepBase<
    K & string,
    TFlow['steps'][K]['input'],
    TFlow['steps'][K]['output']
  >
}

// Type for the runner function that will be returned
type FlussRunner<
  TFlow extends FlowDefinition<
    Record<string, FlowStep<Record<string, unknown>, unknown>>,
    Record<string, unknown>,
    unknown
  >,
> = (params: {
  inputs: TFlow['flowInput']
  stepFunctions: {
    [K in Exclude<keyof TFlow['steps'], 'start' | 'end'>]: (
      args: TFlow['steps'][K]['input']
    ) => Promise<TFlow['steps'][K]['output']> | TFlow['steps'][K]['output']
  }
}) => Promise<{ writtenEquation: TFlow['flowOutput'] }>

// Step IDs type
// FIXED
type FlussStepId = keyof StepIO

// Step definition with result based on status
// FIXED
type Step<ID extends FlussStepId> = {
  id: ID
  status: FlussRunStatus
  execute: (
    args: StepIO[ID]['input']
  ) => Promise<StepIO[ID]['output']> | StepIO[ID]['output']
  arguments: Array<{
    sourceStepId: FlussStepId
    argumentName: keyof StepIO[ID]['input']
    sourceProperty?: string
  }>
  result?: StepIO[ID]['output']
  error?: Error
}

// Flow state containing all steps
// FIXED
type FlowState = {
  [K in FlussStepId]: Step<K>
}

/**
 * Execute a single step with proper typing
 * // FIXED
 */
async function executeStep<ID extends FlussStepId>(
  step: Step<ID>,
  flowState: FlowState
): Promise<void> {
  try {
    // Build input object from dependencies
    const input = {} as StepIO[ID]['input']

    step.arguments.forEach((arg) => {
      const sourceStep = flowState[arg.sourceStepId]
      if (sourceStep.status !== 'done' || sourceStep.result === undefined) {
        throw new Error(
          'Source step ' +
            arg.sourceStepId +
            ' not complete for ' +
            String(arg.argumentName)
        )
      }

      // If sourceProperty is undefined, use the entire result
      // Otherwise, extract the specified property
      if (arg.sourceProperty === undefined) {
        input[arg.argumentName as keyof StepIO[ID]['input']] =
          sourceStep.result as StepIO[ID]['input'][keyof StepIO[ID]['input']]
      } else {
        input[arg.argumentName as keyof StepIO[ID]['input']] =
          sourceStep.result[
            arg.sourceProperty as keyof typeof sourceStep.result
          ]
      }
    })

    // Rest of the function remains the same
    console.log('Executing with Input:', input)
    const result = await step.execute(input)
    console.log('Result:', result)
    step.status = 'done'
    step.result = result
  } catch (err) {
    step.status = 'error'
    step.error = err instanceof Error ? err : new Error(String(err))
    throw step.error
  }
}

/**
 * Check if a step can be run based on its dependencies
 * // FIXED
 */
function canStepRun<ID extends FlussStepId>(
  step: Step<ID>,
  flowState: FlowState
): boolean {
  return step.arguments.every((arg) => {
    const sourceStep = flowState[arg.sourceStepId]
    return sourceStep.status === 'done' && sourceStep.result !== undefined
  })
}

/**
 * Main function to run the flow
 */
const createFlussRunner = <
  TFlow extends FlowDefinition<
    Record<string, FlowStep<Record<string, unknown>, unknown>>,
    Record<string, unknown>,
    unknown
  >,
>(
  flowConfig: FlussFlow<TFlow>
): FlussRunner<TFlow> => {
  return async ({ inputs, stepFunctions }) => {
    type RuntimeState = Record<
      keyof TFlow['steps'],
      FlussStepBase<string, unknown, unknown>
    >

    const runtimeState = Object.entries(flowConfig).reduce(
      (acc, [id, step]) => {
        if (typeof step !== 'object' || !step) return acc
        return {
          ...acc,
          [id]: {
            ...(step as object),
            status: id === 'start' ? ('done' as const) : ('waiting' as const),
            result: id === 'start' ? inputs : undefined,
            execute:
              id === 'start'
                ? undefined
                : id === 'end'
                  ? (args: { writtenEquation: TFlow['flowOutput'] }) => args
                  : stepFunctions[
                      id as Exclude<keyof TFlow['steps'], 'start' | 'end'>
                    ],
          },
        }
      },
      {} as RuntimeState
    )

    return new Promise((resolve, reject) => {
      const processSteps = async () => {
        const runnableSteps = Object.values(runtimeState)
          .filter((step): step is FlussStepBase<string, unknown, unknown> => {
            if (!step || typeof step !== 'object') return false
            return 'status' in step && step.status === 'waiting' && 'id' in step
          })
          .filter((step) =>
            canStepRun(step as Step<FlussStepId>, runtimeState as FlowState)
          )

        if (runnableSteps.length === 0) {
          const allStepsDone = Object.values(runtimeState).every((step) => {
            if (!step || typeof step !== 'object') return false
            return 'status' in step && step.status === 'done'
          })

          if (allStepsDone) {
            const endStep = runtimeState[
              Object.keys(runtimeState).find((k) => k === 'end')!
            ] as FlussStepBase<
              'end',
              { writtenEquation: TFlow['flowOutput'] },
              { writtenEquation: TFlow['flowOutput'] }
            >
            if (!endStep?.result) {
              return reject(new Error('End step has no result'))
            }
            return resolve(endStep.result)
          } else {
            return reject(
              new Error('No steps can be run and not all steps are done')
            )
          }
        }

        try {
          await Promise.all(
            runnableSteps.map((step) => {
              step.status = 'running'
              return executeStep(
                step as Step<FlussStepId>,
                runtimeState as FlowState
              )
            })
          )
          await processSteps()
        } catch (error) {
          reject(error)
        }
      }

      processSteps().catch(reject)
    })
  }
}

// Example usage with the new generic approach
type SquareNumberFlow = FlowDefinition<
  {
    start: FlowStep<never, { locale: Locale; baseNumber: number }>
    squareNumber: FlowStep<{ baseNumber: number }, number>
    createString: FlowStep<{ locale: Locale; squaredNumber: number }, string>
    end: FlowStep<{ writtenEquation: string }, { writtenEquation: string }>
  },
  { locale: Locale; baseNumber: number },
  string
>

const runner = createFlussRunner<SquareNumberFlow>({
  start: {
    id: 'start',
    status: 'waiting',
    execute: undefined,
    arguments: [],
  },
  squareNumber: {
    id: 'squareNumber',
    status: 'waiting',
    arguments: [
      {
        sourceStepId: 'start',
        argumentName: 'baseNumber',
        sourceProperty: 'baseNumber',
      },
    ],
  },
  createString: {
    id: 'createString',
    status: 'waiting',
    arguments: [
      {
        sourceStepId: 'start',
        argumentName: 'locale',
        sourceProperty: 'locale',
      },
      {
        sourceStepId: 'squareNumber',
        argumentName: 'squaredNumber',
      },
    ],
  },
  end: {
    id: 'end',
    status: 'waiting',
    arguments: [
      {
        sourceStepId: 'createString',
        argumentName: 'writtenEquation',
      },
    ],
  },
})

// Using the runner
runner({
  inputs: {
    locale: 'en',
    baseNumber: 5,
  },
  stepFunctions: {
    squareNumber: ({ baseNumber }) => {
      console.log('Squaring number:', baseNumber)
      return Promise.resolve(baseNumber * baseNumber)
    },
    createString: ({ locale, squaredNumber }) => {
      console.log('Creating string:', locale, squaredNumber)
      return Promise.resolve(`The square of the number is ${squaredNumber}`)
    },
  },
})
