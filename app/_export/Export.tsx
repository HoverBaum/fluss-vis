import { Copy, Download } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useExport } from './useExport'
import { useState } from 'react'
import { CodeDisplay } from '@/components/CodeDisplay'

export const Export = () => {
  const [codeToCopy, setCodeToCopy] = useState('')
  const { flussExport } = useExport()

  return (
    <Dialog onOpenChange={(open) => open && flussExport().then(setCodeToCopy)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Export <Download />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fluss Export</DialogTitle>
          <DialogDescription>
            Copy the code below to use this fluss. We recommend saving this as
            *.fluss.ts.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-scroll w-full max-h-80 border border-border">
          <CodeDisplay>{codeToCopy}</CodeDisplay>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            size="icon"
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(codeToCopy)
              toast('Copied to clipboard')
            }}
          >
            <Copy /> Copy Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
