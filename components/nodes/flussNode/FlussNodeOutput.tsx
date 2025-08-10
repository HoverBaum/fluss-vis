import { TypePicker } from '@/components/nodes/TypePicker'
import { Input } from '@/components/ui/input'
import { useZoom } from '@/components/useZoom'
import { FlussStepOutput } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import {
  Handle,
  Position,
  ReactFlowState,
  useNodeId,
  useStore,
  useUpdateNodeInternals,
} from '@xyflow/react'
import { useEffect } from 'react'

type FlussNodeOutputProps = {
  output: FlussStepOutput
}

const isConnectableSelector = (state: ReactFlowState) => state.nodesConnectable

export const FlussNodeOutput = ({ output }: FlussNodeOutputProps) => {
  const { isZoomedOut } = useZoom()
  const nodeId = useNodeId()
  const setOutputType = useFlussStore((state) => state.setOutputType)
  const setOutputName = useFlussStore((state) => state.setOutputName)
  const updateNodeInternals = useUpdateNodeInternals()
  const isConnectable = useStore(isConnectableSelector)

  useEffect(() => {
    if (!nodeId) return undefined
    updateNodeInternals(nodeId)
  }, [nodeId, updateNodeInternals, isZoomedOut])

  return (
    <div className="relative">
      <div className="flex flex-col items-end pr-6">
        <div className="mb-2 grid w-full max-w-sm items-center gap-1.5">
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
        className={`${isZoomedOut ? 'size-4!' : ''}`}
        isConnectable={isConnectable}
      />
    </div>
  )
}
