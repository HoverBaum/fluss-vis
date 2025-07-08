'use client'

import { ExamplesDropdown } from './_flussSidebar/ExamplesDropdown'
import { Label } from '@/components/ui/label'
import { LoadButton } from './_flussSidebar/LoadButton'
import { Card } from '@/components/ui/card'

export const Greeting = () => {
  // const setShowGreeting = useEditorStore((state) => state.setShowGreeting)
  // const loadFluss = useFlussStore((state) => state.loadFluss)

  // const startFresh = () => {
  //   setShowGreeting(false)
  //   loadFluss(initialState)
  // }

  return (
    <Card className="fixed top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-1/2 p-8 shadow-xl">
      <div>
        <h1 className="text-center text-5xl font-semibold">🦛 Fluss-Vis</h1>
        <div className="flex justify-center p-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="grid place-items-center">
              <span className="block text-9xl">🌊</span>
            </div>
            <div className="flex flex-col justify-around gap-4">
              <div>
                <Label className="mb-1">Start with an example</Label>
                <ExamplesDropdown />
              </div>
              <LoadButton variant="outline" />

              {/* <Button onClick={startFresh}>
                <SparklesIcon /> Start new Fluss
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
