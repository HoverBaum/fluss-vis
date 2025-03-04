import { FlussStepId, FlussStepOutputType } from '@/fluss-lib/fluss'
import { nameToFunctionName } from '@/fluss-lib/nameConversion'
import { END_NODE_ID, START_NODE_ID } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'

type FlussFunctionArgument = {
  source: FlussStepId
  name: string
  type: string
}

type FlussFunction = {
  stepId: FlussStepId
  name: string
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
          return `export type ${outputType.id} = ${outputType.content}`
        })
        .join('\n')
    )
  }

  // NEXT: also add the arguments to the functions.

  const createExecutionCode = () => {
    console.log('nodes', nodes)
    console.log('edges', edges)
    const flussFunctions: FlussFunction[] = nodes
      .filter((node) => node.id !== START_NODE_ID && node.id !== END_NODE_ID)
      .map((node) => {
        if (!node.data.output?.typeId)
          throw new Error(`${node.id} has no output TypeId`)
        return {
          stepId: node.id,
          name: nameToFunctionName(node.data.name),
          returnType: node.data.output.typeId,
          arguments: [],
        }
      })
    console.log(flussFunctions)
  }

  const flussExport = () => {
    console.log('exporting…')
    console.log('outputTypes', outputTypes)
    console.log(createTypescriptTypes(outputTypes))
    createExecutionCode()
  }
  return {
    flussExport,
  }
}
