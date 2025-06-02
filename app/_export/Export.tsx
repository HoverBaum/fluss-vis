'use client'

import { Download, DownloadIcon, LoaderCircleIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useExport } from './useExport'
import { useCallback, useEffect, useState } from 'react'
import codeAnimation from './code_animation.json'
import dynamic from 'next/dynamic'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { stringToValidIdentifier } from '@/fluss-lib/nameConversion'

// Dynamically import Lottie so that it's only loaded on the client side.
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type ExportProps = {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  buttonClassName?: React.ComponentProps<typeof Button>['className']
}

export const Export = ({
  buttonVariant = 'secondary',
  buttonClassName = '',
}: ExportProps) => {
  const [codeToCopy, setCodeToCopy] = useState('')
  const { flussExport } = useExport()
  const [animationDone, setAnimationDone] = useState(false)
  const [didDownload, setDidDownload] = useState(false)
  const fileName = useFlussStore(
    (state) => `${stringToValidIdentifier(state.name)}.fluss.ts`
  )

  useEffect(() => {
    setAnimationDone(false)
    setDidDownload(false)
  }, [codeToCopy])

  const downloadCode = useCallback(() => {
    if (!codeToCopy) return

    const blob = new Blob([codeToCopy], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    URL.revokeObjectURL(url)
    document.body.removeChild(link)

    setDidDownload(true)
  }, [codeToCopy, fileName])

  // Automatically start download when animation completes.
  useEffect(() => {
    if (animationDone && codeToCopy && !didDownload) {
      downloadCode()
    }
  }, [animationDone, codeToCopy, didDownload, downloadCode])

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setCodeToCopy('')
          flussExport().then(setCodeToCopy)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant={buttonVariant} className={buttonClassName}>
          Export <Download />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fluss Export</DialogTitle>
          {!animationDone && (
            <DialogDescription>
              Your Fluss will be automatically downloaded once ready.
            </DialogDescription>
          )}
          {animationDone && (
            <DialogDescription>
              Your Fluss file was created and downloaded.
            </DialogDescription>
          )}
        </DialogHeader>
        <div>
          <Lottie
            animationData={codeAnimation}
            className="h-60"
            loop={false}
            onComplete={() => setTimeout(() => setAnimationDone(true), 500)}
          />
          <p className="text-center text-lg">
            {!animationDone ? (
              <span className="flex items-center justify-center gap-2">
                Creating your Fluss
                <LoaderCircleIcon className="text-foreground animate size-4 animate-spin" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <DownloadIcon className="size-4" />
                {fileName} (downloaded)
              </span>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
