import { Handle, Position } from '@xyflow/react'

type CustomSourceProps = {
  position: Position
}

export const RiparianTarget = ({ position }: CustomSourceProps) => {
  return (
    <div className="relative">
      <div className="pr-2"></div>
      <Handle
        type="target"
        position={position}
        style={{ position: 'absolute', left: '0px' }}
      />
    </div>
  )
}
