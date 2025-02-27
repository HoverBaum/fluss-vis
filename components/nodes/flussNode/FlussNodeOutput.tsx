import { BaseIOTypes, TypePicker } from '@/components/nodes/TypePicker'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Handle, Position, useNodeId } from '@xyflow/react'

type FlussNodeOutputProps = {
  id: string
  type?: BaseIOTypes
}

export const FlussNodeOutput = ({ id, type }: FlussNodeOutputProps) => {
  const setOutputType = useFlussStore((state) => state.setOutputType)
  const nodeId = useNodeId()

  return (
    <div className="relative">
      <div className="pr-6">
        <TypePicker
          typeId={type}
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
