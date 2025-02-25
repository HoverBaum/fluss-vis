'use client'

import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'

export const ToolPanel = () => {
  const addNode = useFlussStore((state) => state.addNode)

  return (
    <div>
      <Button size="sm" variant="outline" onClick={addNode}>
        Add Node
      </Button>
    </div>
  )
}
