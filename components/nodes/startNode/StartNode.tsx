'use client'

import { NodeProps, useNodeId } from '@xyflow/react'
import { StartNodeType } from './StartNodeTypes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FlussNodeOutput } from '../flussNode/FlussNodeOutput'
import { START_NODE_ID } from '@/stores/flussStore'

export const StartNode = ({ data, selected }: NodeProps<StartNodeType>) => {
  const { output } = data
  const nodeId = useNodeId()

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      <small className="absolute top-2 right-2 font-mono">
        {START_NODE_ID}
      </small>
      <CardHeader>
        <CardTitle className="text-xl">Start 🛫</CardTitle>
      </CardHeader>
      <CardContent className="pr-0">
        <div className="flex flex-col items-end">
          <FlussNodeOutput output={output} id={`${nodeId}-output`} />
        </div>
      </CardContent>
    </Card>
  )
}
