'use client'

import { Node, NodeProps } from '@xyflow/react'
import { START_NODE_ID } from '@/stores/nodeHelpers'
import { FlussStepStart } from '@/fluss-lib/fluss'
import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { StartNodeOutput } from './StartNodeOutput'
import { BaseNode, BaseNodeOutputsContent } from '@/components/nodes/BaseNode'

export const StartNode = ({
  data,
  selected,
}: NodeProps<Node<FlussStepStart>>) => {
  const { outputs, name, description } = data
  const addFlussParameter = useFlussStore((state) => state.addFlussParameter)

  return (
    <BaseNode
      nodeId={START_NODE_ID}
      name={name}
      description={description}
      selected={selected}
      className="min-w-[250px]"
      acceptsInputs={false}
      state={data.state}
    >
      <BaseNodeOutputsContent>
        <div className="flex flex-col items-end gap-4">
          {outputs.map((output, index) => (
            <div key={output.id}>
              <StartNodeOutput
                output={output}
                canBeRemoved={outputs.length > 1}
              />
              {index < outputs.length - 1 && <hr className="mt-4" />}
            </div>
          ))}
        </div>

        <div className="mt-6 flex w-full justify-end pr-6">
          <Button variant="secondary" onClick={addFlussParameter}>
            Add Parameter
          </Button>
        </div>
      </BaseNodeOutputsContent>
    </BaseNode>
  )
}
