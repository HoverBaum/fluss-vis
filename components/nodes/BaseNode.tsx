'use client'

import { motion } from 'motion/react'
import {
  Handle,
  Position,
  useConnection,
  useUpdateNodeInternals,
} from '@xyflow/react'
import { Children, ReactNode, useEffect, useMemo } from 'react'
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
import { useZoom } from '../useZoom'

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
      className={`absolute top-0 left-0 z-50 grid h-full w-full place-items-center overflow-hidden opacity-0 backdrop-blur-xs transition-opacity hover:opacity-100 ${
        isAlreadyConnected ? 'bg-fluss-pink/5' : 'bg-fluss-blue-light/5'
      }`}
    >
      {!isAlreadyConnected && (
        <Handle
          id={`${nodeId}-${NEW_CONNECTION_HANDLE_IDENTIFIER}`}
          type="target"
          position={Position.Left}
          isConnectableStart={false}
          className="absolute! top-1/2! left-1/2! z-20! h-full! w-full! rounded-none! border-none! bg-transparent!"
        />
      )}
      <div className="bg-background rounded-md px-4 py-2 shadow-sm">
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

const TruncatedDescriptionLength = 95 as const

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
  const { isZoomedOut } = useZoom()
  const displayId = useSettingsStore((store) => store.displayIds)
  const updateNodeInternals = useUpdateNodeInternals()
  const connection = useConnection()
  const isPotentialTarget =
    connection.inProgress &&
    connection.fromNode.id !== nodeId &&
    showNewConnectionHandle
  const openEditSidebar = useFlussStore((store) => store.editSidebarOpen)

  const descriptionIsEmpty = useMemo(
    () => !description || description.length === 0,
    [description]
  )
  const descriptionIsTruncated = useMemo(
    () => description && description.length > TruncatedDescriptionLength,
    [description]
  )

  // Update node internals when the node is a potential target or state changes.
  useEffect(() => {
    updateNodeInternals(nodeId)
  }, [isPotentialTarget, nodeId, updateNodeInternals, state])

  return (
    <motion.div
      initial={state === 'entering' ? { scale: 1.5, opacity: 0.2 } : {}}
      animate={{ scale: 1, opacity: 1 }}
      className={state === 'exiting' ? 'scale-95 opacity-0 transition-all' : ''}
    >
      <Card
        className={`relative w-[275px] shadow-xs transition-shadow ${selected ? 'border-foreground shadow-lg' : ''} ${state === 'entering' ? 'border-positive shadow-xl' : ''} ${state === 'exiting' ? 'border-danger border-dashed' : ''} ${className}`}
        onDoubleClick={(e) => {
          // Abort if user double clicked an input.
          // They probably want to mark text and not open the sidebar.
          if (e.target.toString().includes('Input')) return undefined
          openEditSidebar()
        }}
      >
        {isZoomedOut && (
          <div className="bg-card absolute top-0 left-0 z-10 grid h-full w-full place-items-center rounded-xl p-8">
            <span className="text-4xl">{name}</span>
          </div>
        )}
        {state === 'exiting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="bg-danger absolute top-0 left-0 z-20 h-full w-full"
          ></motion.div>
        )}
        {state === 'entering' && (
          <motion.div
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            className="bg-positive absolute top-0 left-0 z-20 h-full w-full"
          ></motion.div>
        )}
        {isPotentialTarget && <DropIndicator nodeId={nodeId} />}
        {displayId && (
          <small className="absolute top-2 right-2 font-mono">{nodeId}</small>
        )}
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>
            <div className="relative">
              <div>
                {descriptionIsEmpty && 'Double click step to edit.'}
                {descriptionIsTruncated &&
                  description?.substring(0, TruncatedDescriptionLength) + '…'}
                {description && !descriptionIsTruncated && description}
              </div>
            </div>
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
