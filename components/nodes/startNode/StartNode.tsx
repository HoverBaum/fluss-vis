'use client'

import { Node, NodeProps } from '@xyflow/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { START_NODE_ID } from '@/stores/storeHelpers'
import { FlussStepStart } from '@/fluss-lib/fluss'
import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { StartNodeOutput } from './StartNodeOutput'
import { useSidebar } from '@/components/ui/sidebar'

export const StartNode = ({
  data,
  selected,
}: NodeProps<Node<FlussStepStart>>) => {
  const { outputs, name, description } = data
  const addFlussParameter = useFlussStore((state) => state.addFlussParameter)
  const { setOpen } = useSidebar()

  return (
    <Card
      className={`min-w-[250px] ${selected && 'border-foreground'}`}
      onDoubleClick={() => setOpen(true)}
    >
      <small className="absolute top-2 right-2 font-mono">
        {START_NODE_ID}
      </small>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pr-0">
        <div className="flex flex-col items-end gap-4">
          {outputs.map((output, index) => (
            <div key={output.id}>
              <StartNodeOutput
                output={output}
                canBeRemoved={outputs.length > 1}
              />
              {index < outputs.length - 1 && <hr className="mt-4" />}
            </div>
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
