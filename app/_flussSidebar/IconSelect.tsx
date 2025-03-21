import { cn } from '@/lib/utils'
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
import { useEffect, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import {
  PossibleIcon,
  PossibleIconName,
  PossibleIcons,
} from '@/lib/possibleIcons'

const iconMap = PossibleIcons.reduce<Record<string, PossibleIcon>>(
  (acc, icon) => {
    acc[icon.name] = icon
    return acc
  },
  {}
)

type IconsSelectProps = {
  icon: PossibleIconName
  onSelect: (icon: PossibleIconName) => void
}

export const IconSelect = ({ icon, onSelect }: IconsSelectProps) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [icons, setIcons] = useState<PossibleIcon[]>([])
  const iconInfo = iconMap[icon]

  useEffect(() => {
    if (!searchValue) return setIcons([])
    const filteredIcons = PossibleIcons.filter((icon) =>
      icon.label.toLowerCase().includes(searchValue.toLowerCase())
    ).slice(0, 10)

    setIcons(filteredIcons)
  }, [searchValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {iconInfo ? (
            <span className="flex gap-2 items-center">
              <DynamicIcon name={iconInfo.name} />
              {iconInfo.label}
            </span>
          ) : (
            'Select Icon...'
          )}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search Icons..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {!searchValue && (
              <p className="p-6 text-center text-sm">
                Start typing to find Icons.
              </p>
            )}
            {!!searchValue && <CommandEmpty>No Icon found.</CommandEmpty>}
            <CommandGroup>
              {icons.map((icon) => (
                <CommandItem
                  key={icon.name}
                  value={icon.name}
                  onSelect={(currentValue) => {
                    onSelect(currentValue as PossibleIconName)
                    setOpen(false)
                  }}
                >
                  <DynamicIcon name={icon.name} />
                  {icon.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto',
                      iconInfo?.name === icon.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
