import { FlussStepOutputType } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'

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

  const flussExport = () => {
    console.log('exporting…')
    console.log('outputTypes', outputTypes)
    console.log(createTypescriptTypes(outputTypes))
    console.log('nodes', nodes)
    console.log('edges', edges)
  }
  return {
    flussExport,
  }
}
