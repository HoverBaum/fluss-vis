import debounce from 'just-debounce-it'
import { produce } from 'immer'
import { temporal } from 'zundo'
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
  XYPosition,
} from '@xyflow/react'
import { createStore } from 'zustand/vanilla'
import {
  FlussStep,
  FlussStepInputId,
  FlussStepOutput,
  FlussStepOutputId,
  FlussStepOutputType,
  FlussStepOutputTypeId,
} from '@/fluss-lib/fluss'
import { devInitialState } from './initialState.dev'
import { createFlussNode, START_NODE_ID } from './storeHelpers'
import { ArrayNotEmpty } from '@/fluss-lib/helperTypes'
import { newId, shortId } from '@/fluss-lib/flussId'

export type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited'

export type FlussNodeOutputType = {
  name?: string
  typeId?: FlussStepOutputTypeId
}

export type FlussEdgeData = {
  state: AnimationState
}

export type FlussNodeType = Node<FlussStep>
export type FlussEdgeType = Edge<FlussEdgeData>

export type FlussState = {
  name: string
  // Here I want a union type with start nodes.
  nodes: FlussNodeType[]
  edges: FlussEdgeType[]
  outputTypes: FlussStepOutputType[]
  isEditSidebarOpen: boolean
}

export type FlussActions = {
  rename: (name: string) => void
  onNodesChange: OnNodesChange<FlussNodeType>
  onEdgesChange: OnEdgesChange<FlussEdgeType>
  onConnect: OnConnect
  setEdges: (edges: FlussEdgeType[]) => void
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
  removeFlussParameter: (outputId: FlussStepOutputId) => void
  addNode: (position: XYPosition) => void
  removeNode: (nodeId: string) => void
  outputTypeUpdate: (
    typeId: FlussStepOutputTypeId,
    type: Partial<FlussStepOutputType>
  ) => void
  outputTypeAdd: (type: FlussStepOutputType) => void
  outputTypeRemove: (typeId: FlussStepOutputTypeId) => void
  editSidebarOpen: () => void
  editSidebarClose: () => void
  edgeSetState: (edgeId: string, state: AnimationState) => void
}

export type FlussStore = FlussState & FlussActions
export const NEW_CONNECTION_HANDLE_IDENTIFIER = 'new-connection'

export const createFlussStore = (initState: FlussState = devInitialState) => {
  return createStore<FlussStore>()(
    temporal(
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
            const idsTriggeredExitings: string[] = []
            changes.forEach((change) => {
              if (change.type === 'remove') {
                const edge = get().edges.find((edge) => edge.id === change.id)

                // If the Edge has not existed yet, we toggle the exiting state.
                if (edge?.data?.state !== 'exited') {
                  get().edgeSetState(change.id, 'exiting')
                  idsTriggeredExitings.push(change.id)

                  // After 0.3s in exiting state we can reply the removal.
                  setTimeout(() => {
                    get().edgeSetState(change.id, 'exited')
                    get().onEdgesChange([change])
                  }, 300)
                  return
                }

                // Once the Edge has exited, we remove all connected inputs.
                if (edge && edge.targetHandle)
                  set(
                    produce((state: FlussStore) => {
                      const node = state.nodes.find(
                        (node) => node.id === edge.target
                      )
                      if (node && node.data.type !== 'start') {
                        node.data.inputs = node.data.inputs.filter(
                          (input) => input.id !== edge.targetHandle
                        )
                      }
                    })
                  )
              }
            })
            const changesToApply = changes.filter(
              (change) =>
                !(
                  change.type === 'remove' &&
                  idsTriggeredExitings.includes(change.id)
                )
            )
            set({ edges: applyEdgeChanges(changesToApply, get().edges) })
          },
          onConnect: (connection) => {
            // If the Node filling connection Handle is used, we create a new connection.
            if (
              connection.targetHandle !== null &&
              connection.targetHandle.includes(NEW_CONNECTION_HANDLE_IDENTIFIER)
            ) {
              const newInputId: FlussStepInputId = newId()
              get().addInput(connection.target, newInputId)

              // Escape the execution to make sure internal updates after adding a handler happen.
              setTimeout(
                () =>
                  get().onConnect({
                    source: connection.source,
                    sourceHandle: connection.sourceHandle,
                    target: connection.target,
                    targetHandle: newInputId,
                  }),
                1
              )
              return
            }
            set({
              edges: addEdge(
                { ...connection, data: { state: 'entering' } },
                get().edges
              ),
            })
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
                nodes: [...state.nodes, createFlussNode(position)],
              }
            })
          },
          removeNode: (nodeId) => {
            get().onNodesChange([{ id: nodeId, type: 'remove' }])
            // Also remove all connected Edges.
            // onEdgesChange hanldes the removal of Inputs.
            const affectedEdges = get().edges.filter(
              (edge) => edge.source === nodeId || edge.target === nodeId
            )
            get().onEdgesChange(
              affectedEdges.map((edge) => ({ ...edge, type: 'remove' }))
            )
          },
          addInput: (nodeId, inputId) => {
            set(
              produce((state: FlussStore) => {
                const node = state.nodes.find((node) => node.id === nodeId)
                if (node && node.data.type !== 'start') {
                  node.data.inputs.push({
                    id: inputId ? inputId : newId(),
                    state: 'entered',
                  })
                }
              })
            )
          },
          removeInput: (nodeId, inputId) => {
            set(
              produce((state: FlussStore) => {
                const node = state.nodes.find((node) => node.id === nodeId)
                if (node && node.data.type !== 'start') {
                  const input = node.data.inputs.find(
                    (input) => input.id === inputId
                  )
                  if (input) {
                    input.state = 'exiting'
                  }
                }
              })
            )

            // Removing Edges will remove the input from state.
            get().onEdgesChange(
              get()
                .edges.filter(
                  (edge) =>
                    edge.target === nodeId && edge.targetHandle === inputId
                )
                .map((edge) => ({ ...edge, type: 'remove' }))
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
                const node = state.nodes.find(
                  (node) => node.id === START_NODE_ID
                )
                if (node && node.data.type === 'start') {
                  node.data.outputs.push({
                    id: shortId(),
                    name: 'Unnamed',
                    type: 'void',
                  })
                }
              })
            )
          },
          removeFlussParameter: (outputId) => {
            set(
              produce((state: FlussStore) => {
                const node = state.nodes.find(
                  (node) => node.id === START_NODE_ID
                )
                if (node && node.data.type === 'start') {
                  const newOutputs = node.data.outputs.filter(
                    (output) => output.id !== outputId
                  )
                  // Start Node must have at least one output.
                  if (newOutputs.length > 0) {
                    node.data.outputs =
                      newOutputs as ArrayNotEmpty<FlussStepOutput>
                    // Remove all associated edges.
                    state.edges = state.edges.filter(
                      (edge) =>
                        edge.source !== START_NODE_ID ||
                        edge.sourceHandle !== outputId
                    )
                  }
                }
              })
            )
          },
          outputTypeUpdate: (typeId, type) => {
            set(
              produce((state: FlussStore) => {
                const outputType = state.outputTypes.find(
                  (outputType) => outputType.id === typeId
                )
                if (outputType) {
                  Object.assign(outputType, type)
                }
              })
            )
          },
          outputTypeAdd: (type) => {
            set(
              produce((state: FlussStore) => {
                state.outputTypes.push(type)
              })
            )
          },
          outputTypeRemove: (typeId) => {
            set(
              produce((state: FlussStore) => {
                state.outputTypes = state.outputTypes.filter(
                  (outputType) => outputType.id !== typeId
                )
              })
            )
            // Set all outputs using this type to void.
            set(
              produce((state: FlussStore) => {
                state.nodes.forEach((node) => {
                  node.data.outputs.forEach((output) => {
                    if (output.type === typeId) {
                      output.type = 'void'
                    }
                  })
                })
              })
            )
          },
          editSidebarOpen: () => set({ isEditSidebarOpen: true }),
          editSidebarClose: () => set({ isEditSidebarOpen: false }),
          edgeSetState: (edgeId, newState) => {
            set(
              produce((state: FlussStore) => {
                const edge = state.edges.find((edge) => edge.id === edgeId)
                if (edge) {
                  edge.data = { state: newState }
                }
              })
            )
          },
        }),

        { name: 'FlussStore' }
      ),
      {
        // How many steps one can go back.
        limit: 100,
        // Exclude some properties from the history.
        partialize: (state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { isEditSidebarOpen, ...rest } = state
          return rest
        },
        // Throttle history snapshots.
        handleSet: (handleSet) =>
          debounce<typeof handleSet>((state) => {
            handleSet(state)
          }, 300),
      }
    )
  )
}
