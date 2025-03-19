// State for a single step.
// FIXED
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// CUSTOM type provided by user
export type Locale = 'en' | 'de'

// Input type for the flow
type FlussInputs = {
  locale: Locale
  baseNumber: number
}

// Step Input/Output types - simplified with mapped types
// While start is static, end and other steps are dynamic
type StepIO = {
  start: {
    input: FlussInputs
    output: FlussInputs
  }
  squareNumber: {
    input: { baseNumber: number }
    output: number
  }
  createString: {
    input: { locale: Locale; squaredNumber: number }
    output: string
  }
  end: {
    input: { writtenEquation: string }
    output: { writtenEquation: string }
  }
}

// Step IDs type
// FIXED
type FlussStepId = keyof StepIO

// Step function types mapped from StepIO
// FIXED - assumign start and end identifiers do not change.
type StepFunctions = {
  [K in Exclude<FlussStepId, 'start' | 'end'>]: (
    args: StepIO[K]['input']
  ) => Promise<StepIO[K]['output']> | StepIO[K]['output']
}

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
export async function runFluss(params: {
  inputs: FlussInputs
  stepFunctions: StepFunctions
}): Promise<StepIO['end']['output']> {
  const { inputs, stepFunctions } = params

  // Initialize the flow state with typed steps
  // This is generated new for each flow.
  const flowState: FlowState = {
    start: {
      id: 'start',
      status: 'done',
      execute: (args) => args,
      arguments: [],
      result: inputs,
    },
    squareNumber: {
      id: 'squareNumber',
      status: 'waiting',
      execute: stepFunctions.squareNumber,
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
      execute: stepFunctions.createString,
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
      execute: (args) => args,
      arguments: [
        {
          sourceStepId: 'createString',
          argumentName: 'writtenEquation',
        },
      ],
    },
  }

  return new Promise<StepIO['end']['output']>((resolve, reject) => {
    // Process runnable steps
    const processSteps = async () => {
      // Find all steps that can run now
      const runnableSteps = Object.values(flowState)
        .filter((step) => step.status === 'waiting')
        .filter((step) => canStepRun(step as Step<FlussStepId>, flowState))

      console.log(
        'Currently runnable:',
        runnableSteps.map((s) => s.id)
      )

      // Check if we're done or stuck
      if (runnableSteps.length === 0) {
        if (Object.values(flowState).every((step) => step.status === 'done')) {
          console.log('All steps done!')
          if (!flowState.end.result) {
            return reject(new Error('End step has no result'))
          }
          return resolve(flowState.end.result)
        } else {
          return reject(
            new Error('No steps can be run and not all steps are done')
          )
        }
      }

      // Execute all runnable steps
      try {
        await Promise.all(
          runnableSteps.map((step) => {
            step.status = 'running'
            return executeStep(step as Step<FlussStepId>, flowState)
          })
        )

        // Continue processing
        await processSteps()
      } catch (error) {
        reject(error)
      }
    }

    // Start the flow
    processSteps().catch(reject)
  })
}

// // Example usage
// async function runExample() {
//   const result = await runFluss({
//     inputs: {
//       locale: 'en',
//       baseNumber: 4,
//     },
//     stepFunctions: {
//       squareNumber: ({ baseNumber }) => baseNumber ** 2,
//       createString: async ({ locale, squaredNumber }) => {
//         // Simulate some delay
//         await new Promise((resolve) => setTimeout(resolve, 300))
//         return `${locale} - ${squaredNumber}`
//       },
//     },
//   })

//   console.log('\nResult:', result)
//   return result
// }

// // Execute the flow
// runExample()
