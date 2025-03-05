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

/**
 * A Node somewhere in the Fluss.
 * A step in the process we define.
 * Can have one or more inputs and has a single output.
 */
export const FlussNode = ({ data, selected }: NodeProps<FlussNodeType>) => {
  const { output, name } = data
  const nodeId = useNodeId()

  return (
    <Card className={`min-w-[250px] ${selected && 'border-foreground'}`}>
      <small className="absolute top-2 right-2 font-mono">{nodeId}</small>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>Description here</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 absolute left-0 top-0">
          <FlussNodeInput id={`${nodeId}-input-1`} />
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
