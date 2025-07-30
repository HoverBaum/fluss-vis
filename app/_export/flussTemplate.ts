import { END_NODE_ID, START_NODE_ID } from '@/stores/nodeHelpers'
import { FlussArgument, FlussFunction } from './useExport'
import { FlussTSStateJSONEnd, FlussTSStateJSONStart } from '@/lib/constants'

const ts = String.raw

type FlussTemplateParams = {
  customTypes: string
  flussFunctions: FlussFunction[]
  flussInputs: FlussArgument[]
  entireStateJSON: string
}

const generateFlussInputs = (inputs: FlussArgument[]) => ts`
export type FlussInputs = {
  ${inputs.map((arg) => `${arg.identifier}: ${arg.type}`).join(';\n  ')}
}`

const generateStepIO = (functions: FlussFunction[]) => ts`
type StepIO = {
  ${START_NODE_ID}: {
    input: FlussInputs;
    output: FlussInputs;
  }${functions
    .map(
      (flussFunction) => ts`
  ${flussFunction.functionName}: {
    input: Parameters<${flussFunction.functionTypeIdentifier}>[0]
    output: ReturnType<${flussFunction.functionTypeIdentifier}>
  }`
    )
    .join('')}
}`

const generateStepFunctionTypes = (flussFunctions: FlussFunction[]) =>
  flussFunctions
    .map(
      (flussFunction) => ts`
export type ${flussFunction.functionTypeIdentifier} = (args: {
  ${flussFunction.arguments.map((arg) => `${arg.name}: ${arg.type}`).join(';\n  ')}
}) => Promise<${flussFunction.returnType}> | ${flussFunction.returnType}
`
    )
    .join('\n')

export const flussTemplate = ({
  customTypes,
  flussFunctions,
  flussInputs,
  entireStateJSON,
}: FlussTemplateParams) => ts`
// State for a single step.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// FLUSS_GEN: CustomTypes - dynamic
${customTypes}

// FLUSS_GEN: FlussInputs - dynamic
${generateFlussInputs(flussInputs)}

// FLUSS_GEN: StepFunctionTypes - dynamic
${generateStepFunctionTypes(flussFunctions)}

// FLUSS_GEN: StepIO - dynamic
${generateStepIO(flussFunctions)}

// Step IDs type
// FIXED
type FlussStepId = keyof StepIO

// Step function types mapped from StepIO
// FIXED - assumign start and end identifiers do not change.
type StepFunctions = {
  [K in Exclude<FlussStepId, '${START_NODE_ID}' | '${END_NODE_ID}'>]: (
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
          'Source step ' + arg.sourceStepId + ' not complete for ' + String(arg.argumentName)
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
}): Promise<StepIO['${END_NODE_ID}']['output']> {
  const { inputs, stepFunctions } = params

  // Initialize the flow state with typed steps
  // This is generated new for each flow.
  const flowState: FlowState = {
    ${START_NODE_ID}: {
      id: '${START_NODE_ID}',
      status: 'done',
      execute: (args) => args,
      arguments: [],
      result: inputs,
    },
    ${flussFunctions
      .map(
        (flussFunction) => ts`${flussFunction.functionName}:{
      id: '${flussFunction.functionName}',
      status: 'waiting',
      execute: ${flussFunction.stepId === END_NODE_ID ? '(args) => args' : `stepFunctions.${flussFunction.functionName}`},
      arguments: [
        ${flussFunction.arguments
          .map(
            (arg) => ts`{
          sourceStepId: '${arg.source}',
          argumentName: '${arg.name}',
          ${arg.usesEntireOutput ? '' : `sourceProperty: '${arg.name}'`}
        }`
          )
          .join(',\n')}
      ]
    }`
      )
      .join(',\n')}

  }

  return new Promise<StepIO['${END_NODE_ID}']['output']>((resolve, reject) => {
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
          if (!flowState.${END_NODE_ID}.result) {
            return reject(new Error('End step has no result'))
          }
          return resolve(flowState.${END_NODE_ID}.result)
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
 * ${FlussTSStateJSONStart}${entireStateJSON}${FlussTSStateJSONEnd}
 */
`
