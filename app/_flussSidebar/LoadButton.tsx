import { SidebarMenuButton } from '@/components/ui/sidebar'
import { FlussTSStateJSONEnd, FlussTSStateJSONStart } from '@/lib/constants'
import { FlussState } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { FolderIcon } from 'lucide-react'
import { toast } from 'sonner'

export const LoadButton = () => {
  const loadFluss = useFlussStore((state) => state.loadFluss)

  const handleFileSelect = () => {
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
            const hasMarkers =
              stringContent.includes(FlussTSStateJSONStart) &&
              stringContent.includes(FlussTSStateJSONEnd)
            if (!hasMarkers) {
              // TODO: direct users to a place where they can learn more.
              toast.error('File does not contain the required markers.')
              return
            }
            const afterStartMarker = stringContent.split(
              FlussTSStateJSONStart
            )[1]
            const beforeEndMarker =
              afterStartMarker.split(FlussTSStateJSONEnd)[0]
            const jsonString = beforeEndMarker.trim()
            const stateFromJSON = JSON.parse(jsonString)
            console.log('Parsed state:', stateFromJSON)

            // TODO: Check if the state is valid.

            loadFluss(stateFromJSON as FlussState)
            toast.success('Fluss loaded successfully.')
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
      className="flex items-center w-full"
      onClick={handleFileSelect}
    >
      <FolderIcon className="size-4" /> Open Fluss
    </SidebarMenuButton>
  )
}
