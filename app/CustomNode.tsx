import { Handle, Position } from '@xyflow/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CustomSource } from './CustomSource'

export const CustomNode = () => {
  return (
    <Card className="min-w-[250px]">
      <CardHeader>
        <CardTitle>Custom Node</CardTitle>
        <CardDescription>Description here</CardDescription>
      </CardHeader>
      <CardContent>
        <Handle type="target" position={Position.Left} />
      </CardContent>
      <hr className="my-4" />
      <CardContent className="relative min-h-12">
        <div className="grid grid-cols-1 absolute right-0 top-0">
          <div>
            <CustomSource position={Position.Right} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
