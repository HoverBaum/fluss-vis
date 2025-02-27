'use client'

import { NodeProps, useNodeId } from '@xyflow/react'
import { StartNodeType } from './StartNodeTypes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FlussNodeOutput } from '../flussNode/FlussNodeOutput'

export const StartNode = ({ data, selected }: NodeProps<StartNodeType>) => {
  const { outputType } = data
  const nodeId = useNodeId()

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      <small className="absolute top-2 right-2 font-mono">START</small>
      <CardHeader>
        <CardTitle className="text-xl">Start 🛫</CardTitle>
      </CardHeader>
      <CardContent className="relative min-h-14">
        <div className="grid grid-cols-1 absolute right-0 top-0">
          <FlussNodeOutput type={outputType} id={`${nodeId}-output`} />
        </div>
      </CardContent>
    </Card>
  )
}
