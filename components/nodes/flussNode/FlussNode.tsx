'use client'

import { NodeProps, Node } from '@xyflow/react'
import { FlussNodeOutput } from './FlussNodeOutput'
import { FlussNodeInput } from './FlussNodeInput'
import { FlussStepDefault } from '@/fluss-lib/fluss'
import {
  BaseNode,
  BaseNodeInputsContent,
  BaseNodeOutputsContent,
} from '@/components/BaseNode'

/**
 * A Node somewhere in the Fluss.
 * A step in the process we define.
 * Can have one or more inputs and has a single output.
 */
export const FlussNode = ({
  data,
  selected,
  id: nodeId,
}: NodeProps<Node<FlussStepDefault>>) => {
  const { outputs, name, description, inputs } = data

  return (
    <BaseNode
      nodeId={nodeId}
      name={name}
      description={description}
      selected={selected}
    >
      <BaseNodeInputsContent>
        {inputs &&
          inputs.map((input) => (
            <FlussNodeInput key={input.id} id={input.id} nodeId={nodeId} />
          ))}
      </BaseNodeInputsContent>
      <hr className="mb-6" />
      <BaseNodeOutputsContent>
        <FlussNodeOutput output={outputs[0]} />
      </BaseNodeOutputsContent>
    </BaseNode>
  )
}
