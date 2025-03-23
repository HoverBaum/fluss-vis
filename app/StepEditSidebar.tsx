'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { ArrowRightFromLine } from 'lucide-react'
import { useEffect } from 'react'

type StepEditSidebarProps = {
  isFullScreen: boolean
}

export const StepEditSidebar = ({ isFullScreen }: StepEditSidebarProps) => {
  const { toggleSidebar, setOpen } = useSidebar()
  const selectedNode = useFlussStore((state) =>
    state.nodes.find((node) => node.selected)
  )
  const nodeData = selectedNode?.data
  const setNodeName = useFlussStore((state) => state.setNodeName)
  const setNodeDescription = useFlussStore((state) => state.setNodeDescription)
  const removeNode = useFlussStore((state) => state.removeNode)

  useEffect(() => {
    if (!selectedNode) setOpen(false)
  }, [selectedNode, setOpen])

  return (
    <Sidebar
      side="right"
      variant={isFullScreen ? 'sidebar' : 'floating'}
      className="pl-0 ml-0"
      sidebarClassName="!rounded-l-none !border-l bg-background"
    >
      <SidebarHeader className="flex  flex-row justify-between items-center">
        <h2 className="font-bold text-xl">Node Editor</h2>
        <Button size="icon" variant="ghost" onClick={toggleSidebar}>
          <ArrowRightFromLine />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {!selectedNode && (
          <SidebarGroup>
            <p>Select a node to start editing</p>
          </SidebarGroup>
        )}

        {nodeData && (
          <SidebarGroup>
            <h3 className="font-bold text-lg">
              {nodeData.name} -{' '}
              <small className="font-normal">{selectedNode.id}</small>
            </h3>

            <div className="grid w-full max-w-sm items-center gap-1 my-2">
              <Label htmlFor="nameEdit">Name</Label>
              <Input
                value={nodeData.name}
                id="nameEdit"
                className="bg-background"
                onChange={(e) => setNodeName(selectedNode.id, e.target.value)}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1 my-2">
              <Label htmlFor="descriptionEdit">Description</Label>
              <Textarea
                value={nodeData.description || ''}
                id="descriptionEdit"
                className="bg-background"
                onChange={(e) =>
                  setNodeDescription(selectedNode.id, e.target.value)
                }
                rows={3}
              />
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Button
          className="w-full hover:bg-destructive hover:text-destructive-foreground"
          variant="secondary"
          disabled={!selectedNode}
          onClick={() => selectedNode && removeNode(selectedNode.id)}
        >
          Delete Node
        </Button>
        <small className="w-full text-center opacity-75">
          Click outside a node to close.
        </small>
      </SidebarFooter>
    </Sidebar>
  )
}
