'use client'

import { Button } from '@/components/ui/button'
import { useLoadFluss } from '@/app/_export/useLoadFluss'
import { FolderIcon } from 'lucide-react'
import { ComponentProps, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

type LoadButtonProps = {
  variant?: ComponentProps<typeof Button>['variant']
  asChild?: boolean
  children?: ReactNode
}

export const LoadButton = ({ variant, asChild, ...props }: LoadButtonProps) => {
  const { openAndLoadFluss } = useLoadFluss()

  const Comp = asChild ? Slot : Button

  return (
    <Comp
      className=""
      variant={asChild ? undefined : variant}
      onClick={openAndLoadFluss}
      {...props}
    >
      {props.children ?? (
        <div className="flex items-center gap-2">
          <FolderIcon className="size-4" /> Open Fluss
        </div>
      )}
    </Comp>
  )
}
