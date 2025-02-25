import { BaseIOTypes } from '@/components/TypePicker'
import { Handle, Position } from '@xyflow/react'

type RiparianTargetProps = {
  id: string
  dataType?: BaseIOTypes
}

export const RiparianTarget = ({ id, dataType }: RiparianTargetProps) => {
  return (
    <div className="relative pl-2">
      <div className="pr-2">{dataType || 'Unselected'}</div>
      <Handle
        type="target"
        position={Position.Left}
        id={id}
        style={{ position: 'absolute', left: '0px' }}
      />
    </div>
  )
}
