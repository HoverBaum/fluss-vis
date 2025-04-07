'use client'

import * as React from 'react'
import { DynamicIcon } from 'lucide-react/dynamic'
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
import { FlussStepOutputType, FlussStepOutputTypeId } from '@/fluss-lib/fluss'
import { Label } from '../ui/label'

type TypePickerProps = {
  typeId?: string
  onTypeChange: (type: FlussStepOutputTypeId) => void
}

const selectedOutputFirst =
  (id: string) => (a: FlussStepOutputType, b: FlussStepOutputType) => {
    if (a.id === id) return -1
    if (b.id === id) return 1
    return 0
  }

export function TypePicker({ typeId, onTypeChange }: TypePickerProps) {
  const [open, setOpen] = React.useState(false)
  const outputTypes = useFlussStore((state) => state.outputTypes)

  return (
    <div className="flex items-center space-x-4">
      <Label>Type</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[120px] justify-start overflow-hidden"
          >
            {typeId ? <EdgeType outputTypeId={typeId} /> : <>Select Type</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Select Type…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {[...outputTypes]
                  .sort(selectedOutputFirst(typeId || ''))
                  .map((outputType) => (
                    <CommandItem
                      key={outputType.id}
                      value={outputType.typeName}
                      onSelect={() => {
                        onTypeChange(outputType.id)
                        setOpen(false)
                      }}
                      className={cn(
                        outputType.id === typeId ? 'bg-positive/20' : ''
                      )}
                    >
                      <DynamicIcon
                        name={outputType.icon}
                        className={cn(
                          'mr-2 h-4 w-4',
                          outputType.id === typeId
                            ? 'opacity-100'
                            : 'opacity-40'
                        )}
                      />
                      <span>
                        {outputType.displayName}
                        {outputType.id === typeId && ' (Selected)'}
                      </span>
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
