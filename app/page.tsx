import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { FlowEditor } from './FlowEditor'
import { FlussSidebar } from './FlussSidebar'

export default function Home() {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={{ height: 'calc(100svh - 0.5rem)' }}
    >
      <FlussSidebar />
      <SidebarInset className="overflow-hidden">
        <FlowEditor />
      </SidebarInset>
    </SidebarProvider>
  )
}
