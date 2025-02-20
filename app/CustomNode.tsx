import { Handle, NodeProps, Position } from '@xyflow/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ComboboxPopover } from '@/components/ComboboxPopOver'

export const CustomNode = ({ data }: NodeProps) => {
  console.log(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Node</CardTitle>
        <CardDescription>Description here</CardDescription>
      </CardHeader>
      <CardContent className="relative min-h-20">
        <Handle type="target" position={Position.Left} />

        <div className="grid grid-cols-1 h-full absolute right-0 top-0">
          <div>
            <Handle
              type="source"
              position={Position.Right}
              style={{ position: 'relative' }}
              id="a"
            />
          </div>
          <div>
            <Handle
              type="source"
              position={Position.Right}
              style={{ position: 'relative' }}
              id="b"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
