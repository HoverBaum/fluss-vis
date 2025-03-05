'use client'

import { NodeProps, useNodeId } from '@xyflow/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { END_NODE_ID } from '@/stores/storeHelpers'
import { FlussNodeInput } from '../flussNode/FlussNodeInput'
import { FlussNodeType } from '@/stores/flussStore'
import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'

export const EndNode = ({ selected, data }: NodeProps<FlussNodeType>) => {
  const nodeId = useNodeId()
  const { name, inputs } = data
  const addInput = useFlussStore((state) => state.addInput)

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      <small className="absolute top-2 right-2 font-mono">{END_NODE_ID}</small>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="grid grid-cols-1 gap-2">
          {inputs &&
            inputs.map((input) => (
              <FlussNodeInput key={input.id} id={`${nodeId}-${input.id}`} />
            ))}
        </div>
        <div className="pl-6">
          <Button
            variant="secondary"
            className="mt-2"
            onClick={() => addInput(nodeId!)}
          >
            Add input
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
