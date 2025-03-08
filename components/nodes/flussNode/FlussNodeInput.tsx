import {
  Handle,
  HandleType,
  Position,
  useNodeConnections,
  useNodesData,
} from '@xyflow/react'
import { FlussNodeType } from '@/stores/flussStore'
import { EdgeType } from '../EdgeType'

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
  const sourceNode = useNodesData<FlussNodeType>(sourceId)
  const input = sourceNode?.data?.output
  const inputType = input?.typeId

  return (
    <div className="relative pl-6">
      {inputType && (
        <span className="flex flex-wrap gap-1">
          <EdgeType outputTypeId={inputType} /> <span> - {input.name}</span>
          {connections.length > 1 && <span> (+{connections.length - 1})</span>}
        </span>
      )}
      {!inputType && connections.length > 0 && 'Unselected'}
      {!inputType && connections.length === 0 && (
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
