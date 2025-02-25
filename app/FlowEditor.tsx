'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { FlussNode } from './FlussNode'
import { FlussTitleDisplay } from './FlussTitleDisplay'
import { ModeToggle } from '@/components/ModeToggle'
import { useTheme } from 'next-themes'
import { useShallow } from 'zustand/react/shallow'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { FlussStore } from '@/stores/flussStore'

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

  const nodeTypes = useMemo(() => ({ riparian: FlussNode }), [])

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
        panOnScroll
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
