'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { EdgeType } from '@/components/nodes/EdgeType'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { FlussStepOutputTypeId } from '@/fluss-lib/fluss'
import { Label } from '../ui/label'

type TypePickerProps = {
  typeId?: string
  onTypeChange: (type: FlussStepOutputTypeId) => void
}

export function TypePicker({ typeId, onTypeChange }: TypePickerProps) {
  const [open, setOpen] = React.useState(false)
  const outputTypes = useFlussStore((state) => state.outputTypes)

  return (
    <div className="flex items-center space-x-4">
      <Label>Type</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[120px] justify-start">
            {typeId ? <EdgeType outputTypeId={typeId} /> : <>Select Type</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          {/* @ts-expect-error Typing Problem in Shadcn... */}
          <Command>
            {/* @ts-expect-error Typing Problem in Shadcn... */}
            <CommandInput placeholder="Select Type…" />
            {/* @ts-expect-error Typing Problem in Shadcn... */}
            <CommandList>
              {/* @ts-expect-error Typing Problem in Shadcn... */}
              <CommandEmpty>No results found.</CommandEmpty>
              {/* @ts-expect-error Typing Problem in Shadcn... */}
              <CommandGroup>
                {outputTypes.map((outputType) => (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  <CommandItem
                    key={outputType.id}
                    value={outputType.id}
                    /* @ts-expect-error Typing Problem in Shadcn... */
                    onSelect={(value) => {
                      onTypeChange(value)
                      setOpen(false)
                    }}
                  >
                    <outputType.icon
                      className={cn(
                        'mr-2 h-4 w-4',
                        outputType.id === typeId ? 'opacity-100' : 'opacity-40'
                      )}
                    />
                    <span>{outputType.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
