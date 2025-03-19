import {
  Handle,
  HandleType,
  Position,
  useNodeConnections,
  useNodeId,
  useNodesData,
} from '@xyflow/react'
import { FlussNodeType } from '@/stores/flussStore'
import { EdgeType } from '../EdgeType'
import { outputFromStep } from '@/fluss-lib/nodeOperations'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { useState } from 'react'
import { ButtonRemove } from '@/components/ButtonRemove'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'

type FlussNodeInputProps = {
  id: string
}

const handleType: HandleType = 'target'

export const FlussNodeInput = ({ id }: FlussNodeInputProps) => {
  const alwaysShowDelete = useSettingsStore((state) => state.alwaysShowDelete)
  const [isHovered, setIsHovered] = useState(false)
  const nodeId = useNodeId()
  const connections = useNodeConnections({
    handleType: handleType,
    handleId: id,
  })
  const sourceId = connections[0]?.source
  const sourceHandleId = connections[0]?.sourceHandle
  const sourceNode = useNodesData<FlussNodeType>(sourceId)
  const input =
    sourceHandleId && sourceNode
      ? outputFromStep(sourceNode.data, sourceHandleId)
      : undefined
  const removeInput = useFlussStore((state) => state.removeInput)

  return (
    <div
      className="relative pl-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-2 items-center justify-between">
        {input?.type && (
          <span className="flex flex-wrap gap-1">
            <EdgeType outputTypeId={input.type} /> <span> - {input.name}</span>
            {connections.length > 1 && (
              <span> (+{connections.length - 1})</span>
            )}
          </span>
        )}
        {connections.length > 0 && !input?.type && 'Unselected'}
        {connections.length === 0 && (
          <small className="opacity-50">Unconnected</small>
        )}

        <ButtonRemove
          onClick={() => removeInput(nodeId!, id)}
          isInvisible={!(isHovered || alwaysShowDelete)}
        />
      </div>

      <Handle
        type={handleType}
        position={Position.Left}
        id={id}
        style={{ position: 'absolute', left: '0px' }}
        isConnectable={connections.length === 0}
      />
    </div>
  )
}
