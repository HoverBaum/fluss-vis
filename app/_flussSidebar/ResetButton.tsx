import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { SidebarMenuButton } from '@/components/ui/sidebar'
import { initialState } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { clearCurrentFile } from '@/lib/flussFileHandle'
import { RotateCcwIcon } from 'lucide-react'

type ResetButtonProps = {
  disabled?: boolean
}

export const ResetButton = ({ disabled }: ResetButtonProps) => {
  const loadFluss = useFlussStore((state) => state.loadFluss)
  const fileHandleKey = useFlussStore((state) => state.fileHandleKey)
  const setFileHandleKey = useFlussStore((state) => state.setFileHandleKey)
  const setSavedFileName = useFlussStore((state) => state.setSavedFileName)

  const handleReset = async () => {
    if (fileHandleKey) {
      await clearCurrentFile(fileHandleKey, {
        setFileHandleKey,
        setSavedFileName,
      })
    }
    loadFluss({ ...initialState, hasHydrated: true })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <SidebarMenuButton
          disabled={disabled}
          className="flex w-full items-center"
        >
          <RotateCcwIcon className="size-4" /> Reset Editor
        </SidebarMenuButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RotateCcwIcon className="size-4" /> Reset the Editor
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will reset the editor to its initial state. All unsaved changes
            will be lost. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
