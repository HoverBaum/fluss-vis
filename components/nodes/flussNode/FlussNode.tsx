'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FlussNodeOutput } from './FlussNodeOutput'
import { FlussNodeInput } from './FlussNodeInput'
import {
  Handle,
  NodeProps,
  Position,
  useConnection,
  useUpdateNodeInternals,
} from '@xyflow/react'
import {
  FlussNodeType,
  NEW_CONNECTION_HANDLE_IDENTIFIER,
} from '@/stores/flussStore'
import { useSidebar } from '@/components/ui/sidebar'
import { useEffect } from 'react'

/**
 * A Node somewhere in the Fluss.
 * A step in the process we define.
 * Can have one or more inputs and has a single output.
 */
export const FlussNode = ({
  data,
  selected,
  id: nodeId,
}: NodeProps<FlussNodeType>) => {
  const updateNodeInternals = useUpdateNodeInternals()
  const connection = useConnection()
  const isPotentialTarget =
    connection.inProgress && connection.fromNode.id !== nodeId
  const { output, name, description, inputs } = data
  const { setOpen } = useSidebar()

  // Update node internals when the node is a potential target, because we conditionaly render a Handle.
  // https://reactflow.dev/api-reference/hooks/use-update-node-internals
  useEffect(() => {
    updateNodeInternals(nodeId)
  }, [isPotentialTarget, nodeId, updateNodeInternals])

  return (
    <Card
      onDoubleClick={() => setOpen(true)}
      className={`w-[275px] relative ${selected && 'border-foreground'}`}
    >
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
      <small className="absolute top-2 right-2 font-mono">{nodeId}</small>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>
          {description || 'Double click node to edit'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pb-0">
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
      <hr className="my-6" />
      <CardContent className="pr-0">
        <div className="flex flex-col items-end">
          <FlussNodeOutput output={output} id={`${nodeId}-output`} />
        </div>
      </CardContent>
    </Card>
  )
}
