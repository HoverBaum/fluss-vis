import { nanoid } from 'nanoid'
import { Position, XYPosition } from '@xyflow/react'
import { FlussNodeData, FlussNodeType } from './flussStore'

export const START_NODE_ID = 'start'
export const END_NODE_ID = 'end'

export const createFlussNode = (
  position: XYPosition,
  data?: FlussNodeData
): FlussNodeType => {
  // Make sure that each new node has at least one input and a name.
  const nodeData = data || { name: 'New Node', inputs: [{ id: nanoid(5) }] }
  if (!nodeData.inputs || nodeData.inputs.length === 0) {
    nodeData.inputs = [{ id: nanoid(5) }]
  }
  if (!nodeData.name) {
    nodeData.name = 'New Node'
  }

  return {
    id: nanoid(5),
    position,
    type: 'flussNode',
    data: nodeData,
    sourcePosition: Position.Right,
  }
}
