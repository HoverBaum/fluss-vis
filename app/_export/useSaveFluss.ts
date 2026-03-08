'use client'

import { useExport } from '@/app/_export/useExport'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { stringToValidIdentifier } from '@/fluss-lib/nameConversion'
import { getFlussFilehandle } from '@/lib/useIndexDBUtils'
import {
  clearCurrentFile,
  setCurrentFile,
  type FlussFileHandleStore,
} from '@/lib/flussFileHandle'
import { toast } from 'sonner'

function getSaveFilePickerOptions(suggestedName: string): {
  suggestedName: string
  types: Array<{
    description: string
    accept: { 'application/typescript': ['.ts'] }
  }>
} {
  return {
    suggestedName,
    types: [
      {
        description: 'Fluss TypeScript Files',
        accept: { 'application/typescript': ['.ts'] as ['.ts'] },
      },
    ],
  }
}

export function useSaveFluss() {
  const { flussExport } = useExport()
  const fileHandleKey = useFlussStore((state) => state.fileHandleKey)
  const savedFileName = useFlussStore((state) => state.savedFileName)
  const fileName = useFlussStore(
    (state) => `${stringToValidIdentifier(state.name)}.fluss.ts`
  )
  const setFileHandleKey = useFlussStore((state) => state.setFileHandleKey)
  const setSavedFileName = useFlussStore((state) => state.setSavedFileName)

  const store: FlussFileHandleStore = { setFileHandleKey, setSavedFileName }
  const isFileSystemAccessAPIAvailable =
    typeof window !== 'undefined' && 'showSaveFilePicker' in window

  async function saveToNewLocation(): Promise<void> {
    const code = await flussExport()
    if (!code || code === '') {
      toast.error('Failed to export Fluss code, please try again.')
      return
    }

    if (!isFileSystemAccessAPIAvailable) {
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

    try {
      const handle = await window.showSaveFilePicker(
        getSaveFilePickerOptions(fileName)
      )
      const writable = await handle.createWritable()
      await writable.write(code)
      await writable.close()
      await setCurrentFile(handle, store, fileHandleKey ?? undefined)
      toast.success('Fluss saved successfully.')
    } catch (error) {
      if (error instanceof DOMException && error.name !== 'AbortError') {
        console.error('Error saving Fluss:', error)
        toast.error('Failed to save Fluss.')
      }
    }
  }

  async function saveToCurrentOrNew(): Promise<void> {
    const code = await flussExport()
    if (!code || code === '') {
      toast.error('Failed to export Fluss code, please try again.')
      return
    }

    if (!isFileSystemAccessAPIAvailable) {
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

    if (!fileHandleKey || fileHandleKey === '') {
      await saveToNewLocation()
      return
    }

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
      console.error('Error saving Fluss with existing file handle:', error)
      await clearCurrentFile(fileHandleKey, store)
      await saveToCurrentOrNew()
    }
  }

  return {
    saveToCurrentOrNew,
    saveToNewLocation,
    canSave: Boolean(
      fileHandleKey && fileHandleKey !== '' && isFileSystemAccessAPIAvailable
    ),
    isFileSystemAccessAPIAvailable,
    savedFileName,
  }
}
