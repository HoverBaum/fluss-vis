'use client'

import { Button } from '@/components/ui/button'
import { SidebarIcon, SparklesIcon } from 'lucide-react'
import { ExamplesDropdown } from './_flussSidebar/ExamplesDropdown'
import { Label } from '@/components/ui/label'

type GreetingProps = {
  toggleFlussSidebar: () => void
}

export const Greeting = ({ toggleFlussSidebar }: GreetingProps) => {
  return (
    <div className="grid h-full w-full place-items-center p-4">
      <Button
        onClick={toggleFlussSidebar}
        size="icon"
        variant="ghost"
        className="absolute top-4 left-4"
      >
        <SidebarIcon />
      </Button>
      <div>
        <h1 className="text-5xl font-semibold">Welcome to Fluss-Vis</h1>
        <div className="flex justify-center p-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="grid place-items-center">
              <span className="block text-9xl">🌊</span>
            </div>
            <div className="flex flex-col justify-around">
              <div>
                <Label className="mb-1">Start with an example Fluss</Label>
                <ExamplesDropdown />
              </div>

              <Button>
                <SparklesIcon /> Start new Fluss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
