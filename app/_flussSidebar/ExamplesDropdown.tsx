'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { BlogDraftExampleState } from '@/stores/examples/blogDraft.example'
import { squareNumberExampleState } from '@/stores/examples/squareNumber.example'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import {
  BookOpenTextIcon,
  MoreHorizontalIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useState } from 'react'
import { FlussState } from '@/stores/flussStore'

export const ExamplesDropdown = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedExample, setSelectedExample] = useState<FlussState | null>(
    null
  )
  const { isMobile } = useSidebar()
  const loadFluss = useFlussStore((state) => state.loadFluss)

  const selectExample = (example: FlussState) => {
    setSelectedExample(example)
    setIsDialogOpen(true)
  }

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <TriangleAlertIcon className="size-5" />
              Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite everything currently in the editor. Make sure
              to save any changes before proceeding. There is no going back!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedExample && loadFluss(selectedExample)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <SidebarMenuItem>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <BookOpenTextIcon />
              Examples <MoreHorizontalIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? 'bottom' : 'right'}
            align={isMobile ? 'end' : 'start'}
            className="min-w-56 rounded-lg"
          >
            <DropdownMenuItem
              onClick={() => {
                selectExample(squareNumberExampleState)
              }}
            >
              Square a number
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                selectExample(BlogDraftExampleState)
              }}
            >
              Blogpost Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </SidebarMenuItem>
      </DropdownMenu>
    </>
  )
}
