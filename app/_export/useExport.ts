import parserTypeScript from 'prettier/parser-typescript'
import prettierPluginEstree from 'prettier/plugins/estree'
import prettier from 'prettier/standalone'
import {
  FlussStepEnd,
  FlussStepDefault,
  FlussStepId,
  FlussStepOutputType,
  FlussStepOutputId,
  FlussStepOutput,
} from '@/fluss-lib/fluss'
import { stringToValidIdentifier } from '@/fluss-lib/nameConversion'
import { START_NODE_ID } from '@/stores/storeHelpers'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Edge, Node } from '@xyflow/react'
import { flussTemplate } from '../flussTemplate'

type PopulatedInput = {
  // The outputs name as a valid idnetifier.
  identifier: string
  // TypeScript identifier for this type. PascalCase for custom types and lowercase for primatives.
  typeName: string
  edge: Edge
  output: FlussStepOutput
  inputId: string
  nodeId: string
}

export type FlussArgument = {
  // Valid camelCase identifier for this input.
  identifier: string
  // TypeScript type for this input like a custom types name to use in code.
  type: string
}

type FlussFunctionArgument = {
  source: FlussStepId
  sourceOutput: FlussStepOutputId
  // camelCase name of this argument.
  name: string
  // TypeScript type of this argument.
  type: string
  // Whether this argument is the entire output of the source step.
  usesEntireOutput: boolean
}

export type FlussFunction = {
  stepId: FlussStepId
  stepName: string
  description: string
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
  const name = useFlussStore((store) => store.name)

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

  const flussExport = async () => {
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
        const typeName = outputTypes.find(
          (outputType) => outputType.id === output.type
        )?.typeName
        if (!typeName) throw new Error(`No type found for ${output.type}`)
        return {
          ...input,
          identifier: stringToValidIdentifier(output.name),
          edge: edgeForInput,
          output,
          typeName,
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
          description: nodeData.description,
          functionName: stringToValidIdentifier(nodeData.name),
          returnType:
            nodeData.outputs.length === 1
              ? nodeData.outputs[0].type
              : // This probably only affects the end 😅 we turn all inptus into an output.
                (() => {
                  const inputs = nodeData.inputs.reduce(
                    (acc, input) => {
                      const populatedInput = populatedInputs.find(
                        (populatedInput) => populatedInput.inputId === input.id
                      )
                      if (!populatedInput)
                        throw new Error(
                          `No populated input found for ${input.id}`
                        )
                      acc[populatedInput.identifier] = populatedInput.typeName
                      return acc
                    },
                    {} as Record<string, string>
                  )
                  return `{${Object.entries(inputs)
                    .map(([key, value]) => {
                      return `${key}: ${value}`
                    })
                    .join(',\n')}}`
                })(),

          arguments: populatedInputs
            .filter((input) => input.nodeId === node.id)
            .map((input) => {
              const type = outputTypes.find(
                (outputType) => outputType.id === input.output.type
              )?.typeName
              if (!type)
                throw new Error(`No type found for ${input.output.type}`)
              const sourceNode = nodes.find(
                (node) => node.id === input.edge.source
              )
              if (!sourceNode)
                throw new Error(`No source node found for ${input.edge.source}`)
              const usesEntireOutput = sourceNode.data.outputs.length === 1
              return {
                source: stringToValidIdentifier(sourceNode.data.name),
                sourceOutput: input.output.id,
                name: stringToValidIdentifier(input.output.name),
                type,
                usesEntireOutput,
              }
            }),
        }
      })
    console.log('flussFunctions', flussFunctions)

    const typeScriptTypes = createTypescriptTypes(outputTypes)
    console.log(typeScriptTypes)

    const startNode = nodes.find((node) => node.id === START_NODE_ID)
    if (!startNode || startNode.data.type !== 'start')
      throw new Error('No start node found')

    const flussInputs: FlussArgument[] = startNode.data.outputs.map(
      (output) => {
        const type = outputTypes.find(
          (outputType) => outputType.id === output.type
        )
        if (!type) throw new Error(`No type found for ${output.type}`)
        return {
          type: type.typeName,
          identifier: stringToValidIdentifier(output.name),
        }
      }
    )

    const formattedCode = await prettier.format(
      flussTemplate({
        customTypes: typeScriptTypes,
        flussFunctions,
        flussInputs,
        entireStateJSON: JSON.stringify({ name, edges, nodes, outputTypes }),
      }),
      {
        parser: 'typescript',
        plugins: [parserTypeScript, prettierPluginEstree],
        semi: false,
      }
    )
    return formattedCode
  }

  return {
    flussExport,
  }
}
