'use client'

import { Sidebar, SidebarHeader } from '@/components/ui/sidebar'

export const FlussSidebar = () => {
  return (
    <Sidebar side="left" variant="inset">
      <SidebarHeader className="flex  flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Setting</h2>
      </SidebarHeader>
    </Sidebar>
  )
}
