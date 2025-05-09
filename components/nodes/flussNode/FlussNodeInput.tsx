import { motion } from 'motion/react'
import {
  Handle,
  HandleType,
  Position,
  useNodeConnections,
  useNodesData,
} from '@xyflow/react'
import { FlussNodeType } from '@/stores/flussStore'
import { EdgeType } from '../EdgeType'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { useState } from 'react'
import { ButtonRemove } from '@/components/ButtonRemove'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'
import { FlussStep, FlussStepOutput } from '@/fluss-lib/fluss'

const outputFromStep = (
  step: FlussStep,
  id: string
): FlussStepOutput | undefined => {
  if (!step) return undefined
  switch (step.type) {
    case 'end':
      return undefined
    case 'start':
      return step.outputs.find((output) => output.id === id)
    case 'step':
      return step.outputs[0]
  }
}

type FlussNodeInputProps = {
  // ID of an input, that is output handle.
  id: string
  // ID of a node that this input belongs to.
  nodeId: string
}

const handleType: HandleType = 'target'

export const FlussNodeInput = ({ id, nodeId }: FlussNodeInputProps) => {
  const animationState = useFlussStore((state) => {
    const node = state.nodes.find((node) => node.id === nodeId)
    if (node && node.data.type !== 'start') {
      return node.data.inputs.find((input) => input.id === id)?.state
    }
  })
  const alwaysShowDelete = useSettingsStore((state) => state.alwaysShowDelete)
  const [isHovered, setIsHovered] = useState(false)
  const connections = useNodeConnections({
    handleType: handleType,
    handleId: id,
    id: nodeId,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      className={`relative pl-6 ${animationState === 'exiting' ? 'opacity-10! transition-opacity duration-300 ease-out' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between gap-2">
        {input?.type && (
          <span className="flex flex-wrap">
            <EdgeType outputTypeId={input.type} />{' '}
            <span className="ml-1"> - {input.name}</span>
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
    </motion.div>
  )
}
