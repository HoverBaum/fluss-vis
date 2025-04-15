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

import { CustomTypesDialog } from './CustomTypesDialog'
import { Export } from '../_export/Export'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { LoadButton } from './LoadButton'
import { ExamplesDropdown } from './ExamplesDropdown'
import { ResetButton } from './ResetButton'
import { SettingsIcon } from 'lucide-react'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'

export const FlussSidebar = () => {
  const flussName = useFlussStore((state) => state.name)
  const setSettingsDialogOpen = useSettingsStore(
    (state) => state.setSettingsDialogOpen
  )

  return (
    <Sidebar side="left" variant="inset">
      <SidebarHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">Setting</h2>
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

              <ExamplesDropdown />

              <SidebarMenuItem>
                <ResetButton />
              </SidebarMenuItem>

              <SidebarMenuItem>
                <LoadButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{flussName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CustomTypesDialog />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Export buttonVariant="default" buttonClassName="w-full" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
