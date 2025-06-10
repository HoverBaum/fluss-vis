'use client'

import { useFlussStore } from '@/stores/FlussStoreProvider'
import { SaveButton } from './SaveButton'
import { Export } from './Export'
import { Button } from '@/components/ui/button'

type ExportOrSaveButtonProps = {
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: React.ComponentProps<typeof Button>['className']
}

export const ExportOrSaveButton = ({
  variant = 'secondary',
  className = '',
}: ExportOrSaveButtonProps) => {
  // If a fileHandleKey exists, we can save to that.
  const canSave = useFlussStore(
    (state) => state.fileHandleKey && state.fileHandleKey !== ''
  )

  return <SaveButton className={className} variant={variant} />
}
