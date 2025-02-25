'use client'

import React, { useCallback, useMemo } from 'react'
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { RiparianNode } from './RiparianNode'
import { FlussTitleDisplay } from './FlussTitleDisplay'

const initialNodes = [
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
]
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

export const FlowEditor = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const nodeTypes = useMemo(() => ({ custom: RiparianNode }), [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Panel position="top-center">
          <FlussTitleDisplay />
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
