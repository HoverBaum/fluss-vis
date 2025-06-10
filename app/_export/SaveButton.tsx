'use client'

import { Button } from '@/components/ui/button'
import { DownloadIcon, SaveIcon } from 'lucide-react'
import { useExport } from './useExport'
import { toast } from 'sonner'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { getFlussFilehandle, saveFlussFilehandle } from '@/lib/useIndexDBUtils'
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
  const setFileHandleKey = useFlussStore((state) => state.setFileHandleKey)

  const isFileSystemAccessAPIAvailable =
    typeof window !== 'undefined' && 'showSaveFilePicker' in window

  const canSave = useMemo(
    () =>
      fileHandleKey && fileHandleKey !== '' && isFileSystemAccessAPIAvailable,
    [fileHandleKey, isFileSystemAccessAPIAvailable]
  )

  const saveFluss = async () => {
    const code = await flussExport()
    if (!code || code === '') {
      toast.error('Failed to export Fluss code, please try again.')
      return
    }

    if (!isFileSystemAccessAPIAvailable) {
      // Fallback for browsers that do not support File System Access API (e.g., Safari)
      try {
        const blob = new Blob([code], { type: 'application/typescript' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Fluss downloaded successfully.')
      } catch (error) {
        console.error('Error downloading Fluss:', error)
        toast.error('Failed to download Fluss.')
      }
      return
    }

    // Do a "Save To" operation if now file handle exists.
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
        const fileHandleKey = await saveFlussFilehandle(handle)
        setFileHandleKey(fileHandleKey)
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
          'File handle not found. Please use "Save to" or re-open the file.'
        )
        return
      }

      const writable = await fileHandle.createWritable()
      await writable.write(code)
      await writable.close()
      toast.success('Fluss saved successfully.')
    } catch (error) {
      console.error('Error saving Fluss:', error)
      toast.error('Failed to save Fluss.')
    }
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={saveFluss}
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
  )
}
