import { nanoid } from 'nanoid'
import { BaseIOTypes } from '@/components/nodes/TypePicker'
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

export const START_NODE_ID = 'start'

export type FlussNodeData = { outputType?: BaseIOTypes }

export type FlussNodeType = Node<FlussNodeData>

export type FlussState = {
  name: string
  nodes: FlussNodeType[]
  edges: Edge[]
  viewport: Viewport
}

export type FlussActions = {
  rename: (name: string) => void
  onNodesChange: OnNodesChange<FlussNodeType>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setEdges: (edges: Edge[]) => void
  setNodes: (nodes: FlussNodeType[]) => void
  setOutputType: (nodeId: string, outputType: BaseIOTypes) => void
  addNode: (position?: XYPosition) => void
  setViewport: (viewport: Viewport) => void
}

export type FlussStore = FlussState & FlussActions

const createFlussNode = (position: XYPosition): FlussNodeType => ({
  id: nanoid(5),
  position,
  type: 'flussNode',
  data: {},
  sourcePosition: Position.Right,
})

export const defaultInitState: FlussState = {
  name: 'Untitled Fluss 🌊',
  nodes: [
    createFlussNode({ x: 360, y: 200 }),
    createFlussNode({ x: 700, y: 250 }),
    {
      id: START_NODE_ID,
      position: { x: 50, y: 200 },
      type: 'startNode',
      data: {},
      sourcePosition: Position.Right,
    },
  ],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
}

export const createFlussStore = (initState: FlussState = defaultInitState) => {
  return createStore<FlussStore>()(
    devtools(
      (set, get) => ({
        ...initState,
        rename: (name: string) => set({ name }),
        onNodesChange: (changes) => {
          // Filter out changes we want to prevent.
          const changesToUse = changes.filter((change) => {
            if (change.type === 'remove') {
              if (change.id === START_NODE_ID) return false
            }
            return true
          })
          set({
            nodes: applyNodeChanges(changesToUse, get().nodes),
          })
        },
        onEdgesChange: (changes) => {
          // Prevent Edge deletions when undeletable nodes are selected.
          const changesToUse = changes.filter((change) => {
            if (change.type === 'remove') {
              if (
                get().nodes.find((node) => node.selected)?.id === START_NODE_ID
              )
                return false
            }
            return true
          })
          set({
            edges: applyEdgeChanges(changesToUse, get().edges),
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
        setOutputType: (nodeId, outputType) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, outputType } }
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
