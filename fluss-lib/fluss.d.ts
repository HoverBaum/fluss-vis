import { LucideIcon } from 'lucide-react'

export type FlussStepOutputTypeId = string
export type FlussStepOutputType = {
  id: FlussStepOutputTypeId
  name: string
  content: string
  icon: LucideIcon
  /**
   * Whether this type is a primitive of TypeScript, e.g. `string`, `number`, `boolean`.
   * Not used within the Fluss-Viz UI, but for code generation.
   * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean
   */
  isPrimitive?: boolean
}

export type FlussStepId = string
export type FlussStepOutputId = string
export type FlussStepInputId = string

export type FlussStepOutput = {
  id: FlussStepOutputId
  name: string
  type: FlussStepOutputType
}

export type FlussStepInput = {
  id: FlussStepInputId
  source: FlussStepOutputId
}

export type FlussStep = {
  id: FlussStepId
  title: string
  describe: string
  type: 'start' | 'end' | 'step'
  output: FlussStepOutput
  inputs: FlussStepInput[]
}

export type FlussConfig = {
  steps: FlussStep[]
  startStepId: FlussStepId
  endStepId: FlussStepId
}
