'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ReactFlow, Background, BackgroundVariant, MiniMap, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { FlussNode } from '@/components/nodes/flussNode/FlussNode'
import { StartNode } from '@/components/nodes/startNode/StartNode'
import { EndNode } from '@/components/nodes/endNode/EndNode'
import { FlussEdge } from '@/components/FlussEdge'
import { Button } from '@/components/ui/button'
import { decodeSharedFluss } from '@/lib/share'
import { FlussState } from '@/stores/flussStore'
import { toast } from 'sonner'
import { FrownIcon } from 'lucide-react'

export default function OpenPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const encodedFluss = searchParams.get('fluss')
  const loadFluss = useFlussStore((flussStore) => flussStore.loadFluss)

  const sharedFluss = useMemo(() => {
    if (!encodedFluss) return null
    try {
      const decodedFluss = decodeSharedFluss<FlussState>(encodedFluss)
      return decodedFluss
    } catch (e) {
      return null
    }
  }, [encodedFluss])

  const nodeTypes = useMemo(
    () => ({
      flussNode: FlussNode,
      startNode: StartNode,
      endNode: EndNode,
    }),
    []
  )

  const edgeTypes = useMemo(
    () => ({
      flussEdge: FlussEdge,
    }),
    []
  )

  const handleUseThisFluss = () => {
    if (!sharedFluss) return
    try {
      // Ensure flags not meant for persistence are reset
      const nextState: FlussState = {
        ...sharedFluss.state,
        uiState: { isEditSidebarOpen: false, isTypeDialogOpen: false },
        hasHydrated: true,
        fileHandleKey: undefined,
      }
      loadFluss(nextState)
      toast.success('Loaded shared fluss into editor.')
      router.push('/')
    } catch (e) {
      toast.error('Failed to load shared fluss.')
    }
  }

  if (!encodedFluss) {
    return (
      <div className="grid min-h-[80svh] place-items-center p-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold">Open Shared Fluss</h1>
          <p className="mt-2 text-muted-foreground">No shared fluss found in URL.</p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/">Back to Editor</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!sharedFluss) {
    return (
      <div className="grid min-h-[80svh] place-items-center p-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">Invalid Shared Fluss <FrownIcon /></h1>
          <p className="mt-2 text-muted-foreground">The provided link is invalid or corrupted.</p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/">Back to Editor</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { nodes, edges, name } = sharedFluss.state

  return (
    <div className="flex h-[calc(100svh-0.5rem)] flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shared Fluss</h1>
          <p className="text-muted-foreground">{name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button onClick={handleUseThisFluss}>Use this Fluss</Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-xl border">
        {/* Make nodes and handles non-interactive in the preview */}
        <style>
          {`
            .react-flow__node { pointer-events: none; }
            .react-flow__handle { display: none !important; }
          `}
        </style>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Controls showInteractive={false} />
          <MiniMap pannable={false} zoomable={false} maskColor="transparent" />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}

