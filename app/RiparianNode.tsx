import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RiparianSource } from './RiparianSource'
import { RiparianTarget } from './RiparianTarget'
import { NodeProps, useNodeConnections, useNodeId } from '@xyflow/react'
import { FlussNode } from '@/stores/flussStore'

/**
 * Riparian: from the Latin "ripa" meaning "Riverbank" means "something on the riverbank".
 * Like a Mill on the riverbank, our Riparians create value using the flow of data.
 */
export const RiparianNode = ({ data }: NodeProps<FlussNode>) => {
  const { outputType } = data
  const nodeId = useNodeId()
  const connections = useNodeConnections({
    handleType: 'target',
  })
  console.log('nodeId', nodeId)
  console.log('connections', connections)

  return (
    <Card className="min-w-[250px]">
      <small className="absolute top-2 right-2">{nodeId}</small>
      <CardHeader>
        <CardTitle>Custom Node</CardTitle>
        <CardDescription>Description here</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 absolute left-0 top-0">
          <RiparianTarget id={`${nodeId}-input-1`} />
        </div>
      </CardContent>
      <hr className="my-4" />
      <CardContent className="relative min-h-12">
        <div className="grid grid-cols-1 absolute right-0 top-0">
          <div>
            <RiparianSource type={outputType} id={`${nodeId}-output`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
