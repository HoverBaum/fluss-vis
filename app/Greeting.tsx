'use client'

import { Button } from '@/components/ui/button'
import { SparklesIcon } from 'lucide-react'
import { ExamplesDropdown } from './_flussSidebar/ExamplesDropdown'
import { Label } from '@/components/ui/label'
import { useEditorStore } from '@/stores/EditorStoreProvider'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { initialState } from '@/stores/flussStore'
import { LoadButton } from './_flussSidebar/LoadButton'

export const Greeting = () => {
  const setShowGreeting = useEditorStore((state) => state.setShowGreeting)
  const loadFluss = useFlussStore((state) => state.loadFluss)

  const startFresh = () => {
    setShowGreeting(false)
    loadFluss(initialState)
  }

  return (
    <div className="grid h-full w-full place-items-center p-4">
      <div>
        <h1 className="text-5xl font-semibold">Welcome to Fluss-Vis</h1>
        <div className="flex justify-center p-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="grid place-items-center">
              <span className="block text-9xl">🌊</span>
            </div>
            <div className="flex flex-col justify-around gap-4">
              <div>
                <Label className="mb-1">Start with an example Fluss</Label>
                <ExamplesDropdown />
              </div>
              <LoadButton variant="outline" />

              <Button onClick={startFresh}>
                <SparklesIcon /> Start new Fluss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
