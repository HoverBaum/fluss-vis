import {
  Handle,
  HandleType,
  Position,
  useNodeConnections,
  useNodesData,
} from '@xyflow/react'
import { FlussNodeType } from '@/stores/flussStore'
import { EdgeType } from '../EdgeType'
import { outputFromStep } from '@/fluss-lib/nodeOperations'

type FlussNodeInputProps = {
  id: string
}

const handleType: HandleType = 'target'

export const FlussNodeInput = ({ id }: FlussNodeInputProps) => {
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

  console.log('input', input?.type, input?.name)

  return (
    <div className="relative pl-6">
      {input?.type && (
        <span className="flex flex-wrap gap-1">
          <EdgeType outputTypeId={input.type} /> <span> - {input.name}</span>
          {connections.length > 1 && <span> (+{connections.length - 1})</span>}
        </span>
      )}
      {connections.length > 0 && !input?.type && 'Unselected'}
      {connections.length === 0 && (
        <small className="opacity-50">Unconnected</small>
      )}

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
