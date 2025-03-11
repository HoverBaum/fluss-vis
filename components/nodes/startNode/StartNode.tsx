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
import { Trash } from 'lucide-react'

export const StartNode = ({
  data,
  selected,
}: NodeProps<Node<FlussStepStart>>) => {
  const { outputs, name, description } = data
  const addFlussParameter = useFlussStore((state) => state.addFlussParameter)
  const removeFlussParameter = useFlussStore(
    (state) => state.removeFlussParameter
  )

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
          {outputs.map((output, index) => (
            <div key={output.id}>
              <div className="flex flex-row items-center gap-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => removeFlussParameter(output.id)}
                  disabled={outputs.length === 1}
                >
                  <Trash />
                </Button>
                <FlussNodeOutput output={output} />
              </div>
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
