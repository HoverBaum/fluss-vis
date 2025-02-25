import { BaseIOTypes, TypePicker } from '@/components/TypePicker'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Handle, Position, useNodeId } from '@xyflow/react'

type RiparianSourceProps = {
  id: string
  type?: BaseIOTypes
}

export const RiparianSource = ({ id, type }: RiparianSourceProps) => {
  const setOutputType = useFlussStore((state) => state.setOutputType)
  const nodeId = useNodeId()

  return (
    <div className="relative">
      <div className="pr-2">
        <TypePicker
          type={type}
          onTypeChange={(newType) => setOutputType(nodeId!, newType)}
        />
      </div>
      <Handle
        type="source"
        id={id}
        position={Position.Right}
        style={{ position: 'absolute', right: '0px' }}
      />
    </div>
  )
}
