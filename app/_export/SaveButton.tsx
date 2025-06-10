'use client'

import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import { useExport } from './useExport'
import { toast } from 'sonner'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { getFlussFilehandle } from '@/lib/useIndexDBUtils'

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

  const saveFluss = async () => {
    console.log('saving fluss, fileHandleKey:', fileHandleKey)
    if (!fileHandleKey || fileHandleKey === '') {
      toast.error(
        'Connection to file lost, please export and then re-open, sorry.'
      )
      return
    }
    try {
      const fileHandle = await getFlussFilehandle(fileHandleKey)
      if (!fileHandle) {
        toast.error(
          'File handle not found, please export and then re-open, sorry.'
        )
        return
      }
      const code = await flussExport()
      if (!code || code === '') {
        toast.error('Failed to export Fluss code, please try again.')
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
      Save <SaveIcon />
    </Button>
  )
}
