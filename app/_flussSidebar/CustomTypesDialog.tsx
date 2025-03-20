import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
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
import { FlussStepOutputType } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { CodeIcon, PlusIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useState } from 'react'
import { CustomTypeEditor } from './CustomTypeEditor'
import { CustomTypeDisplay } from './CustomTypeDisplay'

type PageName = 'about' | 'overview' | 'editor'

export const CustomTypesDialog = () => {
  const customTypes = useFlussStore((store) =>
    store.outputTypes.filter((type) => !type.isPrimitive)
  )
  const [selectedType, setSelectedType] = useState<FlussStepOutputType | null>(
    null
  )
  const [page, setPage] = useState<PageName>('overview')

  const selectType = (type: FlussStepOutputType) => {
    setSelectedType(type)
    setPage('editor')
  }

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
                    <SidebarMenuButton
                      isActive={page === 'about'}
                      onClick={() => setPage('about')}
                    >
                      About Custom Types
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={page === 'overview'}
                      onClick={() => setPage('overview')}
                    >
                      Overview
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarHeader>
              <SidebarGroup>
                <SidebarGroupLabel>Your Types</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {customTypes.map((type) => (
                      <SidebarMenuItem key={type.id}>
                        <SidebarMenuButton
                          onClick={() => selectType(type)}
                          isActive={
                            page === 'editor' &&
                            selectedType !== null &&
                            selectedType.id === type.id
                          }
                        >
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
          <main className="flex h-[480px] flex-1 flex-col overflow-y-scroll p-4">
            {page === 'editor' && selectedType && (
              <div className="mt-4">
                <CustomTypeEditor
                  key={selectedType.id}
                  typeId={selectedType.id}
                />
              </div>
            )}
            {page === 'overview' && (
              <div className="grid gap-8 mt-4">
                {customTypes.map((type) => (
                  <CustomTypeDisplay key={type.id} type={type} />
                ))}
              </div>
            )}
            {page === 'about' && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">About Custom Types</h3>
                <div>
                  <p>
                    Setup custom TypeScript Types here to use as return types in
                    your Fluss.
                  </p>
                  <p>More infos coming soon 🤞</p>
                </div>
              </div>
            )}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
