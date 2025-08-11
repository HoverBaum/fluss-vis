/**
 * This module serves as a central place for step operations.
 * We centralize these here to ease changes alter on.
 * Everything that makes assumptions about the structure of a steps data should be here.
 */

import { Position, XYPosition } from '@xyflow/react'
import { FlussNodeType } from './flussStore'
import { FlussStep } from '@/fluss-lib/fluss'
import { generateNodeId, generateOutputId } from '@/fluss-lib/flussId'

export const START_NODE_ID = 'start'
export const END_NODE_ID = 'end'

export const createFlussNode = (
  position: XYPosition,
  data?: FlussStep
): FlussNodeType => {
  const id = generateNodeId()

  const nodeData: FlussStep = data || {
    type: 'step',
    id,
    description: '',
    name: 'New Step',
    inputs: [],
    outputs: [
      {
        id: generateOutputId(),
        name: 'Unnamed',
        type: 'void',
      },
    ],
    state: 'entering',
  }

  return {
    id,
    position,
    type: 'flussNode',
    data: nodeData,
    sourcePosition: Position.Right,
  }
}
