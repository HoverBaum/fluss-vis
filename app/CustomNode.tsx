import { Handle, NodeProps, Position } from '@xyflow/react'

const handleStyle = { left: 10 }

export const CustomNode = ({ data }: NodeProps) => {
  console.log(data)

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  )
}
