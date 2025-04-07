import { nanoid } from 'nanoid'
import { FlussStepId, FlussStepInputId, FlussStepOutputId } from './fluss'

export const generateInputId = (): FlussStepInputId => {
  return `in-${nanoid()}`
}

export const generateOutputId = (): FlussStepOutputId => {
  return `out-${nanoid()}`
}

export const generateNodeId = (): FlussStepId => {
  return nanoid(5)
}

export const generateId = () => {
  return nanoid()
}
