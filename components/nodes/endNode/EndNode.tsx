'use client'

import {
  Handle,
  NodeProps,
  Position,
  useConnection,
  useNodeId,
  useUpdateNodeInternals,
} from '@xyflow/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { END_NODE_ID } from '@/stores/storeHelpers'
import { FlussNodeInput } from '../flussNode/FlussNodeInput'
import {
  FlussNodeType,
  NEW_CONNECTION_HANDLE_IDENTIFIER,
} from '@/stores/flussStore'
import { useEffect } from 'react'

export const EndNode = ({ selected, data }: NodeProps<FlussNodeType>) => {
  const updateNodeInternals = useUpdateNodeInternals()
  const nodeId = useNodeId()
  const connection = useConnection()
  const isPotentialTarget =
    connection.inProgress && connection.fromNode.id !== nodeId
  const { name, inputs, description } = data

  // Update node internals when the node is a potential target, because we conditionaly render a Handle.
  // https://reactflow.dev/api-reference/hooks/use-update-node-internals
  useEffect(() => {
    if (nodeId) updateNodeInternals(nodeId)
  }, [isPotentialTarget, nodeId, updateNodeInternals])

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      {isPotentialTarget && (
        <Handle
          id={`${nodeId}-${NEW_CONNECTION_HANDLE_IDENTIFIER}`}
          type="target"
          position={Position.Left}
          // Connection can never start from this handle!
          isConnectableStart={false}
          className="!w-full !h-full !absolute !top-0 !left-2 hover:!left-0 !opacity-0 hover:!opacity-100 hover:!border-foreground !z-10 !transform-none !rounded-md !bg-transparent !grid !place-items-center !backdrop-blur-sm"
        >
          Drop to add Input
        </Handle>
      )}
      <small className="absolute top-2 right-2 font-mono">{END_NODE_ID}</small>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>
          {description || 'Double click node to edit'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        {(!inputs || inputs?.length === 0) && (
          <small className="pl-6">Drag an Edge here to add Inputs.</small>
        )}
        <div className="grid grid-cols-1 gap-2">
          {inputs &&
            inputs.map((input) => (
              <FlussNodeInput key={input.id} id={input.id} />
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
