export type FlussInputs = {
  name: string
}

export type HelloNameStepFunction = (args: {
  name: string
}) => Promise<string> | string






























// State for a single step.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// FLUSS_GEN: CustomTypes - dynamic

// FLUSS_GEN: FlussInputs - dynamic



// FLUSS_GEN: StepFunctionTypes - dynamic

export type EndStepFunction = (args: {
  greeting: string
}) => Promise<{ greeting: string }> | { greeting: string }



// FLUSS_GEN: StepIO - dynamic

type StepIO = {
  start: {
    input: FlussInputs
    output: FlussInputs
  }
  end: {
    input: Parameters<EndStepFunction>[0]
    output: ReturnType<EndStepFunction>
  }
  helloName: {
    input: Parameters<HelloNameStepFunction>[0]
    output: ReturnType<HelloNameStepFunction>
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
      if (sourceStep.status !== 'done') {
        throw new Error(
          'Source step ' +
            arg.sourceStepId +
            ' not complete for ' +
            String(arg.argumentName)
        )
      }

      // If sourceProperty is undefined, use the entire result
      // Otherwise, extract the specified property
      if (arg.sourceProperty === undefined || sourceStep.result === undefined) {
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
    console.log('Executing ' + step.id + ' with Input:', input)
    const result = await step.execute(input)
    console.log('Result for ' + step.id + ':', result)
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
    return sourceStep.status === 'done'
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
    end: {
      id: 'end',
      status: 'waiting',
      execute: (args) => args,
      arguments: [
        {
          sourceStepId: 'helloName',
          argumentName: 'greeting',
        },
      ],
    },
    helloName: {
      id: 'helloName',
      status: 'waiting',
      execute: stepFunctions.helloName,
      arguments: [
        {
          sourceStepId: 'start',
          argumentName: 'name',
          sourceProperty: 'name',
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

      const currentlyRunning = Object.values(flowState).filter(
        (step) => step.status === 'running'
      )

      // Check if we're done or stuck
      if (runnableSteps.length === 0 && currentlyRunning.length === 0) {
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
      if (runnableSteps.length > 0) {
        try {
          await Promise.all(
            runnableSteps.map(async (step) => {
              step.status = 'running'
              await executeStep(step as Step<FlussStepId>, flowState)
              // After each step finishes, immediately try to process more steps
              await processSteps()
            })
          )

          // Continue processing
          await processSteps()
        } catch (error) {
          reject(error)
        }
      }
    }

    // Start the flow
    processSteps().catch(reject)
  })
}

/**
 * STATE_JSON_START{"name":"Hello","edges":[{"source":"6JDej","sourceHandle":"out-DpB-lXRBTnaaSD4D4XRzY","target":"end","targetHandle":"in-epseowT5zywE16heOXJzR","data":{"state":"entered"},"id":"xy-edge__6JDejout-DpB-lXRBTnaaSD4D4XRzY-endin-epseowT5zywE16heOXJzR"},{"source":"start","sourceHandle":"out-hG6x6Z6DLLQMWTn8v9OQE","target":"6JDej","targetHandle":"in-RwyMB-T7gS39DHwX3hfbg","data":{"state":"entered"},"id":"xy-edge__startout-hG6x6Z6DLLQMWTn8v9OQE-6JDejin-RwyMB-T7gS39DHwX3hfbg"}],"nodes":[{"id":"start","position":{"x":50,"y":200},"type":"startNode","deletable":false,"data":{"type":"start","id":"start","outputs":[{"id":"out-hG6x6Z6DLLQMWTn8v9OQE","name":"Name","type":"string"}],"name":"Start 🦛","description":"Start node of the Fluss.","state":"entered"},"measured":{"width":275,"height":268},"selected":false},{"id":"end","position":{"x":900,"y":200},"type":"endNode","deletable":false,"data":{"type":"end","id":"end","inputs":[{"id":"in-epseowT5zywE16heOXJzR","state":"entered"}],"name":"End 🏁","description":"End node of the Fluss.","state":"entered","outputs":[]},"measured":{"width":275,"height":160}},{"id":"6JDej","position":{"x":496.3806970509383,"y":195.43934316353887},"type":"flussNode","data":{"type":"step","id":"6JDej","description":"Say hello 👋","name":"Hello [name]","inputs":[{"id":"in-RwyMB-T7gS39DHwX3hfbg","state":"entered"}],"outputs":[{"id":"out-DpB-lXRBTnaaSD4D4XRzY","name":"Greeting","type":"string"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":313},"selected":false}],"outputTypes":[{"id":"void","displayName":"Void","typeName":"void","content":"void","isPrimitive":true,"icon":"slash"},{"id":"string","displayName":"String","typeName":"string","content":"string","isPrimitive":true,"icon":"signature"},{"id":"number","displayName":"Number","typeName":"number","content":"number","isPrimitive":true,"icon":"calculator"},{"id":"boolean","displayName":"Boolean","typeName":"boolean","content":"boolean","isPrimitive":true,"icon":"toggle-right"}]}STATE_JSON_END
 */
