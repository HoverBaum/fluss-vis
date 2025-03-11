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

export const StartNode = ({
  data,
  selected,
}: NodeProps<Node<FlussStepStart>>) => {
  const { outputs, name, description } = data

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
        <div className="flex flex-col items-end">
          {outputs.map((output) => (
            <FlussNodeOutput key={output.id} output={output} id={output.id} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
