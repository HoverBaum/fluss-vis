import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
import { PlusIcon, TriangleAlertIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useMemo, useState } from 'react'
import { CustomTypeEditor } from './CustomTypeEditor'
import { CustomTypeDisplay } from './CustomTypeDisplay'
import { generateId } from '@/fluss-lib/flussId'

type PageName = 'about' | 'overview' | 'editor'

export const CustomTypesDialog = () => {
  // Somehow filtering in the selector caused an infinite loop 🤷
  const allCustomTypes: FlussStepOutputType[] = useFlussStore(
    (store) => store.outputTypes
  )
  const customTypes = useMemo(
    () => allCustomTypes.filter((type) => !type.isPrimitive),
    [allCustomTypes]
  )
  const [selectedType, setSelectedType] = useState<FlussStepOutputType | null>(
    null
  )
  const [page, setPage] = useState<PageName>('overview')
  const addOutputType = useFlussStore((store) => store.outputTypeAdd)
  const setCustomTypeDialogOpen = useFlussStore(
    (state) => state.setCustomTypesDialogOpen
  )
  const isOpen = useFlussStore((state) => state.uiState.isTypeDialogOpen)

  const selectType = (type: FlussStepOutputType) => {
    setSelectedType(type)
    setPage('editor')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setCustomTypeDialogOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Custom Types</DialogTitle>
        <DialogDescription className="sr-only">
          Setup custom TypeScript Types here to use as return types in your
          Fluss.
        </DialogDescription>
        <SidebarProvider className="min-h-[480px] items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarHeader>
                <h2 className="text-xl font-semibold">Custom Types</h2>
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
                  {customTypes.length === 0 && (
                    <SidebarMenu>
                      <SidebarMenuItem className="p-2 opacity-50">
                        None, yet
                      </SidebarMenuItem>
                    </SidebarMenu>
                  )}
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
              <Button
                onClick={() => {
                  const newType: FlussStepOutputType = {
                    id: generateId(),
                    typeName: 'NewType',
                    displayName: 'New Type',
                    content: 'any',
                    icon: 'circle-help',
                  }
                  addOutputType(newType)
                  selectType(newType)
                }}
              >
                <PlusIcon /> Add Type
              </Button>
            </SidebarFooter>
          </Sidebar>
          <main className="flex h-[600px] flex-1 flex-col overflow-y-scroll p-4">
            {page === 'editor' && selectedType && (
              <div className="mt-4">
                <CustomTypeEditor
                  key={selectedType.id}
                  typeId={selectedType.id}
                />
              </div>
            )}
            {page === 'overview' && (
              <div className="mt-4 grid gap-8">
                {customTypes.map((type) => (
                  <CustomTypeDisplay key={type.id} type={type} />
                ))}
                {customTypes.length === 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      No Custom Types, yet <TriangleAlertIcon size="1rem" />
                    </h3>
                    <div>
                      <p>
                        Get started with Custom Types by adding one from the
                        sidebar.
                      </p>
                    </div>
                  </div>
                )}
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
