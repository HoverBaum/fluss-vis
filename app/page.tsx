'use client'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { FlowEditor } from './FlowEditor'
import { FlussSidebar } from './_flussSidebar/FlussSidebar'
import { useState } from 'react'
import { useCopyPaste } from './useCopyPaste'
import { SettingsDialog } from './_flussSidebar/SettingsDialog'
import { CustomTypesDialog } from './_flussSidebar/CustomTypesDialog'
import { useFlussStore } from '@/stores/FlussStoreProvider'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useCopyPaste()
  const hasHydrated = useFlussStore((state) => state.hasHydrated)

  if (!hasHydrated) {
    return null
  }

  return (
    <>
      <SidebarProvider
        open={sidebarOpen}
        style={{ height: 'calc(100svh - 0.5rem)' }}
      >
        <FlussSidebar />

        {/* When sidebar is closed, we want the editor to be "fullscreen". */}
        <SidebarInset
          className={`overflow-hidden transition-all ${sidebarOpen ? '' : 'm-0! rounded-none!'}`}
        >
          <FlowEditor
            toggleFlussSidebar={() => setSidebarOpen((state) => !state)}
          />
        </SidebarInset>
      </SidebarProvider>
      <SettingsDialog />
      <CustomTypesDialog />
    </>
  )
}
