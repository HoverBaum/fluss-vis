import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Handle, HandleType, Position, useNodeConnections } from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import { EdgeType } from './EdgeType'

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
  const sourceNodes = useFlussStore(
    useShallow((state) => state.nodes.filter((node) => node.id === sourceId))
  )
  const outputType = sourceNodes[0]?.data?.outputType

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
