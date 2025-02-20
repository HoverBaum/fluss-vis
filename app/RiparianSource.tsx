import { BaseIOTypes, TypePicker } from '@/components/TypePicker'
import { Handle, Position } from '@xyflow/react'
import { useState } from 'react'

type CustomSourceProps = {
  position: Position
}

export const RiparianSource = ({ position }: CustomSourceProps) => {
  const [handleType, setHandleType] = useState<BaseIOTypes>()

  return (
    <div className="relative">
      <div className="pr-2">
        <TypePicker type={handleType} onTypeChange={setHandleType} />
      </div>
      <Handle
        type="source"
        position={position}
        style={{ position: 'absolute', right: '0px' }}
      />
    </div>
  )
}
