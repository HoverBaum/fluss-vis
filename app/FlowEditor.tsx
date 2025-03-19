'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Panel,
  ReactFlow,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { FlussTitleDisplay } from './FlussTitleDisplay'
import { ModeToggle } from '@/components/ModeToggle'
import { useTheme } from 'next-themes'
import { useShallow } from 'zustand/react/shallow'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { FlussStore } from '@/stores/flussStore'
import { ToolPanel } from './ToolPanel'
import { FlussNode } from '@/components/nodes/flussNode/FlussNode'
import { StartNode } from '@/components/nodes/startNode/StartNode'
import { EndNode } from '@/components/nodes/endNode/EndNode'
import { FlussEdge } from '@/components/FlussEdge'

const selector = (state: FlussStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

export const FlowEditor = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlussStore(useShallow(selector))

  // Hack to make sure we know the clients theme and only render on client.
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const nodeTypes = useMemo(
    () => ({ flussNode: FlussNode, startNode: StartNode, endNode: EndNode }),
    []
  )
  const edgeTypes = useMemo(
    () => ({
      flussEdge: FlussEdge,
    }),
    []
  )

  // Prevent connection when source handle is already connectd to target.
  const isValidConnection = (connection: Connection | Edge) => {
    const existingConnection = edges.find(
      (edge) =>
        edge.source === connection.source &&
        edge.target === connection.target &&
        edge.sourceHandle === connection.sourceHandle
    )
    if (existingConnection) {
      return false
    }

    return true
  }

  if (!isMounted) return null

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={theme as 'system' | 'light' | 'dark'}
        suppressHydrationWarning
        panOnScroll
        isValidConnection={isValidConnection}
        elevateEdgesOnSelect
        defaultEdgeOptions={{
          type: 'flussEdge',
        }}
      >
        <Panel position="bottom-center">
          <ToolPanel />
        </Panel>
        <Panel position="top-center">
          <FlussTitleDisplay />
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <ModeToggle />
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
