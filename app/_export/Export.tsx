import { Copy, Download } from 'lucide-react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
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
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { useExport } from './useExport'
import { useState } from 'react'

SyntaxHighlighter.registerLanguage('typescript', ts)

export const Export = () => {
  const [codeToCopy, setCodeToCopy] = useState('')
  const { theme, systemTheme } = useTheme()
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
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

        <div className="overflow-scroll w-full">
          <SyntaxHighlighter
            className="max-h-80 border-2 border-border"
            language="typescript"
            style={isDark ? a11yDark : a11yLight}
          >
            {codeToCopy}
          </SyntaxHighlighter>
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
