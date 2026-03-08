'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DownloadIcon, SaveIcon } from 'lucide-react'
import { useSaveFluss } from './useSaveFluss'

type SaveButtonProps = {
  className?: React.ComponentProps<typeof Button>['className']
  variant?: React.ComponentProps<typeof Button>['variant']
}

function getSaveTooltipText(
  savedFileName: string | undefined,
  isFileSystemAccessAPIAvailable: boolean
): string {
  if (savedFileName) return `Save to: ${savedFileName}`
  if (isFileSystemAccessAPIAvailable) return 'Save to a new file'
  return 'Download file'
}

export const SaveButton = ({
  className = '',
  variant = 'secondary',
}: SaveButtonProps) => {
  const {
    saveToCurrentOrNew,
    canSave,
    isFileSystemAccessAPIAvailable,
    savedFileName,
  } = useSaveFluss()

  const tooltipText = getSaveTooltipText(
    savedFileName,
    isFileSystemAccessAPIAvailable
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          className={className}
          onClick={saveToCurrentOrNew}
          suppressHydrationWarning
        >
          {canSave && (
            <>
              Save <SaveIcon className="size-4" />
            </>
          )}
          {!canSave && (
            <>
              {isFileSystemAccessAPIAvailable ? (
                <>
                  Save to <DownloadIcon className="size-4" />
                </>
              ) : (
                <>
                  Download <DownloadIcon className="size-4" />
                </>
              )}
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltipText}</TooltipContent>
    </Tooltip>
  )
}
