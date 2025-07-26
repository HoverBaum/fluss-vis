'use client'

import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { useReactFlow } from '@xyflow/react'
import { FilePlus2 } from 'lucide-react'
import { useZoom } from '@/components/useZoom'
import { SaveButton } from './_export/SaveButton'
import { AnimatePresence, motion } from 'motion/react'

const isDev = process.env.NODE_ENV === 'development'

type ToolPanelProps = {
  showGreeting?: boolean
}

export const ToolPanel = ({ showGreeting }: ToolPanelProps) => {
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
              x: window.screen.width / 2 - 150,
              y: window.screen.height / 2 - 250,
            })
          )
        }
      >
        Add Node <FilePlus2 />
        <AnimatePresence>
          {showGreeting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-8"
            >
              <p className="text-lg">👇 start by adding a node</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <SaveButton />
      {isDev && <span>{zoom.toFixed(2)}</span>}
    </div>
  )
}
