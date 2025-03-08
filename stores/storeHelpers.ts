import { nanoid } from 'nanoid'
import { Position, XYPosition } from '@xyflow/react'
import { FlussNodeData, FlussNodeType } from './flussStore'

export const START_NODE_ID = 'start'
export const END_NODE_ID = 'end'

export const createFlussNode = (
  position: XYPosition,
  data?: FlussNodeData
): FlussNodeType => {
  // Make sure that each new node has at least a name.
  const nodeData = data || { name: 'New Node', inputs: [] }
  if (!nodeData.inputs) {
    nodeData.inputs = []
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
