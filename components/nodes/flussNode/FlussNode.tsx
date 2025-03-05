import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FlussNodeOutput } from './FlussNodeOutput'
import { FlussNodeInput } from './FlussNodeInput'
import { NodeProps, useNodeId } from '@xyflow/react'
import { FlussNodeType } from '@/stores/flussStore'
import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'

/**
 * A Node somewhere in the Fluss.
 * A step in the process we define.
 * Can have one or more inputs and has a single output.
 */
export const FlussNode = ({ data, selected }: NodeProps<FlussNodeType>) => {
  const { output, name, inputs } = data
  const nodeId = useNodeId()
  const addInput = useFlussStore((state) => state.addInput)

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      <small className="absolute top-2 right-2 font-mono">{nodeId}</small>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>Description here</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pb-0">
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
      <hr className="my-6" />
      <CardContent className="pr-0">
        <div className="flex flex-col items-end">
          <FlussNodeOutput output={output} id={`${nodeId}-output`} />
        </div>
      </CardContent>
    </Card>
  )
}
