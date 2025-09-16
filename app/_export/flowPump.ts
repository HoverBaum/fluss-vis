/**
 * Executor for Fluss flows, pumping data through the fluss.
 */

import { END_NODE_ID } from '@/stores/nodeHelpers'

type PumpStepStatus = 'waiting' | 'running' | 'done' | 'error'
type PumpStepConfig = {
  id: string
  status: PumpStepStatus
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any) => any
  arguments: {
    sourceStepId: string
    argumentName: string
    sourceProperty?: string
  }[]
  result?: unknown
  error?: Error
}

type PumpFluss = {
  name: string
  steps: PumpStepConfig[]
}

type PumpOptions = {
  shouldLogToConsole: boolean
  endStepId: string
}

const defaultOptions: PumpOptions = {
  shouldLogToConsole: false,
  endStepId: END_NODE_ID,
}

/**
 * We asume that earlier there was a check to ensure als source steps were done!
 */
const executeStep = async (
  step: PumpStepConfig,
  sourceSteps: PumpStepConfig[]
) => {
  // Build the required inputs.
  const input: Record<string, unknown> = {}
  for (const argument of step.arguments) {
    // ATTENTION: we use "!" here because we assume the step is present.
    const sourceStep = sourceSteps.find(
      (step) => step.id === argument.sourceStepId
    )!
    if (
      argument.sourceProperty === undefined ||
      sourceStep.result === undefined ||
      sourceStep.result === null
    ) {
      input[argument.argumentName] = sourceStep.result
    } else {
      input[argument.argumentName] = (
        sourceStep.result as Record<string, unknown>
      )[argument.sourceProperty]
    }
  }

  // Execute the step.
  console.log(`Executing ${step.id}`)
  const result = await step.execute(input)
  // Log the output produced by this step
  console.log('Result for', String(step.id), ':', result)
  return result
}

export const pumpFluss = async (
  fluss: PumpFluss,
  pumpOptions?: PumpOptions
) => {
  // Create the options to use by overwriting all defaults with provided.
  const options: PumpOptions = { ...defaultOptions, ...(pumpOptions || {}) }
  if (options.shouldLogToConsole) console.log(`Pumping ${fluss.name}`)

  const pumpState = fluss.steps
  const endStep = pumpState.find((step) => step.id === options.endStepId)!
  const runningStepsPromises = new Map<string, Promise<void>>()

  const startRunnableSteps = async () => {
    const doneStepsIds = pumpState
      .filter((step) => step.status === 'done')
      .map((step) => step.id)

    // Iterate over all waiting steps and start those that can run.
    const waitingSteps = pumpState.filter((step) => step.status === 'waiting')
    for (const step of waitingSteps) {
      const stepsThatNeedToBeDone = step.arguments.map(
        (argument) => argument.sourceStepId
      )
      const canStepRun = stepsThatNeedToBeDone.every((needsToBeDoneId) =>
        doneStepsIds.includes(needsToBeDoneId)
      )
      if (!canStepRun) return

      // Run this step.
      step.status = 'running'
      const stepPromis = executeStep(
        step,
        pumpState.filter((step) => stepsThatNeedToBeDone.includes(step.id))
      ).then((result) => {
        step.result = result
        step.status = 'done'
        console.log(`Finsihed ${step.id}`, result)
      })
      runningStepsPromises.set(step.id, stepPromis)
    }
  }
  startRunnableSteps()

  while (true) {
    startRunnableSteps()
    if (endStep.status === 'done') {
      return endStep.result
    }
    if (runningStepsPromises.size === 0) {
      throw new Error('No steps running and not done...')
    }
    await Promise.race(runningStepsPromises.values())
  }
}
