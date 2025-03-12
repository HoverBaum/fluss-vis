import {
  Handle,
  HandleType,
  Position,
  useNodeConnections,
  useNodeId,
  useNodesData,
} from '@xyflow/react'
import { FlussNodeType } from '@/stores/flussStore'
import { EdgeType } from '../EdgeType'
import { outputFromStep } from '@/fluss-lib/nodeOperations'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type FlussNodeInputProps = {
  id: string
}

const handleType: HandleType = 'target'

export const FlussNodeInput = ({ id }: FlussNodeInputProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const nodeId = useNodeId()
  const connections = useNodeConnections({
    handleType: handleType,
    handleId: id,
  })
  const sourceId = connections[0]?.source
  const sourceHandleId = connections[0]?.sourceHandle
  const sourceNode = useNodesData<FlussNodeType>(sourceId)
  const input =
    sourceHandleId && sourceNode
      ? outputFromStep(sourceNode.data, sourceHandleId)
      : undefined
  const removeInput = useFlussStore((state) => state.removeInput)

  return (
    <div
      className="relative pl-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-2 items-center justify-between">
        {input?.type && (
          <span className="flex flex-wrap gap-1">
            <EdgeType outputTypeId={input.type} /> <span> - {input.name}</span>
            {connections.length > 1 && (
              <span> (+{connections.length - 1})</span>
            )}
          </span>
        )}
        {connections.length > 0 && !input?.type && 'Unselected'}
        {connections.length === 0 && (
          <small className="opacity-50">Unconnected</small>
        )}

        <Button
          className={`w-8 h-8 opacity-0 ${isHovered && 'opacity-100'}`}
          variant="ghost"
          onClick={() => removeInput(nodeId!, id)}
        >
          <X size={8} />
        </Button>
      </div>

      <Handle
        type={handleType}
        position={Position.Left}
        id={id}
        style={{ position: 'absolute', left: '0px' }}
        isConnectable={connections.length === 0}
      />
    </div>
  )
}
