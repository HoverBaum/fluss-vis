import { SidebarProvider } from '@/components/ui/sidebar'
import { FlowEditor } from './FlowEditor'
import { FlussEditSidebar } from './FlussEditSidebar'

export default function Home() {
  return (
    <SidebarProvider defaultOpen={false}>
      <FlowEditor />
      <FlussEditSidebar />
    </SidebarProvider>
  )
}
