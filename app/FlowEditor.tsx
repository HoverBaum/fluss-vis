'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
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
import { SidebarProvider } from '@/components/ui/sidebar'
import { StepEditSidebar } from './StepEditSidebar'
import { Button } from '@/components/ui/button'
import { SidebarIcon } from 'lucide-react'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'
import { PortalNode, PortalNodeData } from '@/components/nodes/PortalNode'
import { FlussStep } from '@/fluss-lib/fluss'
import { Greeting } from './Greeting'

const selector = (state: FlussStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

type FlowEditorProps = {
  toggleFlussSidebar: () => void
}

export const FlowEditor = ({ toggleFlussSidebar }: FlowEditorProps) => {
  const isEditSidebarOpen = useFlussStore(
    (store) => store.uiState.isEditSidebarOpen
  )
  const elevateEdgesOnSelect = useSettingsStore(
    (store) => store.edgesSelectedToFront
  )
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlussStore(useShallow(selector))
  const showGreeting = useFlussStore((store) => store.uiState.isShowingGreeting)

  // Hack to make sure we know the clients theme and only render on client.
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const nodeTypes = useMemo(
    () => ({
      flussNode: FlussNode,
      startNode: StartNode,
      endNode: EndNode,
      portalNode: PortalNode,
    }),
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

  const allNodes: Node<PortalNodeData | FlussStep>[] = useMemo(() => {
    if (!showGreeting) return nodes
    return [
      ...nodes,
      {
        id: 'greeting',
        type: 'portalNode',
        position: { x: 370, y: 180 },
        data: { children: <Greeting /> },
        selectable: false,
        hidden: false,
      } as Node<PortalNodeData>,
    ]
  }, [nodes, showGreeting])

  if (!isMounted) return null

  return (
    <SidebarProvider open={isEditSidebarOpen} className="h-full min-h-auto">
      <ReactFlow
        // We handle all state related things through Zustand.
        // @ts-expect-error No idea where nodes is types to expect only FlussNodeType…
        nodes={allNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // Sync theme with apps theme.
        colorMode={theme as 'system' | 'light' | 'dark'}
        // For dev we might have different things on client.
        suppressHydrationWarning
        // Users can pan using a trackpad.
        panOnScroll
        // Min and Max zoom levels. Relate to useZoom hook.
        minZoom={0.3}
        maxZoom={2}
        // Initially zoom to see entire Fluss.
        fitView
        // Validate connections - make sure only one per output -> node.
        isValidConnection={isValidConnection}
        // Brings edges to front, also when connected nodes are selected.
        elevateEdgesOnSelect={elevateEdgesOnSelect}
        // We use our Edge.
        defaultEdgeOptions={{
          type: 'flussEdge',
        }}
        // Docs said we are free to do this - encourage support.
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Panel position="top-left">
          <Button size="icon" variant="ghost" onClick={toggleFlussSidebar}>
            <SidebarIcon />
          </Button>
        </Panel>
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

      <StepEditSidebar />
    </SidebarProvider>
  )
}
