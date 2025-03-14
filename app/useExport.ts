import {
  FlussStepEnd,
  FlussStepDefault,
  FlussStepId,
  FlussStepOutputType,
  FlussStepOutputId,
  FlussStepOutput,
} from '@/fluss-lib/fluss'
import { stringToCamelCase } from '@/fluss-lib/nameConversion'
import { END_NODE_ID } from '@/stores/storeHelpers'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Edge, Node } from '@xyflow/react'

type PopulatedInput = {
  edge: Edge
  output: FlussStepOutput
  inputId: string
  nodeId: string
}

type FlussFunctionArgument = {
  source: FlussStepId
  sourceOutput: FlussStepOutputId
  // camelCase name of this argument.
  name: string
  // TypeScript type of this argument.
  type: string
}

type FlussFunction = {
  stepId: FlussStepId
  stepName: string
  // camelCase name of the function for this step.
  functionName: string
  // TypeScript type of the return value of this function.
  returnType: string
  arguments: FlussFunctionArgument[]
}

export const useExport = () => {
  const nodes = useFlussStore((store) => store.nodes)
  const edges = useFlussStore((store) => store.edges)
  const outputTypes = useFlussStore((store) => store.outputTypes)

  const createTypescriptTypes = (outputTypes: FlussStepOutputType[]) => {
    return (
      outputTypes
        // Filter out primitives that TypeScript already provides.
        .filter((outputType) => !outputType.isPrimitive)
        .map((outputType) => {
          return `export type ${outputType.typeName} = ${outputType.content}`
        })
        .join('\n')
    )
  }

  // NEXT: also add the arguments to the functions.

  // const createExecutionCode = () => {
  //   console.log('nodes', nodes)
  //   console.log('edges', edges)
  //   const flussFunctions: FlussFunction[] = nodes
  //     .filter((node) => node.id !== START_NODE_ID && node.id !== END_NODE_ID)
  //     .map((node) => {
  //       if (!node.data.output?.typeId)
  //         throw new Error(`${node.id} has no output TypeId`)
  //       return {
  //         stepId: node.id,
  //         name: stringToCamelCase(node.data.name),
  //         returnType: node.data.output.typeId,
  //         arguments: [],
  //       }
  //     })
  //   console.log(flussFunctions)
  // }

  const createReturnType = (
    node: Node<FlussStepEnd>,
    populatedInputs: PopulatedInput[]
  ) => {
    return `type RunFlussResult = {
${node.data.inputs
  .map((input) => {
    const PopulatedInput = populatedInputs.find(
      (populatedInput) => populatedInput.inputId === input.id
    )
    if (!PopulatedInput)
      throw new Error(`No populated input found for ${input.id}`)
    return `  ${stringToCamelCase(PopulatedInput.output.name)}: ${
      PopulatedInput.output.type
    }`
  })
  .join('\n')}
}`
  }

  const flussExport = () => {
    console.log('new export....')
    const allOutputs = nodes.flatMap((node) => node.data.outputs)
    const populatedInputs: PopulatedInput[] = nodes
      .filter((node) => node.data.type !== 'start')
      .flatMap((node) =>
        (node as Node<FlussStepDefault | FlussStepEnd>).data.inputs.map(
          (input) => ({ inputId: input.id, nodeId: node.id })
        )
      )
      .map((input) => {
        const edgeForInput = edges.find(
          (edge) =>
            edge.targetHandle === input.inputId && edge.target === input.nodeId
        )
        if (!edgeForInput)
          throw new Error(
            `No edge found for input ${input.inputId} from node ${input.nodeId}`
          )
        const output = allOutputs.find(
          (output) => output.id === edgeForInput?.sourceHandle
        )
        if (!output)
          throw new Error(
            `No output found for output ${edgeForInput.sourceHandle}`
          )
        return {
          ...input,
          edge: edgeForInput,
          output,
        }
      })
    console.log('populatedInputs', populatedInputs)

    const flussFunctions: FlussFunction[] = nodes
      .filter((node) => node.data.type !== 'start')
      .map((node) => {
        const nodeData = node.data as FlussStepDefault | FlussStepEnd
        return {
          stepId: node.id,
          stepName: nodeData.name,
          functionName: stringToCamelCase(nodeData.name),
          returnType:
            // TODO: add type for end node!
            nodeData.outputs.length === 1 ? nodeData.outputs[0].type : `any`,
          arguments: populatedInputs
            .filter((input) => input.nodeId === node.id)
            .map((input) => {
              const type = outputTypes.find(
                (outputType) => outputType.id === input.output.type
              )?.typeName
              if (!type)
                throw new Error(`No type found for ${input.output.type}`)
              return {
                source: input.edge.source,
                sourceOutput: input.output.id,
                name: stringToCamelCase(input.output.name),
                type,
              }
            }),
        }
      })

    console.log('flussFunctions', flussFunctions)

    let code = ''
    const typeScriptTypes = createTypescriptTypes(outputTypes)
    console.log(typeScriptTypes)
    code += typeScriptTypes + '\n\n'

    const endNode = nodes.find((node) => node.id === END_NODE_ID)
    if (!endNode || endNode.data.type !== 'end')
      throw new Error('No end node found')
    const returnType = createReturnType(
      endNode as Node<FlussStepEnd>,
      populatedInputs
    )
    console.log('returnType', returnType)
    code += returnType + '\n\n'

    return code
  }

  return {
    flussExport,
  }
}
