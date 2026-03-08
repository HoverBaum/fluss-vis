'use client'

import { FlussTSStateJSONEnd, FlussTSStateJSONStart } from '@/lib/constants'
import { FlussState } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { setCurrentFile, type FlussFileHandleStore } from '@/lib/flussFileHandle'
import { toast } from 'sonner'

function parseAndValidateFlussContent(content: string): FlussState {
  const hasMarkers =
    content.includes(FlussTSStateJSONStart) &&
    content.includes(FlussTSStateJSONEnd)
  if (!hasMarkers) {
    toast.error('File does not contain the required markers.')
    throw new Error(
      'File does not contain the required markers for Fluss state.'
    )
  }
  const afterStartMarker = content.split(FlussTSStateJSONStart)[1]
  const beforeEndMarker = afterStartMarker?.split(FlussTSStateJSONEnd)[0]
  const jsonString = beforeEndMarker?.trim()
  if (!jsonString) throw new Error('Invalid Fluss state in file.')
  return JSON.parse(jsonString) as FlussState
}

export function useLoadFluss() {
  const loadFluss = useFlussStore((state) => state.loadFluss)
  const fileHandleKey = useFlussStore((state) => state.fileHandleKey)
  const setFileHandleKey = useFlussStore((state) => state.setFileHandleKey)
  const setSavedFileName = useFlussStore((state) => state.setSavedFileName)

  const store: FlussFileHandleStore = { setFileHandleKey, setSavedFileName }

  async function openAndLoadFluss(): Promise<void> {
    if (typeof window === 'undefined') return

    if ('showOpenFilePicker' in window) {
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'Fluss TypeScript Files',
              accept: { 'application/typescript': ['.ts'] },
            },
          ],
          excludeAcceptAllOption: true,
        })
        const file = await fileHandle.getFile()
        const contents = await file.text()
        const stateFromJSON = parseAndValidateFlussContent(contents)
        loadFluss(stateFromJSON)
        await setCurrentFile(fileHandle, store, fileHandleKey ?? undefined)
        toast.success('Fluss loaded successfully.')
      } catch (error) {
        if (error instanceof DOMException && error.name !== 'AbortError') {
          console.error('Error opening file:', error)
          toast.error('Error opening file. Please try again.')
        }
      }
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.ts'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        toast.error('No file selected.')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (content) {
          try {
            const stateFromJSON = parseAndValidateFlussContent(
              content.toString()
            )
            loadFluss(stateFromJSON)
            toast.success('Fluss loaded successfully.')
          } catch {
            // toast already shown in parseAndValidateFlussContent
          }
        } else {
          toast.error('No content in the file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return { openAndLoadFluss }
}
