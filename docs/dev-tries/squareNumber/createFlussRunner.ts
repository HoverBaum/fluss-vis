export const createFlussRunner = <
  GOutput,
  GInput,
  GStepFunctions extends Record<string, (args: GArgs) => unknown>,
  GArgs extends Record<string, unknown> = Record<string, unknown>,
>(): ((args: {
  inputs: GInput
  stepFunctions: GStepFunctions
}) => Promise<GOutput>) => {
  console.log('createFlussRunner called')
  return async (args) => {
    const { inputs, stepFunctions } = args

    type FlowState = {
      [K in keyof GStepFunctions]: Awaited<ReturnType<GStepFunctions[K]>>
    }

    // Initialize flowState with one entry per function in GStepFunctions
    const flowState: FlowState = Object.keys(stepFunctions).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: { undefined },
        }
      },
      {} as FlowState
    )
    console.log('Initial Flow State:', flowState)

    // First function gets the inputs
    const firstKey = Object.keys(stepFunctions)[0]
    if (firstKey) {
      const result = await stepFunctions[firstKey](inputs as unknown as GArgs)
      flowState[firstKey as keyof GStepFunctions] =
        result as FlowState[typeof firstKey]
    }

    // Execute remaining functions in sequence and store results
    for (const [key, fn] of Object.entries(stepFunctions).slice(1)) {
      const prevKey =
        Object.keys(stepFunctions)[Object.keys(stepFunctions).indexOf(key) - 1]
      const prevResult = flowState[prevKey as keyof GStepFunctions]
      const result = await fn(prevResult as GArgs)
      flowState[key as keyof GStepFunctions] = result as FlowState[typeof key]
    }

    // Return the last result as GOutput
    const lastKey = Object.keys(flowState).pop()
    if (!lastKey) {
      throw new Error('No steps to execute')
    }

    return flowState[lastKey] as unknown as GOutput
  }
}
