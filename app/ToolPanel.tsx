'use client'

import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { useReactFlow } from '@xyflow/react'
import { FilePlus2 } from 'lucide-react'
import { Export } from './_export/Export'
import { useZoom } from '@/components/useZoom'

const isDev = process.env.NODE_ENV === 'development'

export const ToolPanel = () => {
  const { screenToFlowPosition } = useReactFlow()
  const addNode = useFlussStore((state) => state.addNode)
  const { zoom } = useZoom()

  return (
    <div className="flex gap-2">
      {/* <Button
        onClick={() => {
          // React Flow always has one more event for us to undo…
          undo()
          undo()
        }}
      >
        Undo
      </Button> */}
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          addNode(
            screenToFlowPosition({
              // Roughly estimate the new node to be centrally on screen.
              x: window.screen.width / 2 - 125,
              y: window.screen.height / 2 - 200,
            })
          )
        }
      >
        Add Node <FilePlus2 />
      </Button>

      <Export />
      {isDev && <span>{zoom.toFixed(2)}</span>}
    </div>
  )
}
