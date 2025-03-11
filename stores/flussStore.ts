import { produce } from 'immer'
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
import {
  FlussStep,
  FlussStepInput,
  FlussStepInputId,
  FlussStepOutputId,
  FlussStepOutputType,
  FlussStepOutputTypeId,
} from '@/fluss-lib/fluss'
import { devInitialState } from './initialState.dev'
import { createFlussNode, START_NODE_ID } from './storeHelpers'

export type FlussNodeOutputType = {
  name?: string
  typeId?: FlussStepOutputTypeId
}

export type FlussNodeData = {
  name: string
  description?: string
  inputs: FlussStepInput[]
  output?: FlussNodeOutputType
}

export type FlussNodeType = Node<FlussStep>

export type FlussState = {
  name: string
  // Here I want a union type with start nodes.
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
  setOutputType: (
    nodeId: string,
    outputId: FlussStepOutputId,
    outputType: FlussStepOutputTypeId
  ) => void
  setOutputName: (
    nodeId: string,
    outputId: FlussStepOutputId,
    outputType: FlussStepOutputTypeId
  ) => void
  setNodeName: (nodeId: string, name: string) => void
  setNodeDescription: (nodeId: string, description: string) => void
  addInput: (nodeId: string, inputId?: FlussStepInputId) => void
  removeInput: (nodeId: string, inputId: FlussStepInputId) => void
  addFlussParameter: () => void
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
          // apllyNodeChanges changes elements and then creates a new array, making it incompatible with immer.
          // see: https://github.com/xyflow/xyflow/issues/4253
          const updatedNodes = applyNodeChanges(
            changes,
            // Break out of immers immutability with a deep clone.
            structuredClone(get().nodes)
          )
          set({ nodes: updatedNodes })
        },
        onEdgesChange: (changes) => {
          changes.forEach((change) => {
            if (change.type === 'remove') {
              const edge = get().edges.find((e) => e.id === change.id)
              if (edge && edge.targetHandle)
                get().removeInput(edge.target, edge.targetHandle)
            }
          })
          set({ edges: applyEdgeChanges(changes, get().edges) })
        },
        onConnect: (connection) => {
          // If the Node filling connection Handle is used, we create a new connection.
          if (
            connection.targetHandle !== null &&
            connection.targetHandle.includes(NEW_CONNECTION_HANDLE_IDENTIFIER)
          ) {
            const newInputId: FlussStepInputId = nanoid(5)
            get().addInput(connection.target, newInputId)

            // Escape the execution to make sure internal updates after adding a handler happen.
            setTimeout(
              () =>
                get().onConnect({
                  source: connection.source,
                  sourceHandle: connection.sourceHandle,
                  target: connection.target,
                  targetHandle: `${connection.target}-${newInputId}`,
                }),
              1
            )
            return
          }
          set({ edges: addEdge(connection, get().edges) })
        },
        setNodes: (nodes) => {
          set({ nodes })
        },
        setEdges: (edges) => {
          set({ edges })
        },
        setOutputType: (nodeId, outputId, outputTypeId) => {
          set(
            produce((state: FlussStore) => {
              const node = state.nodes.find((node) => node.id === nodeId)
              if (node) {
                const output = node.data.outputs.find(
                  (output) => output.id === outputId
                )
                if (output) {
                  output.type = outputTypeId
                }
              }
            })
          )
        },
        setOutputName: (nodeId, outputId, outputName) => {
          set(
            produce((state: FlussStore) => {
              const node = state.nodes.find((node) => node.id === nodeId)
              if (node) {
                const output = node.data.outputs.find(
                  (output) => output.id === outputId
                )
                if (output) output.name = outputName
              }
            })
          )
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
          set(
            produce((state: FlussStore) => {
              const node = state.nodes.find((node) => node.id === nodeId)
              if (node && node.data.type !== 'start') {
                node.data.inputs.push({
                  id: inputId
                    ? `${node.id}-${inputId}`
                    : `${node.id}-${nanoid(5)}`,
                })
              }
            })
          )
        },
        removeInput: (nodeId, inputId) => {
          set(
            produce((state: FlussStore) => {
              const node = state.nodes.find((node) => node.id === nodeId)
              if (node) {
                if (node.data.type === 'start') return
                node.data.inputs = node.data.inputs.filter(
                  (input) => input.id !== inputId
                )
              }
            })
          )
        },
        setNodeName: (nodeId, name) => {
          set(
            produce((state: FlussStore) => {
              const node = state.nodes.find((node) => node.id === nodeId)
              if (node) {
                node.data.name = name
              }
            })
          )
        },
        setNodeDescription: (nodeId, description) => {
          set(
            produce((state: FlussStore) => {
              const node = state.nodes.find((node) => node.id === nodeId)
              if (node) {
                node.data.description = description
              }
            })
          )
        },
        addFlussParameter: () => {
          set(
            produce((state: FlussStore) => {
              const node = state.nodes.find((node) => node.id === START_NODE_ID)
              if (node && node.data.type === 'start') {
                node.data.outputs.push({
                  id: nanoid(5),
                  name: 'Unnamed',
                  type: 'void',
                })
              }
            })
          )
        },
        setViewport: (viewport) => {
          set({ viewport })
        },
      }),

      { name: 'FlussStore' }
    )
  )
}
