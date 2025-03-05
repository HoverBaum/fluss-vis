'use client'

import { NodeProps, useNodeId } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { END_NODE_ID } from '@/stores/storeHelpers'
import { FlussNodeInput } from '../flussNode/FlussNodeInput'

export const EndNode = ({ selected }: NodeProps) => {
  const nodeId = useNodeId()

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      <small className="absolute top-2 right-2 font-mono">{END_NODE_ID}</small>
      <CardHeader>
        <CardTitle className="text-xl">End 🛬</CardTitle>
      </CardHeader>
      <CardContent className="relative min-h-14">
        <div className="grid grid-cols-1 absolute left-0 top-0">
          <FlussNodeInput id={`${nodeId}-input-1`} />
        </div>
      </CardContent>
    </Card>
  )
}
