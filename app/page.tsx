'use client'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { FlowEditor } from './FlowEditor'
import { FlussSidebar } from './_flussSidebar/FlussSidebar'
import { useState } from 'react'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarProvider
      open={sidebarOpen}
      style={{ height: 'calc(100svh - 0.5rem)' }}
    >
      <FlussSidebar />

      {/* Only use Inset when sidebar is open. */}
      {sidebarOpen && (
        <SidebarInset className="overflow-hidden">
          <FlowEditor
            toggleFlussSidebar={() => setSidebarOpen((state) => !state)}
            isFullScreen={!sidebarOpen}
          />
        </SidebarInset>
      )}
      {!sidebarOpen && (
        <FlowEditor
          toggleFlussSidebar={() => setSidebarOpen((state) => !state)}
          isFullScreen={!sidebarOpen}
        />
      )}
    </SidebarProvider>
  )
}
