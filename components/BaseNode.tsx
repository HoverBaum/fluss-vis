'use client'

import { motion } from 'motion/react'
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
import {
  AnimationState,
  NEW_CONNECTION_HANDLE_IDENTIFIER,
} from '@/stores/flussStore'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { OctagonXIcon, UnplugIcon } from 'lucide-react'

const DropIndicator = ({ nodeId }: { nodeId: string }) => {
  const connection = useConnection()
  const isAlreadyConnected = useFlussStore((store) =>
    store.edges.some(
      (edge) =>
        edge.target === nodeId &&
        edge.sourceHandle === connection?.fromHandle?.id
    )
  )
  return (
    <div
      className={`w-full h-full absolute top-0 left-0 opacity-0 hover:opacity-100 z-10 grid place-items-center backdrop-blur-xs transition-opacity overflow-hidden ${
        isAlreadyConnected ? 'bg-fluss-pink/5' : 'bg-fluss-blue-light/5'
      }`}
    >
      {!isAlreadyConnected && (
        <Handle
          id={`${nodeId}-${NEW_CONNECTION_HANDLE_IDENTIFIER}`}
          type="target"
          position={Position.Left}
          isConnectableStart={false}
          className="w-full! h-full! absolute! top-1/2! left-1/2! border-none! rounded-none! bg-transparent! z-20!"
        />
      )}
      <div className="bg-background px-4 py-2 rounded-md shadow-sm">
        {isAlreadyConnected ? (
          <span className="flex items-center gap-2">
            <OctagonXIcon className="text-danger" />
            Already Connected
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UnplugIcon className="text-fluss-blue" />
            Drop to add input
          </span>
        )}
      </div>
    </div>
  )
}

type BaseNodeProps = {
  nodeId: string
  name: string
  description?: string
  selected?: boolean
  children?: ReactNode
  className?: string
  acceptsInputs?: boolean
  state: AnimationState
}

export const BaseNode = ({
  nodeId,
  name,
  description,
  selected,
  children,
  className = '',
  acceptsInputs: showNewConnectionHandle = true,
  state,
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
    <motion.div
      initial={state === 'entering' ? { scale: 1.5, opacity: 0.2 } : {}}
      animate={{ scale: 1, opacity: 1 }}
      className={state === 'exiting' ? 'opacity-0 scale-95 transition-all' : ''}
    >
      <Card
        className={`w-[275px] relative shadow-xs transition-shadow ${selected ? 'border-foreground shadow-lg' : ''} ${state === 'entering' ? 'border-positive shadow-xl' : ''} ${state === 'exiting' ? 'border-danger border-dashed' : ''} ${className}`}
        onDoubleClick={openEditSidebar}
      >
        {state === 'exiting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute top-0 left-0 w-full h-full z-20 bg-danger"
          ></motion.div>
        )}
        {state === 'entering' && (
          <motion.div
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full z-20 bg-positive"
          ></motion.div>
        )}
        {isPotentialTarget && <DropIndicator nodeId={nodeId} />}
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
    </motion.div>
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
