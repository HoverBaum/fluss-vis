import { BaseIOTypes, TypePicker } from '@/components/TypePicker'
import { Handle, Position } from '@xyflow/react'
import { useState } from 'react'

type RiparianSourceProps = {
  id: string
}

export const RiparianSource = ({ id }: RiparianSourceProps) => {
  const [handleType, setHandleType] = useState<BaseIOTypes>()

  return (
    <div className="relative">
      <div className="pr-2">
        <TypePicker type={handleType} onTypeChange={setHandleType} />
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
