/**
 * The first variant, that can be run 🎉
 * Super explicit and probably unneeded complexity.
 */

type FlussInputs = {
  locale: Locale
  baseNumber: number
}

type Locale = 'de' | 'en'

type Step_Start_Input = FlussInputs
type Step_Start_Output = Step_Start_Input
type Step_XyASV_Input = Pick<Step_Start_Output, 'baseNumber'>
type Step_XyASV_Output = { squaredNumber: number }
type Step_TRqTC_Input = Pick<Step_Start_Output, 'locale'> &
  Pick<Step_XyASV_Output, 'squaredNumber'>
type Step_TRqTC_Output = { writtenEquation: string }
type Step_End_Input = Pick<Step_TRqTC_Output, 'writtenEquation'>
type Step_End_Output = Step_End_Input

// Step function definitions.
type StepFunctions = {
  squareNumber: (args: Step_XyASV_Input) => Promise<Step_XyASV_Output>
  createString: (args: Step_TRqTC_Input) => Promise<Step_TRqTC_Output>
}

type StepFunctionsAll = StepFunctions & {
  start: (args: Step_Start_Input) => Step_Start_Output
  end: (args: Step_End_Input) => Step_End_Output
}

// Our list of step IDs.
type FlussStepId = 'start' | 'end' | 'XyASV' | 'TRqTC'

// Run status union.
type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

// Mapping each ID to its corresponding function type.
type StepFunctionMapping = {
  start: StepFunctionsAll['start']
  end: StepFunctionsAll['end']
  XyASV: StepFunctionsAll['squareNumber']
  TRqTC: StepFunctionsAll['createString']
}

type Argument = {
  sourceStepId: FlussStepId
  name: string
}

type BaseStep<T extends FlussStepId> = {
  id: FlussStepId
  arguments: Argument[]
  execute: StepFunctionMapping[T]
}

// Discriminated union for a step:
// If status is 'done', a result property (of the appropriate type) is required;
// otherwise, the result is not present.
type Step<T extends FlussStepId> =
  | ({
      status: 'done'
      result: Awaited<ReturnType<StepFunctionMapping[T]>>
    } & BaseStep<T>)
  | ({
      status: Exclude<FlussRunStatus, 'done'>
    } & BaseStep<T>)

// A tuple type ensuring one step per ID, in a fixed order.
type StepsTuple = [Step<'start'>, Step<'end'>, Step<'XyASV'>, Step<'TRqTC'>]

// ----------------------------
//    Fluss Input and Output
// ----------------------------

type runFlussParams = {
  inputs: FlussInputs
  stepFunctions: StepFunctions
}

export const runFluss = async (
  flussArgs: runFlussParams
): Promise<Step_End_Output> => {
  const { inputs, stepFunctions } = flussArgs

  const steps: StepsTuple = [
    {
      id: 'start',
      status: 'done',
      execute: (args) => args,
      result: {
        ...inputs,
      },
      arguments: [],
    },
    {
      id: 'end',
      status: 'waiting',
      execute: (args) => args,
      arguments: [
        {
          sourceStepId: 'TRqTC',
          name: 'writtenEquation',
        },
      ],
    },
    {
      id: 'XyASV',
      status: 'waiting',
      execute: stepFunctions.squareNumber,
      arguments: [
        {
          sourceStepId: 'start',
          name: 'baseNumber',
        },
      ],
    },
    {
      id: 'TRqTC',
      status: 'waiting',
      execute: stepFunctions.createString,
      arguments: [
        {
          sourceStepId: 'start',
          name: 'locale',
        },
        {
          sourceStepId: 'XyASV',
          name: 'squaredNumber',
        },
      ],
    },
  ]

  const runSquareNumber = async () => {
    const step = steps.find((s) => s.id === 'XyASV') as Step<'XyASV'>
    const args: Step_XyASV_Input = {
      baseNumber: (
        steps.find(
          (s) => s.id === 'start' && s.status === 'done'
        ) as Step<'start'> & {
          status: 'done'
        }
      ).result.baseNumber,
    }
    const result = await step.execute(args)
    step.status = 'done'
    ;(step as Step<'XyASV'> & { status: 'done' }).result = result
  }

  const runCreateString = async () => {
    const step = steps.find((s) => s.id === 'TRqTC') as Step<'TRqTC'>
    const args: Step_TRqTC_Input = {
      locale: (
        steps.find(
          (s) => s.id === 'start' && s.status === 'done'
        ) as Step<'start'> & {
          status: 'done'
        }
      ).result.locale,
      squaredNumber: (
        steps.find(
          (s) => s.id === 'XyASV' && s.status === 'done'
        ) as Step<'XyASV'> & {
          status: 'done'
        }
      ).result.squaredNumber,
    }
    const result = await step.execute(args)
    step.status = 'done'
    ;(step as Step<'TRqTC'> & { status: 'done' }).result = result
  }

  const runEnd = async () => {
    const step = steps.find((s) => s.id === 'end') as Step<'end'>
    const args: Step_End_Input = {
      writtenEquation: (
        steps.find(
          (s) => s.id === 'TRqTC' && s.status === 'done'
        ) as Step<'TRqTC'> & {
          status: 'done'
        }
      ).result.writtenEquation,
    }
    const result = await step.execute(args)
    step.status = 'done'
    ;(step as Step<'end'> & { status: 'done' }).result = result
  }

  return new Promise<Step_End_Output>((resolve) => {
    const checkForRunnableSteps = () => {
      const canBeRun = steps
        .filter((step) => step.status === 'waiting')
        .filter((step) =>
          step.arguments.every(
            (argument) =>
              steps.find((s) => s.id === argument.sourceStepId)!.status ===
              'done'
          )
        )

      console.log('\n\nCurrently runnable:')
      console.log(canBeRun)

      // Check for finished.
      if (
        canBeRun.length === 0 &&
        steps.every((step) => step.status === 'done')
      ) {
        console.log('All steps done!')
        resolve(
          (
            steps.find((step) => step.id === 'end') as Step<'end'> & {
              status: 'done'
            }
          ).result
        )
        return
      } else if (canBeRun.length === 0) {
        console.log('No steps can be run.')
        throw new Error('No steps can be run.')
      }

      // Execute all steps that can be run.
      canBeRun.forEach(async (step) => {
        step.status = 'running'
        if (step.id === 'XyASV') {
          console.log('starting squareNumber')
          await runSquareNumber()
        }
        if (step.id === 'TRqTC') {
          console.log('starting createString')
          await runCreateString()
        }
        if (step.id === 'end') {
          console.log('starting end')
          await runEnd()
        }
        checkForRunnableSteps()
      })
    }

    checkForRunnableSteps()
  })
}

// Example usage
const result = await runFluss({
  inputs: {
    locale: 'en',
    baseNumber: 4,
  },
  stepFunctions: {
    squareNumber: ({ baseNumber }) =>
      new Promise((resolve) => resolve({ squaredNumber: baseNumber ** 2 })),
    createString: async ({ locale, squaredNumber }) => {
      // wait a second
      await new Promise((resolve) => setTimeout(resolve, 300))
      return {
        writtenEquation: `${locale} - ${squaredNumber}`,
      }
    },
  },
})
console.log('\n\nResult:')
console.log(result)
