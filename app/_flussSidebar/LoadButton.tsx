'use client'

import { SidebarMenuButton } from '@/components/ui/sidebar'
import { FlussTSStateJSONEnd, FlussTSStateJSONStart } from '@/lib/constants'
import { saveFlussFilehandle } from '@/lib/useIndexDBUtils'
import { useEditorStore } from '@/stores/EditorStoreProvider'
import { FlussState } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { FolderIcon } from 'lucide-react'
import { toast } from 'sonner'

export const LoadButton = () => {
  const loadFluss = useFlussStore((state) => state.loadFluss)
  const setFileHandleKey = useFlussStore((state) => state.setFileHandleKey)
  const setShowGreeting = useEditorStore((state) => state.setShowGreeting)

  /**
   * Once we have file contents as string check that it is a valid fluss and load it.
   * This "continue" function is needed because we have multiple entry points based on available APIs.
   */
  const handleLoadedContent = (content: string) => {
    const hasMarkers =
      content.includes(FlussTSStateJSONStart) &&
      content.includes(FlussTSStateJSONEnd)
    if (!hasMarkers) {
      // TODO: direct users to a place where they can learn more.
      toast.error('File does not contain the required markers.')
      throw new Error(
        'File does not contain the required markers for Fluss state.'
      )
    }
    const afterStartMarker = content.split(FlussTSStateJSONStart)[1]
    const beforeEndMarker = afterStartMarker.split(FlussTSStateJSONEnd)[0]
    const jsonString = beforeEndMarker.trim()
    const stateFromJSON = JSON.parse(jsonString)

    // TODO: Check if the state is valid.

    loadFluss(stateFromJSON as FlussState)
    setShowGreeting(false)
    toast.success('Fluss loaded successfully.')
  }

  const handleFileSelect = async () => {
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
        handleLoadedContent(contents)
        // Save the file handle for future use.
        const fileHandleKey = await saveFlussFilehandle(fileHandle)
        setFileHandleKey(fileHandleKey)
      } catch (error) {
        if (error instanceof DOMException && error.name !== 'AbortError') {
          console.error('Error opening file:', error)
          toast.error('Error opening file. Please try again.')
        }
      }
      return
    }

    // If showOpenFilePicker is not available, use a fallback method.
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.ts'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('Selected file:', file)
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result
          if (content) {
            const stringContent = content.toString()
            handleLoadedContent(stringContent)
          } else {
            // No content
            toast.error('No content in the file.')
          }
        }
        reader.readAsText(file)
      } else {
        // No file selected
        toast.error('No file selected.')
      }
    }
    input.click()
  }

  return (
    <SidebarMenuButton
      className="flex w-full items-center"
      onClick={handleFileSelect}
    >
      <FolderIcon className="size-4" /> Open Fluss
    </SidebarMenuButton>
  )
}
