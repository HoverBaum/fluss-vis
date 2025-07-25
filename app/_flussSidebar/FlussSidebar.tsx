'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { useFlussStore } from '@/stores/FlussStoreProvider'
import { LoadButton } from './LoadButton'
import { ExamplesDropdown } from './ExamplesDropdown'
import { ResetButton } from './ResetButton'
import { CodeIcon, FolderIcon, SettingsIcon } from 'lucide-react'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'
import { SaveButton } from '../_export/SaveButton'

export const FlussSidebar = () => {
  const flussName = useFlussStore((state) => state.name)
  const setSettingsDialogOpen = useSettingsStore(
    (state) => state.setSettingsDialogOpen
  )
  const setCustomTypesDialogOpen = useFlussStore(
    (state) => state.setCustomTypesDialogOpen
  )

  return (
    <Sidebar side="left" variant="inset">
      <SidebarHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">Fluss-Viz</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSettingsDialogOpen(true)}>
                  <SettingsIcon /> Settings
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <ExamplesDropdown />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <ResetButton />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <LoadButton asChild>
                  <SidebarMenuButton>
                    <FolderIcon className="size-4" /> Open Fluss
                  </SidebarMenuButton>
                </LoadButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{flussName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCustomTypesDialogOpen(true)}
                >
                  <CodeIcon /> Custom Types
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SaveButton variant="default" className="w-full" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
