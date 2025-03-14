import { IconName } from 'lucide-react/dynamic'
import { ArrayOneElement, ArrayNotEmpty, ArrayEmpty } from './helperTypes'

export type FlussStepOutputTypeId = string
export type FlussStepOutputType = {
  id: FlussStepOutputTypeId
  typeName: string
  displayName: string
  content: string
  icon: IconName
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
  type: FlussStepOutputTypeId
}

export type FlussStepInput = {
  id: FlussStepInputId
}

export type FlussStepDefault = {
  type: 'step'
  id: FlussStepId
  name: string
  description: string
  outputs: ArrayOneElement<FlussStepOutput>
  inputs: FlussStepInput[]
}

export type FlussStepStart = {
  type: 'start'
  id: FlussStepId
  name: string
  description: string
  outputs: ArrayNotEmpty<FlussStepOutput>
}

export type FlussStepEnd = {
  type: 'end'
  id: FlussStepId
  name: string
  description: string
  outputs: ArrayEmpty
  inputs: FlussStepInput[]
}

export type FlussStep = FlussStepStart | FlussStepEnd | FlussStepDefault

export type FlussConfig = {
  steps: FlussStep[]
  startStepId: FlussStepId
  endStepId: FlussStepId
}
