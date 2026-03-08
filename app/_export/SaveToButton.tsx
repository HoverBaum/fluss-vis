'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DownloadIcon } from 'lucide-react'
import { useSaveFluss } from './useSaveFluss'

type SaveToButtonProps = {
  className?: React.ComponentProps<typeof Button>['className']
  variant?: React.ComponentProps<typeof Button>['variant']
}

export const SaveToButton = ({
  className = '',
  variant = 'secondary',
}: SaveToButtonProps) => {
  const {
    saveToNewLocation,
    isFileSystemAccessAPIAvailable,
    canSave,
  } = useSaveFluss()

  const isDisabled = !canSave

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          className={className}
          onClick={saveToNewLocation}
          disabled={isDisabled}
          suppressHydrationWarning
        >
          {isFileSystemAccessAPIAvailable ? (
            <>Save to… <DownloadIcon className="size-4" /></>
          ) : (
            <>Download… <DownloadIcon className="size-4" /></>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {isDisabled
          ? 'Save or open a file first to save to another location'
          : 'Save a copy to a new location'}
      </TooltipContent>
    </Tooltip>
  )
}
