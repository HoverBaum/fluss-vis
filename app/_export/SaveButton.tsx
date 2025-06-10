'use client'

import { Button } from '@/components/ui/button'
import { DownloadIcon, SaveIcon } from 'lucide-react'
import { useExport } from './useExport'
import { toast } from 'sonner'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { getFlussFilehandle } from '@/lib/useIndexDBUtils'
import { useMemo } from 'react'
import { stringToValidIdentifier } from '@/fluss-lib/nameConversion'

type SaveButtonProps = {
  className?: React.ComponentProps<typeof Button>['className']
  variant?: React.ComponentProps<typeof Button>['variant']
}

export const SaveButton = ({
  className = '',
  variant = 'secondary',
}: SaveButtonProps) => {
  const { flussExport } = useExport()
  const fileHandleKey = useFlussStore((state) => state.fileHandleKey)
  const fileName = useFlussStore(
    (state) => `${stringToValidIdentifier(state.name)}.fluss.ts`
  )
  const canSave = useMemo(
    () => fileHandleKey && fileHandleKey !== '',
    [fileHandleKey]
  )

  const saveFluss = async () => {
    const code = await flussExport()
    if (!code || code === '') {
      toast.error('Failed to export Fluss code, please try again.')
      return
    }

    // Do a "Save To" operation.
    if (!fileHandleKey || fileHandleKey === '') {
      const options = {
        suggestedName: fileName,
        types: [
          {
            description: 'Fluss TypeScript Files',
            accept: { 'application/typescript': ['.ts'] as ['.ts'] },
          },
        ],
      }
      try {
        const handle = await window.showSaveFilePicker(options)
        const writable = await handle.createWritable()
        await writable.write(code)
        await writable.close()
        toast.success('Fluss saved successfully.')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name !== 'AbortError') {
          console.error('Error saving Fluss:', error)
          toast.error('Failed to save Fluss.')
        }
        return
      }
    }

    // Update already opened file.
    try {
      const fileHandle = await getFlussFilehandle(fileHandleKey)
      if (!fileHandle) {
        toast.error(
          'File handle not found, please export and then re-open, sorry.'
        )
        return
      }

      const writable = await fileHandle.createWritable()
      await writable.write(code)
      await writable.close()
      toast.success('Fluss saved successfully.')
    } catch (error) {
      console.error('Error saving Fluss:', error)
      toast.error('Failed to save Fluss state.')
    }
  }

  return (
    <Button variant={variant} className={className} onClick={saveFluss}>
      {canSave ? (
        <>
          Save <SaveIcon />
        </>
      ) : (
        <>
          Save to <DownloadIcon />
        </>
      )}
    </Button>
  )
}
