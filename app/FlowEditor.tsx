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
import { FlowEditorViewportReporter } from './FlowEditorViewportReporter'
import { FlussNode } from '@/components/nodes/flussNode/FlussNode'
import { StartNode } from '@/components/nodes/startNode/StartNode'
import { EndNode } from '@/components/nodes/endNode/EndNode'
import { SidebarTrigger } from '@/components/ui/sidebar'

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

  const validateConnection = (newConnection: Connection | Edge): boolean => {
    const sourceId = newConnection.source
    const targetHandle = newConnection.targetHandle
    if (!targetHandle) return true
    // Check if there already is any connection to the same targetHandle.
    const existingConnection = edges.find(
      (edge) => edge.targetHandle === targetHandle
    )
    // No connection yet, always good to go.
    if (!existingConnection) return true

    // Next check if the new connection would be of the same type.
    const sourceNode = nodes.find((node) => node.id === sourceId)
    const sourceOutputType = sourceNode?.data?.output?.typeId
    const previousType = nodes.find(
      (node) => node.id === existingConnection.source
    )?.data?.output?.typeId
    if (sourceOutputType !== previousType) return false

    return true
  }

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
        isValidConnection={validateConnection}
      >
        <FlowEditorViewportReporter />
        <Panel position="bottom-center">
          <ToolPanel />
        </Panel>
        <Panel position="top-center">
          <FlussTitleDisplay />
        </Panel>
        <Panel position="top-right">
          <ModeToggle />
          <SidebarTrigger />
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
