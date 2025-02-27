import { nanoid } from 'nanoid'
import { devtools } from 'zustand/middleware'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Position,
  Viewport,
  XYPosition,
} from '@xyflow/react'
import { createStore } from 'zustand/vanilla'
import { FlussStepOutputType, FlussStepOutputTypeId } from '@/fluss-lib/fluss'
import { Calculator, Signature, Slash, ToggleRight, User } from 'lucide-react'

export const START_NODE_ID = 'start'
export const END_NODE_ID = 'end'

export type FlussNodeData = {
  name: string
  outputTypeId?: FlussStepOutputTypeId
}

export type FlussNodeType = Node<FlussNodeData>

export type FlussState = {
  name: string
  nodes: FlussNodeType[]
  edges: Edge[]
  outputTypes: FlussStepOutputType[]
  viewport: Viewport
}

export type FlussActions = {
  rename: (name: string) => void
  onNodesChange: OnNodesChange<FlussNodeType>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setEdges: (edges: Edge[]) => void
  setNodes: (nodes: FlussNodeType[]) => void
  setOutputType: (nodeId: string, outputType: FlussStepOutputTypeId) => void
  addNode: (position?: XYPosition) => void
  setViewport: (viewport: Viewport) => void
}

export type FlussStore = FlussState & FlussActions

const createFlussNode = (
  position: XYPosition,
  data?: FlussNodeData
): FlussNodeType => ({
  id: nanoid(5),
  position,
  type: 'flussNode',
  data: data || { name: 'New Node' },
  sourcePosition: Position.Right,
})

export const defaultInitState: FlussState = {
  name: 'Untitled Fluss 🌊',
  nodes: [
    {
      ...createFlussNode(
        { x: 360, y: 200 },
        { outputTypeId: 'string', name: 'step 1' }
      ),
      id: 'TRqTC',
    },
    {
      ...createFlussNode(
        { x: 700, y: 250 },
        { outputTypeId: 'number', name: 'step 2' }
      ),
      id: 'XyASV',
    },
    {
      id: START_NODE_ID,
      position: { x: 50, y: 200 },
      type: 'startNode',
      data: { outputTypeId: 'person', name: 'Start' },
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

export const createFlussStore = (initState: FlussState = defaultInitState) => {
  return createStore<FlussStore>()(
    devtools(
      (set, get) => ({
        ...initState,
        rename: (name: string) => set({ name }),
        onNodesChange: (changes) => {
          set({
            nodes: applyNodeChanges(changes, get().nodes),
          })
        },
        onEdgesChange: (changes) => {
          set({
            edges: applyEdgeChanges(changes, get().edges),
          })
        },
        onConnect: (connection) => {
          set({
            edges: addEdge(connection, get().edges),
          })
        },
        setNodes: (nodes) => {
          set({ nodes })
        },
        setEdges: (edges) => {
          set({ edges })
        },
        setOutputType: (nodeId, outputTypeId) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, outputTypeId } }
                : node
            ),
          }))
        },
        addNode: (position?: XYPosition) => {
          set((state) => {
            return {
              nodes: [
                ...state.nodes,
                createFlussNode(
                  position || {
                    x: -state.viewport.x,
                    y: -state.viewport.y,
                  }
                ),
              ],
            }
          })
        },
        setViewport: (viewport) => {
          set({ viewport })
        },
      }),

      { name: 'FlussStore' }
    )
  )
}
