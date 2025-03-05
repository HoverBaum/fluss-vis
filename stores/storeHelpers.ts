import { nanoid } from 'nanoid'
import { Position, XYPosition } from '@xyflow/react'
import { FlussNodeData, FlussNodeType } from './flussStore'

export const START_NODE_ID = 'start'
export const END_NODE_ID = 'end'

export const createFlussNode = (
  position: XYPosition,
  data?: FlussNodeData
): FlussNodeType => ({
  id: nanoid(5),
  position,
  type: 'flussNode',
  data: data || { name: 'New Node' },
  sourcePosition: Position.Right,
})
