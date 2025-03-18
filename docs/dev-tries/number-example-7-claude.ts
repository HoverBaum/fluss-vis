/**
 * Claude iterated on 7.
 */

// --- Core Types ---

type FlussRunStatus = 'waiting' | 'running' | 'done' | 'error'

type StepDefinition<TInput, TOutput> = {
  id: string
  execute: (input: TInput) => Promise<TOutput> | TOutput
  dependencies: Array<{
    sourceStepId: string
    inputField: keyof TInput
    outputField: string
  }>
}

type StepState<TInput, TOutput> =
  | {
      status: 'waiting' | 'running' | 'error'
      definition: StepDefinition<TInput, TOutput>
      error?: Error
    }
  | {
      status: 'done'
      definition: StepDefinition<TInput, TOutput>
      result: TOutput
    }

// --- Step Creation Helper ---

function createStep<TInput, TOutput>(
  id: string,
  execute: (input: TInput) => Promise<TOutput> | TOutput,
  dependencies: Array<{
    sourceStepId: string
    inputField: keyof TInput
    outputField: string
  }>
): StepDefinition<TInput, TOutput> {
  return { id, execute, dependencies }
}

// --- Flow Engine ---

class FlussEngine<TInput, TOutput> {
  private steps: Array<StepState<any, any>> = []
  private inputValues: TInput
  private outputStepId: string

  constructor(inputValues: TInput, outputStepId: string) {
    this.inputValues = inputValues
    this.outputStepId = outputStepId

    // Add start step automatically
    this.addStep(createStep<{}, TInput>('start', () => inputValues, []))
  }

  addStep<TStepInput, TStepOutput>(
    stepDefinition: StepDefinition<TStepInput, TStepOutput>
  ): void {
    this.steps.push({
      status: 'waiting',
      definition: stepDefinition,
    })
  }

  async run(): Promise<TOutput> {
    return new Promise<TOutput>((resolve, reject) => {
      const processSteps = async () => {
        // Find all steps that can be run
        const runnableSteps = this.steps
          .filter((step) => step.status === 'waiting')
          .filter((step) => this.canStepRun(step))

        console.log(
          '\nCurrently runnable:',
          runnableSteps.map((s) => s.definition.id)
        )

        // Check if we're done
        if (runnableSteps.length === 0) {
          if (this.steps.every((step) => step.status === 'done')) {
            console.log('All steps done!')

            // Find the output step
            const outputStep = this.steps.find(
              (step) => step.definition.id === this.outputStepId
            ) as StepState<any, TOutput> & { status: 'done' }

            if (!outputStep) {
              return reject(
                new Error(`Output step ${this.outputStepId} not found`)
              )
            }

            return resolve(outputStep.result)
          } else {
            return reject(
              new Error('No steps can be run and not all steps are done')
            )
          }
        }

        // Run all runnable steps in parallel
        await Promise.all(
          runnableSteps.map(async (step) => {
            // Mark as running
            step.status = 'running'

            try {
              // Collect inputs
              const input = this.collectStepInputs(step)

              // Execute step
              const result = await step.definition.execute(input)

              // Update step with result
              ;(step as any).status = 'done'
              ;(step as any).result = result
            } catch (error) {
              step.status = 'error'
              ;(step as any).error = error
              return reject(error)
            }
          })
        )

        // Continue processing
        await processSteps()
      }

      // Start processing
      processSteps().catch(reject)
    })
  }

  private canStepRun(step: StepState<any, any>): boolean {
    // Start step can always run
    if (step.definition.id === 'start') return true

    // Check if all dependencies are satisfied
    return step.definition.dependencies.every((dep) => {
      const sourceStep = this.steps.find(
        (s) => s.definition.id === dep.sourceStepId
      )
      return sourceStep && sourceStep.status === 'done'
    })
  }

  private collectStepInputs(step: StepState<any, any>): any {
    const input: any = {}

    step.definition.dependencies.forEach((dep) => {
      const sourceStep = this.steps.find(
        (s) => s.definition.id === dep.sourceStepId
      ) as StepState<any, any> & { status: 'done' }

      if (sourceStep && sourceStep.status === 'done') {
        input[dep.inputField] = sourceStep.result[dep.outputField]
      }
    })

    return input
  }
}

// --- Example Usage ---

// Define our specific flow types
type FlussInputs = {
  locale: 'de' | 'en'
  baseNumber: number
}

type SquareNumberInput = {
  baseNumber: number
}

type SquareNumberOutput = {
  squaredNumber: number
}

type CreateStringInput = {
  locale: 'de' | 'en'
  squaredNumber: number
}

type CreateStringOutput = {
  writtenEquation: string
}

// Create the flow
async function runFluss(
  inputs: FlussInputs
): Promise<{ writtenEquation: string }> {
  // Create engine with inputs and output step
  const engine = new FlussEngine<FlussInputs, { writtenEquation: string }>(
    inputs,
    'end'
  )

  // Define steps
  engine.addStep(
    createStep<SquareNumberInput, SquareNumberOutput>(
      'squareNumber',
      async ({ baseNumber }) => {
        return { squaredNumber: baseNumber ** 2 }
      },
      [
        {
          sourceStepId: 'start',
          inputField: 'baseNumber',
          outputField: 'baseNumber',
        },
      ]
    )
  )

  engine.addStep(
    createStep<CreateStringInput, CreateStringOutput>(
      'createString',
      async ({ locale, squaredNumber }) => {
        // wait a bit
        await new Promise((resolve) => setTimeout(resolve, 300))
        return {
          writtenEquation: `${locale} - ${squaredNumber}`,
        }
      },
      [
        { sourceStepId: 'start', inputField: 'locale', outputField: 'locale' },
        {
          sourceStepId: 'squareNumber',
          inputField: 'squaredNumber',
          outputField: 'squaredNumber',
        },
      ]
    )
  )

  engine.addStep(
    createStep<{ writtenEquation: string }, { writtenEquation: string }>(
      'end',
      ({ writtenEquation }) => ({ writtenEquation }),
      [
        {
          sourceStepId: 'createString',
          inputField: 'writtenEquation',
          outputField: 'writtenEquation',
        },
      ]
    )
  )

  // Run the flow
  return await engine.run()
}

// Example execution
const result = await runFluss({
  locale: 'en',
  baseNumber: 4,
})

console.log('\n\nResult:')
console.log(result)
