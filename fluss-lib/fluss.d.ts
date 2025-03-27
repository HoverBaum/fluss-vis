import { IconName } from 'lucide-react/dynamic'
import { ArrayOneElement, ArrayNotEmpty, ArrayEmpty } from './helperTypes'
import { AnimationState } from '@/stores/flussStore'

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
  state: AnimationState
}

type FlussStepBasics = {
  id: FlussStepId
  name: string
  description: string
  state: AnimationState
}

export type FlussStepDefault = FlussStepBasics & {
  type: 'step'
  outputs: ArrayOneElement<FlussStepOutput>
  inputs: FlussStepInput[]
}

export type FlussStepStart = FlussStepBasics & {
  type: 'start'
  outputs: ArrayNotEmpty<FlussStepOutput>
}

export type FlussStepEnd = FlussStepBasics & {
  type: 'end'
  outputs: ArrayEmpty
  inputs: FlussStepInput[]
}

export type FlussStep = FlussStepStart | FlussStepEnd | FlussStepDefault

export type FlussConfig = {
  steps: FlussStep[]
  startStepId: FlussStepId
  endStepId: FlussStepId
}
