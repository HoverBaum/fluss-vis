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
  // Make sure that each new node has at least a name.
  const nodeData = data || {
    type: 'step',
    id: nanoid(5),
    description: '',
    name: 'New Node',
    inputs: [],
    outputs: [
      {
        id: nanoid(5),
        name: 'Unnamed',
        type: 'void',
      },
    ],
  }

  return {
    id: nanoid(5),
    position,
    type: 'flussNode',
    data: nodeData,
    sourcePosition: Position.Right,
  }
}
