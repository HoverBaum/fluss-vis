/**
 * Flow engine with functional approach
 * Optimized for code generation from visualization
 * Fully typed without any 'any' types
 *
 * Copilot with GPT did some typing fixes.
 */

// --- Type Definitions ---

// Basic type definitions
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'
type Locale = 'de' | 'en'

// Input and Output types for the flow
type FlussInputs = {
  locale: Locale
  baseNumber: number
}

// Step Input/Output types
type StepIO = {
  start: {
    input: FlussInputs
    output: FlussInputs
  }
  squareNumber: {
    input: { baseNumber: number }
    output: { squaredNumber: number }
  }
  createString: {
    input: { locale: Locale; squaredNumber: number }
    output: { writtenEquation: string }
  }
  end: {
    input: { writtenEquation: string }
    output: { writtenEquation: string }
  }
}

// Step IDs type
type FlussStepId = keyof StepIO

// Step function types mapped from StepIO
type StepFunctions = {
  [K in Exclude<FlussStepId, 'start' | 'end'>]: (
    args: StepIO[K]['input']
  ) => Promise<StepIO[K]['output']>
}

// Argument with typed source and target fields
type StepArgument<
  TTargetStep extends FlussStepId,
  TSourceStep extends FlussStepId,
  TSourceField extends keyof StepIO[TSourceStep]['output'],
  TTargetField extends keyof StepIO[TTargetStep]['input']
> = {
  sourceStepId: TSourceStep
  sourceField: TSourceField
  targetField: TTargetField
}

// Step definition with result based on status
type Step<ID extends FlussStepId> = {
  id: ID
  status: FlussRunStatus
  execute: (
    args: StepIO[ID]['input']
  ) => Promise<StepIO[ID]['output']> | StepIO[ID]['output']
  arguments: Array<{
    sourceStepId: FlussStepId
    sourceField: string
    targetField: keyof StepIO[ID]['input']
  }>
  result?: StepIO[ID]['output']
  error?: Error
}

// Flow state containing all steps
type FlowState = {
  [K in FlussStepId]: Step<K>
}

// Type-safe way to get a property from an object
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Type-safe way to set a property on an object
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value
}

// --- Flow Implementation ---

/**
 * Execute a single step with proper typing
 */
async function executeStep<ID extends FlussStepId>(
  step: Step<ID>,
  flowState: FlowState
): Promise<void> {
  try {
    // Build input object
    const input = {} as StepIO[ID]['input']

    for (const arg of step.arguments) {
      const sourceStep = flowState[arg.sourceStepId]

      if (sourceStep.status !== 'done' || !sourceStep.result) {
        throw new Error(
          `Source step ${arg.sourceStepId} not complete for ${String(
            arg.targetField
          )}`
        )
      }

      // Type-safe property access
      const sourceValue = getProperty(
        sourceStep.result,
        arg.sourceField as keyof typeof sourceStep.result
      )
      setProperty(
        input,
        arg.targetField as keyof typeof input,
        sourceValue as StepIO[typeof arg.sourceStepId]['output'][keyof StepIO[typeof arg.sourceStepId]['output']]
      )
    }

    // Execute the step
    const result = await step.execute(input)

    // Update the step with the result
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
 */
function canStepRun(step: Step<FlussStepId>, flowState: FlowState): boolean {
  return step.arguments.every((arg) => {
    const sourceStep = flowState[arg.sourceStepId]
    return sourceStep.status === 'done' && sourceStep.result !== undefined
  })
}

/**
 * Create a strongly-typed step argument
 */
function createStepArgument<
  TTargetStep extends FlussStepId,
  TSourceStep extends FlussStepId,
  TSourceField extends keyof StepIO[TSourceStep]['output'],
  TTargetField extends keyof StepIO[TTargetStep]['input']
>(
  targetStep: TTargetStep,
  sourceStep: TSourceStep,
  sourceField: TSourceField,
  targetField: TTargetField
): StepArgument<TTargetStep, TSourceStep, TSourceField, TTargetField> {
  return {
    sourceStepId: sourceStep,
    sourceField: sourceField,
    targetField: targetField,
  }
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
  const flowState: FlowState = {
    start: {
      id: 'start',
      status: 'done',
      execute: (args: StepIO['start']['input']) => args,
      arguments: [],
      result: inputs,
    },
    end: {
      id: 'end',
      status: 'waiting',
      execute: (args: StepIO['end']['input']) => args,
      arguments: [
        createStepArgument(
          'end',
          'createString',
          'writtenEquation',
          'writtenEquation'
        ),
      ],
    },
    squareNumber: {
      id: 'squareNumber',
      status: 'waiting',
      execute: stepFunctions.squareNumber,
      arguments: [
        createStepArgument('squareNumber', 'start', 'baseNumber', 'baseNumber'),
      ],
    },
    createString: {
      id: 'createString',
      status: 'waiting',
      execute: stepFunctions.createString,
      arguments: [
        createStepArgument('createString', 'start', 'locale', 'locale'),
        createStepArgument(
          'createString',
          'squareNumber',
          'squaredNumber',
          'squaredNumber'
        ),
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
        '\nCurrently runnable:',
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

// Example usage
async function runExample() {
  const result = await runFluss({
    inputs: {
      locale: 'en',
      baseNumber: 4,
    },
    stepFunctions: {
      squareNumber: ({ baseNumber }) =>
        Promise.resolve({ squaredNumber: baseNumber ** 2 }),
      createString: async ({ locale, squaredNumber }) => {
        // Simulate some delay
        await new Promise((resolve) => setTimeout(resolve, 300))
        return {
          writtenEquation: `${locale} - ${squaredNumber}`,
        }
      },
    },
  })

  console.log('\nResult:', result)
  return result
}

// Execute the flow
runExample()
