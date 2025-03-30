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
import { SettingsDialog } from './SettingsDialog'
import { CustomTypesDialog } from './CustomTypesDialog'
import { Export } from '../_export/Export'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { LoadButton } from './LoadButton'
import { ExamplesDropdown } from './ExamplesDropdown'
import { ResetButton } from './ResetButton'

export const FlussSidebar = () => {
  const flussName = useFlussStore((state) => state.name)

  return (
    <Sidebar side="left" variant="inset">
      <SidebarHeader className="flex  flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Setting</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <SettingsDialog />
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
