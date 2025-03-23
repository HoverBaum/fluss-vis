import { TypePicker } from '@/components/nodes/TypePicker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FlussStepOutput } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Handle, Position, useNodeId } from '@xyflow/react'

type FlussNodeOutputProps = {
  output: FlussStepOutput
}

export const FlussNodeOutput = ({ output }: FlussNodeOutputProps) => {
  const nodeId = useNodeId()
  const setOutputType = useFlussStore((state) => state.setOutputType)
  const setOutputName = useFlussStore((state) => state.setOutputName)

  return (
    <div className="relative">
      <div className="pr-6 flex flex-col items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
          <Label htmlFor={`${output.id}-outputName`} className="font-semibold">
            Output Name
          </Label>
          <Input
            type="text"
            id={`${output.id}-outputName`}
            placeholder=""
            value={output?.name || ''}
            onChange={(e) => setOutputName(nodeId!, output.id, e.target.value)}
          />
        </div>

        <TypePicker
          typeId={output.type}
          onTypeChange={(newType) => setOutputType(nodeId!, output.id, newType)}
        />
      </div>
      <Handle
        type="source"
        id={output.id}
        position={Position.Right}
        style={{ position: 'absolute', right: '0px' }}
      />
    </div>
  )
}
