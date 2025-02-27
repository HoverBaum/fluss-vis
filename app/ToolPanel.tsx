'use client'

import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { useReactFlow } from '@xyflow/react'
import { useExport } from './useExport'
import { Download, FilePlus2 } from 'lucide-react'

export const ToolPanel = () => {
  const { screenToFlowPosition } = useReactFlow()
  const addNode = useFlussStore((state) => state.addNode)
  const { flussExport } = useExport()

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
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

      <Button size="sm" variant="outline" onClick={flussExport}>
        Export <Download />
      </Button>
    </div>
  )
}
