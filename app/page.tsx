'use client'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { FlowEditor } from './FlowEditor'
import { FlussSidebar } from './_flussSidebar/FlussSidebar'
import { useState } from 'react'
import { useCopyPaste } from './useCopyPaste'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useCopyPaste()

  return (
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
  )
}
