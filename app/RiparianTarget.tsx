import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Handle, HandleType, Position, useNodeConnections } from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import { EdgeType } from './EdgeType'

type RiparianTargetProps = {
  id: string
}

const handleType: HandleType = 'target'

export const RiparianTarget = ({ id }: RiparianTargetProps) => {
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
    <div className="relative pl-2">
      <div className="pl-1">
        {(outputType && <EdgeType type={outputType} />) || 'Unselected'}
      </div>
      <Handle
        type={handleType}
        position={Position.Left}
        id={id}
        style={{ position: 'absolute', left: '0px' }}
      />
    </div>
  )
}
