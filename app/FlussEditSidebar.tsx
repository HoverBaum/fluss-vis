'use client'

import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { useFlussStore } from '@/stores/FlussStoreProvider'

export const FlussEditSidebar = () => {
  const selectedNode = useFlussStore((state) =>
    state.nodes.find((node) => node.selected)
  )
  const nodeData = selectedNode?.data
  const setNodeName = useFlussStore((state) => state.setNodeName)

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <h2 className="font-bold">Editor</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!selectedNode && <p>Select a node to start editing</p>}
        </SidebarGroup>

        {nodeData && (
          <SidebarGroup>
            <h3 className="font-bold text-lg">
              {nodeData.name} -{' '}
              <small className="font-normal">{selectedNode.id}</small>
            </h3>
            <Input
              value={nodeData.name}
              onChange={(e) => setNodeName(selectedNode.id, e.target.value)}
            />
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
