import { FlussStep, FlussStepOutput } from './fluss'

export const outputFromStep = (
  step: FlussStep,
  id: string
): FlussStepOutput | undefined => {
  if (!step) return undefined
  switch (step.type) {
    case 'end':
      return undefined
    case 'start':
      return step.outputs.find((output) => output.id === id)
    case 'step':
      return step.outputs[0]
  }
}
