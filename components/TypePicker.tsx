'use client'

import * as React from 'react'
import { Blocks, Calculator, LucideIcon, Signature } from 'lucide-react'
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

export type BaseIOTypes = 'string' | 'number' | 'complex'

type Status = {
  value: BaseIOTypes
  label: string
  icon: LucideIcon
}

type StatusMap = {
  [key in BaseIOTypes]: Status
}

const statuses: StatusMap = {
  string: {
    value: 'string',
    label: 'String',
    icon: Signature,
  },
  number: {
    value: 'number',
    label: 'Number',
    icon: Calculator,
  },
  complex: {
    value: 'complex',
    label: 'Custom',
    icon: Blocks,
  },
}

const statusArray: Status[] = Object.values(statuses)

type TypePickerProps = {
  type: BaseIOTypes | undefined
  onTypeChange: (type: BaseIOTypes) => void
}

export function TypePicker({ type, onTypeChange }: TypePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedType = type && statuses[type]

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Type</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[120px] justify-start"
          >
            {selectedType ? (
              <>
                <selectedType.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedType.label}
              </>
            ) : (
              <>Select Type</>
            )}
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
                {statusArray.map((status) => (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    /* @ts-expect-error Typing Problem in Shadcn... */
                    onSelect={(value) => {
                      onTypeChange(value)
                      setOpen(false)
                    }}
                  >
                    <status.icon
                      className={cn(
                        'mr-2 h-4 w-4',
                        status.value === selectedType?.value
                          ? 'opacity-100'
                          : 'opacity-40'
                      )}
                    />
                    <span>{status.label}</span>
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
