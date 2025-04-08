import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

type ExampleDropdownItemProps = {
  onClick: () => void
  name: string
  description?: string
}

export const ExampleDropdownItem = ({
  onClick,
  name,
  description,
}: ExampleDropdownItemProps) => {
  return (
    <DropdownMenuItem onClick={onClick} className="flex justify-between">
      {name}
      {description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </DropdownMenuItem>
  )
}
