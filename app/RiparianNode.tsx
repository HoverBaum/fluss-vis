import { Position } from '@xyflow/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RiparianSource } from './RiparianSource'
import { RiparianTarget } from './RiparianTarget'

/**
 * Riparian: from the Latin "ripa" meaning "Riverbank" means "something on the riverbank".
 * Like a Mill on the riverbank, our Riparians create value using the flow of data.
 */
export const RiparianNode = () => {
  return (
    <Card className="min-w-[250px]">
      <CardHeader>
        <CardTitle>Custom Node</CardTitle>
        <CardDescription>Description here</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 absolute left-0 top-0">
          <RiparianTarget position={Position.Left} />
        </div>
      </CardContent>
      <hr className="my-4" />
      <CardContent className="relative min-h-12">
        <div className="grid grid-cols-1 absolute right-0 top-0">
          <div>
            <RiparianSource position={Position.Right} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
