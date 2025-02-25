'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { ModeToggle } from '@/components/ModeToggle'
import { useTheme } from 'next-themes'

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
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()

  // Hack to make sure we know the clients theme and only render on client.
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const nodeTypes = useMemo(() => ({ custom: RiparianNode }), [])

  if (!isMounted) return null

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={theme as 'system' | 'light' | 'dark'}
        suppressHydrationWarning
      >
        <Panel position="top-center">
          <FlussTitleDisplay />
        </Panel>
        <Panel position="top-right">
          <ModeToggle />
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
