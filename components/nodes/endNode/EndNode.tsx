'use client'

import { Node, NodeProps } from '@xyflow/react'
import { END_NODE_ID } from '@/stores/storeHelpers'
import { FlussNodeInput } from '../flussNode/FlussNodeInput'
import { FlussStepEnd } from '@/fluss-lib/fluss'
import { BaseNode, BaseNodeInputsContent } from '@/components/BaseNode'

export const EndNode = ({ selected, data }: NodeProps<Node<FlussStepEnd>>) => {
  const { name, inputs, description } = data

  return (
    <BaseNode
      nodeId={END_NODE_ID}
      name={name}
      description={description}
      selected={selected}
      state={data.state}
    >
      <BaseNodeInputsContent>
        {inputs &&
          inputs.map((input) => (
            <FlussNodeInput key={input.id} id={input.id} nodeId={END_NODE_ID} />
          ))}
      </BaseNodeInputsContent>
    </BaseNode>
  )
}
