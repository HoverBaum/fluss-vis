// State for a single step.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// FLUSS_GEN: CustomTypes - dynamic
export type Idea = any
export type Fluss = any
export type FlussTSFile = any
export type Functions = any

// FLUSS_GEN: FlussInputs - dynamic

export type FlussInputs = {
  yourIdea: Idea
}

// FLUSS_GEN: StepFunctionTypes - dynamic

export type YourApplicationStepFunction = (args: {
  generatedCode: FlussTSFile
  yourLogic: Functions
}) =>
  | Promise<{ generatedCode: FlussTSFile; yourLogic: Functions }>
  | { generatedCode: FlussTSFile; yourLogic: Functions }

export type CreateFlussVisuallyStepFunction = (args: {
  yourIdea: Idea
}) => Promise<Fluss> | Fluss

export type ExportFlussTsStepFunction = (args: {
  flussVisDiagram: Fluss
}) => Promise<FlussTSFile> | FlussTSFile

export type FunctionImplementationStepFunction = (args: {
  generatedCode: FlussTSFile
}) => Promise<Functions> | Functions

// FLUSS_GEN: StepIO - dynamic

type StepIO = {
  start: {
    input: FlussInputs
    output: FlussInputs
  }
  yourApplication: {
    input: Parameters<YourApplicationStepFunction>[0]
    output: ReturnType<YourApplicationStepFunction>
  }
  createFlussVisually: {
    input: Parameters<CreateFlussVisuallyStepFunction>[0]
    output: ReturnType<CreateFlussVisuallyStepFunction>
  }
  exportFlussTs: {
    input: Parameters<ExportFlussTsStepFunction>[0]
    output: ReturnType<ExportFlussTsStepFunction>
  }
  functionImplementation: {
    input: Parameters<FunctionImplementationStepFunction>[0]
    output: ReturnType<FunctionImplementationStepFunction>
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
    yourApplication: {
      id: 'yourApplication',
      status: 'waiting',
      execute: (args) => args,
      arguments: [
        {
          sourceStepId: 'exportFlussTs',
          argumentName: 'generatedCode',
        },
        {
          sourceStepId: 'functionImplementation',
          argumentName: 'yourLogic',
        },
      ],
    },
    createFlussVisually: {
      id: 'createFlussVisually',
      status: 'waiting',
      execute: stepFunctions.createFlussVisually,
      arguments: [
        {
          sourceStepId: 'start',
          argumentName: 'yourIdea',
          sourceProperty: 'yourIdea',
        },
      ],
    },
    exportFlussTs: {
      id: 'exportFlussTs',
      status: 'waiting',
      execute: stepFunctions.exportFlussTs,
      arguments: [
        {
          sourceStepId: 'createFlussVisually',
          argumentName: 'flussVisDiagram',
        },
      ],
    },
    functionImplementation: {
      id: 'functionImplementation',
      status: 'waiting',
      execute: stepFunctions.functionImplementation,
      arguments: [
        {
          sourceStepId: 'exportFlussTs',
          argumentName: 'generatedCode',
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
 * STATE_JSON_START{"name":"Fluss 🌊","edges":[{"source":"start","sourceHandle":"out-Xrvz5qNbTyp9BKJij7AEj","target":"wABG_","targetHandle":"in-QDn5jffbBptctb4nN88-U","data":{"state":"entered"},"id":"xy-edge__startout-Xrvz5qNbTyp9BKJij7AEj-wABG_in-QDn5jffbBptctb4nN88-U"},{"source":"wABG_","sourceHandle":"out-4kEE8V--LG-ibP7nQvpF8","target":"1zbf_","targetHandle":"in-jqQ3rogXM6vBbhJTNdBdf","data":{"state":"entered"},"id":"xy-edge__wABG_out-4kEE8V--LG-ibP7nQvpF8-1zbf_in-jqQ3rogXM6vBbhJTNdBdf"},{"source":"1zbf_","sourceHandle":"out-_MKtJY1KKcCrgM-9Y3HR7","target":"end","targetHandle":"in-gynm3OM2IUaQU1xm9vn0q","data":{"state":"entered"},"id":"xy-edge__1zbf_out-_MKtJY1KKcCrgM-9Y3HR7-endin-gynm3OM2IUaQU1xm9vn0q","selected":false},{"source":"f0CvB","sourceHandle":"out-pJ6q6ANrz_grHbSjwB0S_","target":"end","targetHandle":"in-ujfqETpe_PLyJjIT6kuQr","data":{"state":"entered"},"id":"xy-edge__f0CvBout-pJ6q6ANrz_grHbSjwB0S_-endin-ujfqETpe_PLyJjIT6kuQr"},{"source":"1zbf_","sourceHandle":"out-_MKtJY1KKcCrgM-9Y3HR7","target":"f0CvB","targetHandle":"in-HAiAZFHBND1mYQeJegqL8","data":{"state":"entered"},"id":"xy-edge__1zbf_out-_MKtJY1KKcCrgM-9Y3HR7-f0CvBin-HAiAZFHBND1mYQeJegqL8"}],"nodes":[{"id":"start","position":{"x":18.44941726310222,"y":194.26353041147323},"type":"startNode","deletable":false,"data":{"type":"start","id":"start","outputs":[{"id":"out-Xrvz5qNbTyp9BKJij7AEj","name":"Your Idea","type":"6TRAcGNSL2MK7MJaCznEM"}],"name":"Start 🦛","description":"Start node of the Fluss.","state":"entered"},"measured":{"width":275,"height":268},"selected":false,"dragging":false},{"id":"end","position":{"x":1527.7644251285913,"y":264.3230552791808},"type":"endNode","deletable":false,"data":{"type":"end","id":"end","inputs":[{"id":"in-gynm3OM2IUaQU1xm9vn0q","state":"entered"},{"id":"in-ujfqETpe_PLyJjIT6kuQr","state":"entered"}],"name":"Your application","description":"Bring it all together.","state":"entered","outputs":[]},"measured":{"width":275,"height":216},"selected":false,"dragging":false},{"id":"wABG_","position":{"x":420.9031501340482,"y":176.38287533512062},"type":"flussNode","data":{"type":"step","id":"wABG_","description":"Visually create the logic flow of your application.","name":"Create Fluss visually","inputs":[{"id":"in-QDn5jffbBptctb4nN88-U","state":"entered"}],"outputs":[{"id":"out-4kEE8V--LG-ibP7nQvpF8","name":"FlussVis diagram","type":"FnRnP3yT5NZocqyXk3e3R"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":333},"selected":false,"dragging":false},{"id":"1zbf_","position":{"x":773.3921957369488,"y":172.94587451786526},"type":"flussNode","data":{"type":"step","id":"1zbf_","description":"Turn your Diagram into a standalone code file with types and execution logic.","name":"Export *.fluss.ts","inputs":[{"id":"in-jqQ3rogXM6vBbhJTNdBdf","state":"entered"}],"outputs":[{"id":"out-_MKtJY1KKcCrgM-9Y3HR7","name":"Generated Code","type":"me9tst1JMu3uqaQFhbrUw"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":369},"selected":false,"dragging":false},{"id":"f0CvB","position":{"x":1155.1486617969615,"y":550.8915404177072},"type":"flussNode","data":{"type":"step","id":"f0CvB","description":"Implement the logic for each step in your IDE using your used-to processes.","name":"Function implementation","inputs":[{"id":"in-HAiAZFHBND1mYQeJegqL8","state":"entered"}],"outputs":[{"id":"out-pJ6q6ANrz_grHbSjwB0S_","name":"Your Logic","type":"aJfgiOAeAK6IA4nuy05zR"}],"state":"entered"},"sourcePosition":"right","measured":{"width":275,"height":397},"selected":false,"dragging":false}],"outputTypes":[{"id":"void","displayName":"Void","typeName":"void","content":"void","isPrimitive":true,"icon":"slash"},{"id":"string","displayName":"String","typeName":"string","content":"string","isPrimitive":true,"icon":"signature"},{"id":"number","displayName":"Number","typeName":"number","content":"number","isPrimitive":true,"icon":"calculator"},{"id":"boolean","displayName":"Boolean","typeName":"boolean","content":"boolean","isPrimitive":true,"icon":"toggle-right"},{"id":"6TRAcGNSL2MK7MJaCznEM","typeName":"Idea","displayName":"Idea","content":"any","icon":"lightbulb"},{"id":"FnRnP3yT5NZocqyXk3e3R","typeName":"Fluss","displayName":"Fluss","content":"any","icon":"waves"},{"id":"me9tst1JMu3uqaQFhbrUw","typeName":"FlussTSFile","displayName":".fluss.ts file","content":"any","icon":"code"},{"id":"aJfgiOAeAK6IA4nuy05zR","typeName":"Functions","displayName":"Functions","content":"any","icon":"code-2"}]}STATE_JSON_END
 */
