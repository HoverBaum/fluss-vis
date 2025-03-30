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
import { RotateCcwIcon } from 'lucide-react'

export const ResetButton = () => {
  const loadFluss = useFlussStore((state) => state.loadFluss)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <SidebarMenuButton className="flex items-center w-full">
          <RotateCcwIcon className="size-4" /> Reset
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
          <AlertDialogAction onClick={() => loadFluss(initialState)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
