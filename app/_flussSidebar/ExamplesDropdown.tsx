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
import { BlogDraftExampleState } from '@/stores/examples/blogDraft.example'
import { squareNumberExampleState } from '@/stores/examples/squareNumber.example'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { BookOpenTextIcon, MoreHorizontalIcon } from 'lucide-react'

export const ExamplesDropdown = () => {
  const { isMobile } = useSidebar()
  const loadFluss = useFlussStore((state) => state.loadFluss)

  return (
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
              loadFluss(squareNumberExampleState)
            }}
          >
            Square a number
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              loadFluss(BlogDraftExampleState)
            }}
          >
            Blogpost Draft
          </DropdownMenuItem>
        </DropdownMenuContent>
      </SidebarMenuItem>
    </DropdownMenu>
  )
}
