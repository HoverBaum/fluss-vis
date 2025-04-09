// State for a single step.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// FLUSS_GEN: CustomTypes - dynamic
export type Locale = 'en' | 'de'

// FLUSS_GEN: FlussInputs - dynamic

type FlussInputs = {
  locale: Locale
  baseNumber: number
}

export type SquareNumberStepFunction = (args: {
  baseNumber: number
}) => Promise<number> | number

export type CreateStringStepFunction = (args: {
  locale: Locale
  squaredNumber: number
}) => Promise<string> | string

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

/**
 * STATE_JSON_START{"name":"Squared number 🧮","edges":[{"source":"start","sourceHandle":"qs56w","target":"XyASV","targetHandle":"XyASV-XNqwk","id":"xy-edge__startqs56w-XyASVXyASV-XNqwk","data":{"state":"entered"}},{"source":"XyASV","sourceHandle":"VQJps","target":"end","targetHandle":"end-IMC3S","id":"xy-edge__XyASVVQJps-endend-IMC3S","data":{"state":"entered"}},{"source":"TRqTC","sourceHandle":"Ki3pb","target":"XyASV","targetHandle":"XyASV-TNZj8","id":"xy-edge__TRqTCKi3pb-XyASVXyASV-TNZj8","data":{"state":"entered"}},{"source":"start","sourceHandle":"nZEBo","target":"TRqTC","targetHandle":"TRqTC-wzsOw","id":"xy-edge__startnZEBo-TRqTCTRqTC-wzsOw","data":{"state":"entered"}}],"nodes":[{"id":"TRqTC","position":{"x":394,"y":199},"type":"flussNode","data":{"type":"step","id":"TRqTC","outputs":[{"id":"Ki3pb","type":"number","name":"Squared number"}],"name":"Square number","inputs":[{"id":"TRqTC-wzsOw","state":"entered"}],"description":"Takes a number and returns that number squared.","state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":349}},{"id":"XyASV","position":{"x":747,"y":251},"type":"flussNode","data":{"type":"step","id":"XyASV","outputs":[{"id":"VQJps","type":"string","name":"Written equation"}],"name":"Create string","inputs":[{"id":"XyASV-XNqwk","state":"entered"},{"id":"XyASV-TNZj8","state":"entered"}],"description":"Turns a number and it's squared result into a locale specific string.","state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":389}},{"id":"start","position":{"x":82,"y":158},"type":"startNode","data":{"type":"start","id":"start","outputs":[{"id":"qs56w","type":"locale","name":"Locale"},{"id":"nZEBo","name":"Base number","type":"number"}],"name":"Start 🛫","description":"Start of the Fluss.","state":"entered"},"sourcePosition":"right","deletable":false,"measured":{"width":275,"height":381},"selected":false},{"id":"end","position":{"x":1124,"y":368},"type":"endNode","data":{"type":"end","id":"end","name":"End 🛬","description":"End of the Fluss","inputs":[{"id":"end-IMC3S","state":"entered"}],"outputs":[],"state":"entered"},"sourcePosition":"right","deletable":false,"measured":{"width":275,"height":176}}],"outputTypes":[{"id":"void","displayName":"Void","typeName":"void","content":"void","isPrimitive":true,"icon":"slash"},{"id":"string","displayName":"String","typeName":"string","content":"string","isPrimitive":true,"icon":"signature"},{"id":"number","displayName":"Number","typeName":"number","content":"number","isPrimitive":true,"icon":"calculator"},{"id":"boolean","displayName":"Boolean","typeName":"boolean","content":"boolean","isPrimitive":true,"icon":"toggle-right"},{"id":"locale","displayName":"Locale","typeName":"Locale","content":"\"en\" | \"de\"","icon":"languages"}]}STATE_JSON_END
 */

runFluss({
  inputs: {
    locale: 'en',
    baseNumber: 5,
  },
  stepFunctions: {
    squareNumber: ({ baseNumber }) => {
      return baseNumber * baseNumber
    },
    createString: ({ locale, squaredNumber }) => {
      return `The squared number is ${squaredNumber} in ${locale}`
    },
  },
})
  .then((result) => {
    console.log('Final result:', result)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
