import { TypePicker } from '@/components/nodes/TypePicker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FlussNodeOutputType } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Handle, Position, useNodeId } from '@xyflow/react'

type FlussNodeOutputProps = {
  // ID for this Output.
  id: string
  output?: FlussNodeOutputType
}

export const FlussNodeOutput = ({ id, output }: FlussNodeOutputProps) => {
  const nodeId = useNodeId()
  const setOutputType = useFlussStore((state) => state.setOutputType)
  const setOutputName = useFlussStore((state) => state.setOutputName)

  return (
    <div className="relative">
      <div className="pr-6 flex flex-col items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
          <Label htmlFor={`${id}-outputName`}>Output Name</Label>
          <Input
            type="text"
            id={`${id}-outputName`}
            placeholder=""
            value={output?.name || ''}
            onChange={(e) => setOutputName(nodeId!, e.target.value)}
          />
        </div>

        <TypePicker
          typeId={output?.typeId}
          onTypeChange={(newType) => setOutputType(nodeId!, newType)}
        />
      </div>
      <Handle
        type="source"
        id={id}
        position={Position.Right}
        style={{ position: 'absolute', right: '0px' }}
      />
    </div>
  )
}
