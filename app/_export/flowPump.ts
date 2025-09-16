/* eslint-disable @typescript-eslint/prefer-as-const */
/**
 * Executor for Fluss flows, pumping data through the fluss.
 */

import { END_NODE_ID } from '@/stores/nodeHelpers'

type PumpStepStatus = 'waiting' | 'running' | 'done' | 'error'

// Generic constraint for a Step IO map
type StepIOLike = Record<string, { input: unknown; output: unknown }>
type Awaitable<T> = T | Promise<T>

// A single step config, parameterized by the IO map (TIO) and the step id (ID)
type PumpStepConfig<ID extends keyof TIO, TIO extends StepIOLike> = {
  id: ID
  status?: PumpStepStatus
  execute: (args: TIO[ID]['input']) => Awaitable<TIO[ID]['output']>
  arguments: Array<{
    // IDs must come from the SAME map
    sourceStepId: keyof TIO
    // Arg name must exist on THIS step's input
    argumentName: keyof TIO[ID]['input']
    sourceProperty?: string
  }>
  result?: TIO[ID]['output']
  error?: Error
}

// The collection of all steps, keyed by the SAME IO map
type PumpSteps<TIO extends StepIOLike> = {
  [K in keyof TIO]: PumpStepConfig<K, TIO>
}

type PumpFluss<TIO extends StepIOLike> = {
  name: string
  steps: PumpSteps<TIO>
}

type PumpOptions = {
  shouldLogToConsole: boolean
  endStepId: string
}

const defaultOptions: PumpOptions = {
  shouldLogToConsole: false,
  endStepId: END_NODE_ID,
}

const pumpFluss = <TIO extends StepIOLike>(
  fluss: PumpFluss<TIO>,
  pumpOptions?: PumpOptions
) => {
  // Create the options to use by overwriting all defaults with provided.
  const options: PumpOptions = { ...defaultOptions, ...(pumpOptions || {}) }
  if (options.shouldLogToConsole) console.log(`Pumping ${fluss.name}`)
}

const exampleSteps = {
  start: {
    id: 'start' as 'start',
    input: {},
    output: {},
    arguments: [],
    execute: () => {
      // step logic here
      return {}
    },
  },
  end: {
    id: 'end' as 'end',
    input: {},
    output: {},
    arguments: [],
    execute: () => {
      // step logic here
      return {}
    },
  },
}
const examplePumpFluss: PumpFluss<typeof exampleSteps> = {
  name: 'example',
  steps: exampleSteps,
}
pumpFluss(examplePumpFluss)
