'use client'

import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { useFlussStore } from '@/stores/FlussStoreProvider'

export const FlussEditSidebar = () => {
  const selectedNode = useFlussStore((state) =>
    state.nodes.find((node) => node.selected)
  )
  const nodeData = selectedNode?.data

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <h2 className="font-bold">Editor</h2>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {!selectedNode && <p>Select a node to start editing</p>}

        {nodeData && (
          <div>
            <h3 className="font-bold text-lg">
              {nodeData.name} -{' '}
              <small className="font-normal">{selectedNode.id}</small>
            </h3>
            <p>{nodeData.description}</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
