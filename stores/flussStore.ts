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

type FlussNode = Node

export type FlussState = {
  name: string
  nodes: FlussNode[]
  edges: Edge[]
}

export type FlussActions = {
  rename: (name: string) => void
  onNodesChange: OnNodesChange<FlussNode>
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setNodes: (nodes: FlussNode[]) => void
  setEdges: (edges: Edge[]) => void
}

export type FlussStore = FlussState & FlussActions

export const defaultInitState: FlussState = {
  name: 'Untitled Fluss 🌊',
  nodes: [
    {
      id: '3',
      position: { x: 210, y: 200 },
      type: 'custom',
      data: {},
      sourcePosition: Position.Right,
    },
    {
      id: '4',
      position: { x: 550, y: 250 },
      type: 'custom',
      data: {},
      sourcePosition: Position.Right,
    },
  ],
  edges: [],
}

export const createFlussStore = (initState: FlussState = defaultInitState) => {
  return createStore<FlussStore>()((set, get) => ({
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
  }))
}
