'use client'

import { Node, NodeProps } from '@xyflow/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FlussNodeOutput } from '../flussNode/FlussNodeOutput'
import { START_NODE_ID } from '@/stores/storeHelpers'
import { FlussStepStart } from '@/fluss-lib/fluss'
import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'

export const StartNode = ({
  data,
  selected,
}: NodeProps<Node<FlussStepStart>>) => {
  const { outputs, name, description } = data
  const addFlussParameter = useFlussStore((state) => state.addFlussParameter)

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      <small className="absolute top-2 right-2 font-mono">
        {START_NODE_ID}
      </small>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pr-0">
        <div className="flex flex-col items-end gap-4">
          {outputs.map((output) => (
            <FlussNodeOutput key={output.id} output={output} />
          ))}
        </div>

        <div className="mt-6 pr-6 flex justify-end w-full">
          <Button variant="secondary" onClick={addFlussParameter}>
            Add Parameter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
