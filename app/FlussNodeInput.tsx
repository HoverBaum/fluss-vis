import {
  Handle,
  HandleType,
  Position,
  useNodeConnections,
  useNodesData,
} from '@xyflow/react'
import { EdgeType } from './EdgeType'
import { FlussNodeType } from '@/stores/flussStore'

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
  const outputType = sourceNode?.data?.outputType

  return (
    <div className="relative pl-6">
      {outputType && <EdgeType type={outputType} />}
      {!outputType && connections.length > 0 && 'Unselected'}
      {!outputType && connections.length === 0 && (
        <small className="opacity-50">Unconnected</small>
      )}

      <Handle
        type={handleType}
        position={Position.Left}
        id={id}
        style={{ position: 'absolute', left: '0px' }}
      />
    </div>
  )
}
