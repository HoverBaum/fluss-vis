'use client'

import { ButtonDanger } from '@/components/ButtonDanger'
import { CodeDisplay } from '@/components/CodeDisplay'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { stringToValidIdentifier } from '@/fluss-lib/nameConversion'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { END_NODE_ID, START_NODE_ID } from '@/stores/storeHelpers'
import { ArrowRightFromLine } from 'lucide-react'
import { useEffect } from 'react'

export const StepEditSidebar = () => {
  const closeSidebar = useFlussStore((state) => state.editSidebarClose)
  const selectedNode = useFlussStore((state) =>
    state.nodes.find((node) => node.selected)
  )
  const nodeData = selectedNode?.data
  const setNodeName = useFlussStore((state) => state.setNodeName)
  const setNodeDescription = useFlussStore((state) => state.setNodeDescription)
  const removeNode = useFlussStore((state) => state.removeNode)

  useEffect(() => {
    if (!selectedNode) closeSidebar()
  }, [selectedNode, closeSidebar])

  return (
    <Sidebar
      side="right"
      className="pl-0 ml-0 absolute h-full shadow-lg"
      sidebarClassName="rounded-l-none! border-l! bg-background"
    >
      <SidebarHeader className="relative">
        {nodeData && (
          <>
            <h2 className="font-bold text-xl">{nodeData.name}</h2>
            <small>{nodeData.id}</small>
          </>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={closeSidebar}
          className="absolute top-2 right-2"
        >
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
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="pl-0">
                <h2 className="font-bold text-lg">Meta data</h2>
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-2 flex flex-col">
                <div className="grid w-full max-w-sm items-center gap-1 my-2">
                  <Label htmlFor="nameEdit" className="font-semibold">
                    Name
                  </Label>
                  <Input
                    value={nodeData.name}
                    id="nameEdit"
                    className="bg-background"
                    onChange={(e) =>
                      setNodeName(selectedNode.id, e.target.value)
                    }
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1 my-2">
                  <Label className="font-semibold">Function name</Label>
                  <small>Used in generated code.</small>
                  <CodeDisplay>
                    {stringToValidIdentifier(nodeData.name)}
                  </CodeDisplay>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1 my-2">
                  <Label htmlFor="descriptionEdit" className="font-semibold">
                    Description
                  </Label>
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
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        {selectedNode &&
          selectedNode.id !== START_NODE_ID &&
          selectedNode.id !== END_NODE_ID && (
            <ButtonDanger
              disabled={!selectedNode}
              onClick={() => selectedNode && removeNode(selectedNode.id)}
            >
              Delete Node
            </ButtonDanger>
          )}
        <small className="w-full text-center opacity-75">
          Click outside a node to close.
        </small>
      </SidebarFooter>
    </Sidebar>
  )
}
