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
  Viewport,
  XYPosition,
} from '@xyflow/react'
import { createStore } from 'zustand/vanilla'
import { FlussStepOutputType, FlussStepOutputTypeId } from '@/fluss-lib/fluss'
import { devInitialState } from './initialState.dev'
import { createFlussNode } from './storeHelpers'

type NonEmptyArray<T> = [T, ...T[]]
export type FlussNodeInputId = string

export type FlussNodeOutputType = {
  name?: string
  typeId?: FlussStepOutputTypeId
}

export type FlussNodeInputType = {
  id: FlussNodeInputId
}

export type FlussNodeData = {
  name: string
  description?: string
  inputs?: NonEmptyArray<FlussNodeInputType>
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
  addInput: (nodeId: string, inputId?: FlussNodeInputId) => void
  addNode: (position?: XYPosition) => void
  setViewport: (viewport: Viewport) => void
}

export type FlussStore = FlussState & FlussActions
export const NEW_CONNECTION_HANDLE_IDENTIFIER = 'new-connection'

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
          // If the Node filling connection Handle is used, we create a new connection.
          if (
            connection.targetHandle !== null &&
            connection.targetHandle.includes(NEW_CONNECTION_HANDLE_IDENTIFIER)
          ) {
            console.log('Dropped on Big Handle')
            console.log(connection)
            const newInputId: FlussNodeInputId = nanoid(5)
            get().addInput(connection.target, newInputId)
            get().onConnect({
              source: connection.source,
              sourceHandle: connection.sourceHandle,
              target: connection.target,
              targetHandle: `${connection.target}-${newInputId}`,
            })
            return
          }
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
        addNode: (position) => {
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
        addInput: (nodeId, inputId) => {
          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      inputs: [
                        ...(node.data.inputs || []),
                        { id: inputId || nanoid(5) },
                      ],
                    },
                  }
                : node
            ),
          }))
        },
        setViewport: (viewport) => {
          set({ viewport })
        },
      }),

      { name: 'FlussStore' }
    )
  )
}
