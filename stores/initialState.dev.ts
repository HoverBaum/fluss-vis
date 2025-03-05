import { Position } from '@xyflow/react'
import { FlussState } from './flussStore'
import { Calculator, Signature, Slash, ToggleRight, User } from 'lucide-react'
import { createFlussNode, END_NODE_ID, START_NODE_ID } from './storeHelpers'

export const devInitialState: FlussState = {
  name: 'Untitled Fluss 🌊',
  nodes: [
    {
      ...createFlussNode(
        { x: 360, y: 200 },
        { output: { typeId: 'string', name: 'Improved name' }, name: 'step 1' }
      ),
      id: 'TRqTC',
    },
    {
      ...createFlussNode(
        { x: 700, y: 250 },
        { output: { typeId: 'number', name: 'Magic number' }, name: 'step 2' }
      ),
      id: 'XyASV',
    },
    {
      id: START_NODE_ID,
      position: { x: 50, y: 200 },
      type: 'startNode',
      data: { output: { typeId: 'person', name: 'Person' }, name: 'Start' },
      sourcePosition: Position.Right,
      deletable: false,
    },
    {
      id: END_NODE_ID,
      position: { x: 1000, y: 200 },
      type: 'endNode',
      data: { name: 'End' },
      sourcePosition: Position.Right,
      deletable: false,
    },
  ],
  edges: [
    {
      source: 'start',
      sourceHandle: 'start-output',
      target: 'TRqTC',
      targetHandle: 'TRqTC-input-1',
      id: 'xy-edge__startstart-output-TRqTCTRqTC-input-1',
    },
    {
      source: 'TRqTC',
      sourceHandle: 'TRqTC-output',
      target: 'XyASV',
      targetHandle: 'XyASV-input-1',
      id: 'xy-edge__TRqTCTRqTC-output-XyASVXyASV-input-1',
    },
    {
      source: 'XyASV',
      sourceHandle: 'XyASV-output',
      target: 'end',
      targetHandle: 'end-input-1',
      id: 'xy-edge__XyASVXyASV-output-endend-input-1',
    },
  ],
  outputTypes: [
    {
      id: 'void',
      name: 'Void',
      content: 'void',
      isPrimitive: true,
      icon: Slash,
    },
    {
      id: 'string',
      name: 'String',
      content: 'string',
      isPrimitive: true,
      icon: Signature,
    },
    {
      id: 'number',
      name: 'Number',
      content: 'number',
      isPrimitive: true,
      icon: Calculator,
    },
    {
      id: 'boolean',
      name: 'Boolean',
      content: 'boolean',
      isPrimitive: true,
      icon: ToggleRight,
    },
    {
      id: 'person',
      name: 'Person',
      content: '{name: string}',
      icon: User,
    },
  ],
  viewport: { x: 0, y: 0, zoom: 1 },
}
