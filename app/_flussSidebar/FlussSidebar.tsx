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
import {
  CodeIcon,
  ExternalLinkIcon,
  FolderIcon,
  SettingsIcon,
} from 'lucide-react'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'
import { SaveButton } from '../_export/SaveButton'
import { ShareButton } from './ShareButton'

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
        <h2 className="text-xl font-bold">Fluss-Vis</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSettingsDialogOpen(true)}>
                  <SettingsIcon /> Settings
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Examples */}
              <SidebarMenuItem>
                <ExamplesDropdown />
              </SidebarMenuItem>

              {/* Reset Editor */}
              <SidebarMenuItem>
                <ResetButton />
              </SidebarMenuItem>

              {/* Load/Open Fluss */}
              <SidebarMenuItem>
                <LoadButton asChild>
                  <SidebarMenuButton>
                    <FolderIcon className="size-4" /> Open Fluss
                  </SidebarMenuButton>
                </LoadButton>
              </SidebarMenuItem>

              {/* Link People to GitHub */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="https://github.com/HoverBaum/fluss-vis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    <ExternalLinkIcon className="size-4" /> GitHub
                  </a>
                </SidebarMenuButton>
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
            <ShareButton className="w-full" />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SaveButton variant="default" className="w-full" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
