'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'
import { bedtimeStoryExampleState } from '@/stores/examples/bedtimeStory.example'
import { useReactFlow } from '@xyflow/react'
import { ExampleDropdownItem } from './ExampleDropdownItem'

export const ExamplesDropdown = () => {
  const { fitView } = useReactFlow()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [notAgainSelected, setNotAgainSelected] = useState(false)
  const [selectedExample, setSelectedExample] = useState<FlussState | null>(
    null
  )
  const { isMobile } = useSidebar()
  const loadFluss = useFlussStore((state) => state.loadFluss)
  const setShowExampleOverwriteWarning = useSettingsStore(
    (store) => store.setShowExampleOverwriteWarning
  )
  const showWarningDialog = useSettingsStore(
    (store) => store.showExampleOverwriteWarning
  )

  const loadExample = (example: FlussState) => {
    loadFluss(example)
    // Need to escape event loop so that state update can finish.
    setTimeout(() => fitView(), 1)
  }

  /**
   * Selects an example and if no Dialog should be shown directly loads it.
   */
  const selectExample = (example: FlussState) => {
    if (showWarningDialog) {
      setSelectedExample(example)
      setIsDialogOpen(true)
    } else {
      loadExample(example)
    }
  }

  // To be used after warning dialog.
  const loadSelectedExample = () => {
    if (!selectedExample) return undefined
    if (notAgainSelected) {
      setShowExampleOverwriteWarning(false)
    }
    loadExample(selectedExample)
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
            <AlertDialogDescription className="text-foreground">
              This will overwrite everything currently in the editor. Make sure
              to save any changes before proceeding. There is no going back!
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div
            className={`flex items-center space-x-2 ${notAgainSelected ? '' : 'text-muted-foreground'}`}
          >
            <Checkbox
              checked={notAgainSelected}
              onCheckedChange={(checked) =>
                checked !== 'indeterminate' && setNotAgainSelected(checked)
              }
              id="hideDialog"
            />
            <label
              htmlFor="hideDialog"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do not show this dialog again.
            </label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={loadSelectedExample}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
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
          <ExampleDropdownItem
            name="Square a number"
            description="A simple, two step process with custom types."
            onClick={() => {
              selectExample(squareNumberExampleState)
            }}
          />

          <ExampleDropdownItem
            name="Blogpost draft"
            onClick={() => {
              selectExample(BlogDraftExampleState)
            }}
          />

          <ExampleDropdownItem
            name="Bedtime story"
            onClick={() => {
              selectExample(bedtimeStoryExampleState)
            }}
            description="Larger flow, targeted at GenAI storytelling."
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
