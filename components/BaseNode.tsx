'use client'

import {
  Handle,
  Position,
  useConnection,
  useUpdateNodeInternals,
} from '@xyflow/react'
import { Children, ReactNode, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NEW_CONNECTION_HANDLE_IDENTIFIER } from '@/stores/flussStore'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'
import { useFlussStore } from '@/stores/FlussStoreProvider'

type BaseNodeProps = {
  nodeId: string
  name: string
  description?: string
  selected?: boolean
  children?: ReactNode
  className?: string
  showNewConnectionHandle?: boolean
}

export const BaseNode = ({
  nodeId,
  name,
  description,
  selected,
  children,
  className = '',
  showNewConnectionHandle = true,
}: BaseNodeProps) => {
  const displayId = useSettingsStore((store) => store.displayIds)
  const updateNodeInternals = useUpdateNodeInternals()
  const connection = useConnection()
  const isPotentialTarget =
    connection.inProgress &&
    connection.fromNode.id !== nodeId &&
    showNewConnectionHandle
  const openEditSidebar = useFlussStore((store) => store.editSidebarOpen)

  // Update node internals when the node is a potential target.
  useEffect(() => {
    updateNodeInternals(nodeId)
  }, [isPotentialTarget, nodeId, updateNodeInternals])

  return (
    <Card
      className={`w-[275px] relative ${selected && 'border-foreground shadow-lg'} ${className}`}
      onDoubleClick={openEditSidebar}
    >
      {isPotentialTarget && (
        <Handle
          id={`${nodeId}-${NEW_CONNECTION_HANDLE_IDENTIFIER}`}
          type="target"
          position={Position.Left}
          isConnectableStart={false}
          className="!w-full !h-full !absolute !top-0 !left-2 hover:!left-0 !opacity-0 hover:!opacity-100 hover:!border-foreground !z-10 !transform-none !rounded-md !bg-transparent !grid !place-items-center !backdrop-blur-sm"
        >
          Drop to add Input
        </Handle>
      )}
      {displayId && (
        <small className="absolute top-2 right-2 font-mono">{nodeId}</small>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>
          {description || 'Double click node to edit'}
        </CardDescription>
      </CardHeader>
      {children}
    </Card>
  )
}

export const BaseNodeInputsContent = ({
  children,
}: {
  children?: ReactNode
}) => {
  // Check if children is empty using React.Children utility
  const isEmpty = !children || Children.count(children) === 0

  return (
    <CardContent className="pl-0">
      {isEmpty && (
        <small className="pl-6">Drag an Edge here to add Inputs.</small>
      )}
      <div className="grid grid-cols-1 gap-2">{children}</div>
    </CardContent>
  )
}

export const BaseNodeOutputsContent = ({
  children,
}: {
  children?: ReactNode
}) => (
  <CardContent className="pr-0">
    <div className="flex flex-col items-end">{children}</div>
  </CardContent>
)
