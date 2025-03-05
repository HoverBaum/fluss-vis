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
  Viewport,
  XYPosition,
} from '@xyflow/react'
import { createStore } from 'zustand/vanilla'
import { FlussStepOutputType, FlussStepOutputTypeId } from '@/fluss-lib/fluss'
import { devInitialState } from './initialState.dev'
import { createFlussNode } from './storeHelpers'

export type FlussNodeOutputType = {
  name?: string
  typeId?: FlussStepOutputTypeId
}

export type FlussNodeData = {
  name: string
  output?: FlussNodeOutputType
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
  setOutputName: (nodeId: string, outputType: FlussStepOutputTypeId) => void
  addNode: (position?: XYPosition) => void
  setViewport: (viewport: Viewport) => void
}

export type FlussStore = FlussState & FlussActions

export const createFlussStore = (initState: FlussState = devInitialState) => {
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
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      output: {
                        ...node.data.output,
                        typeId: outputTypeId,
                      },
                    },
                  }
                : node
            ),
          }))
          // We also need to check if we need to remove any edges.
          const targetNodes = get()
            .edges.filter((edge) => edge.source === nodeId)
            .map((edge) => get().nodes.find((node) => node.id === edge.target))
            .filter((node) => !!node)
          targetNodes.forEach((targetNode) => {
            const sourceNodeIdsForTarget = get()
              .edges.filter((edge) => edge.target === targetNode.id)
              .map((edge) => edge.source)
            const sourceNodes = get().nodes.filter((node) =>
              sourceNodeIdsForTarget.includes(node.id)
            )
            const allOutputTypes = sourceNodes.map(
              (node) => node.data.output?.typeId
            )
            const uniqueOutputTypes = [...new Set(allOutputTypes)]
            if (uniqueOutputTypes.length > 1) {
              // Remove the edge associated with this change.
              set({
                edges: get().edges.filter(
                  (edge) =>
                    !(edge.source === nodeId && edge.target === targetNode.id)
                ),
              })
            }
          })
        },
        setOutputName: (nodeId, outputName) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      output: {
                        ...node.data.output,
                        name: outputName,
                      },
                    },
                  }
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
