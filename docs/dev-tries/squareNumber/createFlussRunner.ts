export type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

type StepDependency = {
  sourceStepId: string
  argumentName: string
  sourceProperty?: string
}

export const createFlussRunner = <
  GOutput,
  GInput,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GStepFunctions extends Record<string, (args: any) => unknown>,
>(): ((args: {
  inputs: GInput
  stepFunctions: GStepFunctions
  dependencies: Record<keyof GStepFunctions | 'end', StepDependency[]>
}) => Promise<GOutput>) => {
  return async (args) => {
    const { inputs, stepFunctions, dependencies } = args

    type FlowState = {
      [K in keyof GStepFunctions | 'start' | 'end']: {
        status: FlussRunStatus
        result?: K extends keyof GStepFunctions
          ? Awaited<ReturnType<GStepFunctions[K]>>
          : K extends 'start'
            ? GInput
            : GOutput
        error?: Error
      }
    }

    // Initialize flowState with waiting status for each step
    const flowState: FlowState = {
      ...Object.keys(stepFunctions).reduce(
        (acc, key) => ({
          ...acc,
          [key]: { status: 'waiting' },
        }),
        {} as FlowState
      ),
      start: { status: 'done', result: inputs },
      end: { status: 'waiting' },
    }

    // Helper to check if all dependencies are met for a step
    const canStepRun = (stepId: keyof typeof dependencies): boolean => {
      return dependencies[stepId].every((dep) => {
        const sourceStep = flowState[dep.sourceStepId as keyof FlowState]
        return sourceStep.status === 'done' && sourceStep.result !== undefined
      })
    }

    // Helper to get input for a step based on its dependencies
    const getStepInput = (
      stepId: keyof typeof dependencies
    ): Record<string, unknown> => {
      const input: Record<string, unknown> = {}

      dependencies[stepId].forEach((dep) => {
        const sourceStep = flowState[dep.sourceStepId as keyof FlowState]
        if (sourceStep.status !== 'done' || sourceStep.result === undefined) {
          throw new Error(
            `Source step ${dep.sourceStepId} not complete for ${dep.argumentName}`
          )
        }

        // If sourceProperty is undefined, use the entire result
        // Otherwise, extract the specified property
        if (dep.sourceProperty === undefined) {
          input[dep.argumentName] = sourceStep.result
        } else {
          input[dep.argumentName] = (
            sourceStep.result as Record<string, unknown>
          )[dep.sourceProperty]
        }
      })

      return input
    }

    // Process steps that can run in parallel
    const processSteps = async (): Promise<void> => {
      const steps = [...Object.keys(stepFunctions), 'end'] as const
      const runnableSteps = steps.filter((stepId) => {
        return flowState[stepId].status === 'waiting' && canStepRun(stepId)
      })

      if (runnableSteps.length === 0) {
        if (steps.every((key) => flowState[key].status === 'done')) {
          return // All done
        }
        throw new Error('No steps can run and not all steps are done')
      }

      await Promise.all(
        runnableSteps.map(async (stepId) => {
          try {
            flowState[stepId].status = 'running'
            const input = getStepInput(stepId)

            let result: unknown
            if (stepId === 'end') {
              result = input
            } else {
              result = await stepFunctions[stepId](input)
            }

            flowState[stepId].status = 'done'
            flowState[stepId].result =
              result as FlowState[typeof stepId]['result']
          } catch (error) {
            flowState[stepId].status = 'error'
            flowState[stepId].error =
              error instanceof Error ? error : new Error(String(error))
            throw flowState[stepId].error
          }
        })
      )

      // Continue processing if there are more steps
      await processSteps()
    }

    // Start execution
    await processSteps()

    // Return the end result
    const endResult = flowState.end.result
    if (endResult === undefined) {
      throw new Error('End step has no result')
    }

    return endResult as GOutput
  }
}
