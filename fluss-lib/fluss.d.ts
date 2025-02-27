import { LucideIcon } from 'lucide-react'

export type FlussStepOutputTypeId = string
export type FlussStepOutputType = {
  id: FlussStepOutputTypeId
  name: string
  content: string
  icon: LucideIcon
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
