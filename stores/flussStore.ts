import { BaseIOTypes } from '@/components/TypePicker'
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
} from '@xyflow/react'
import { createStore } from 'zustand/vanilla'

export type FlussNodeType = Node<{ outputType?: BaseIOTypes }>

export type FlussState = {
  name: string
  nodes: FlussNodeType[]
  edges: Edge[]
}

export type FlussActions = {
  rename: (name: string) => void
  onNodesChange: OnNodesChange<FlussNodeType>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setNodes: (nodes: FlussNodeType[]) => void
  setEdges: (edges: Edge[]) => void
  setOutputType: (nodeId: string, outputType: BaseIOTypes) => void
}

export type FlussStore = FlussState & FlussActions

export const defaultInitState: FlussState = {
  name: 'Untitled Fluss 🌊',
  nodes: [
    {
      id: '3',
      position: { x: 210, y: 200 },
      type: 'riparian',
      data: {},
      sourcePosition: Position.Right,
    },
    {
      id: '4',
      position: { x: 550, y: 250 },
      type: 'riparian',
      data: {},
      sourcePosition: Position.Right,
    },
  ],
  edges: [],
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
        setOutputType: (nodeId, outputType) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, outputType } }
                : node
            ),
          }))
        },
      }),
      { name: 'FlussStore' }
    )
  )
}
