import { motion } from 'motion/react'
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
import { useEffect, useState } from 'react'
import { CodeDisplay } from '@/components/CodeDisplay'
import codeAnimation from './code_animation.json'
import Lottie from 'lottie-react'

export const Export = () => {
  const [codeToCopy, setCodeToCopy] = useState('')
  const { flussExport } = useExport()
  const [animationDone, setAnimationDone] = useState(false)

  useEffect(() => {
    setAnimationDone(false)
  }, [codeToCopy])

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
        {!animationDone && (
          <div>
            <Lottie
              animationData={codeAnimation}
              className="h-60"
              loop={false}
              onComplete={() => setTimeout(() => setAnimationDone(true), 500)}
            />
            <p className="text-center text-lg">Creating your Fluss 🪄</p>
          </div>
        )}

        {animationDone && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="overflow-scroll w-full max-h-80 border border-border"
          >
            <CodeDisplay>{codeToCopy}</CodeDisplay>
          </motion.div>
        )}

        {animationDone && (
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
        )}
      </DialogContent>
    </Dialog>
  )
}
