import { nanoid } from 'nanoid'
import { Position, XYPosition } from '@xyflow/react'
import { FlussNodeType } from './flussStore'
import { FlussStep } from '@/fluss-lib/fluss'

export const START_NODE_ID = 'start'
export const END_NODE_ID = 'end'

export const createFlussNode = (
  position: XYPosition,
  data?: FlussStep
): FlussNodeType => {
  const id = nanoid(5)

  const nodeData = data || {
    type: 'step',
    id,
    description: '',
    name: 'New Node',
    inputs: [],
    outputs: [
      {
        id: nanoid(10),
        name: 'Unnamed',
        type: 'void',
      },
    ],
  }

  return {
    id,
    position,
    type: 'flussNode',
    data: nodeData,
    sourcePosition: Position.Right,
  }
}
