import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { CodeIcon, PlusIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'

export const CustomTypesDialog = () => {
  const customTypes = useFlussStore((store) =>
    store.outputTypes.filter((type) => !type.isPrimitive)
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="flex items-center gap-2 w-full">
          <CodeIcon size="1rem" /> Custom Types
        </span>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Custom Types</DialogTitle>
        <DialogDescription className="sr-only">
          Setup custom TypeScript Types here to use as return types in your
          Fluss.
        </DialogDescription>
        <SidebarProvider className="items-start min-h-[480px]">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarHeader>
                <h2 className="font-semibold text-xl">Custom Types</h2>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>About Custom Types</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>
              <SidebarGroup>
                <SidebarGroupLabel>Your Types</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {customTypes.map((type) => (
                      <SidebarMenuItem key={type.id}>
                        <SidebarMenuButton>
                          <DynamicIcon name={type.icon} /> {type.displayName}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <Button>
                <PlusIcon /> Add Type
              </Button>
            </SidebarFooter>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <div>
              {customTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex flex-row items-center justify-between p-4"
                >
                  <div>
                    <Label className="text-base font-bold">
                      {type.displayName}
                    </Label>
                    <div>
                      <small>{type.content}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
