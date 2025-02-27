import { FlussStepOutputTypeId } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'

type EdgeTypeProps = {
  outputTypeId: FlussStepOutputTypeId
}

export const EdgeType = ({ outputTypeId }: EdgeTypeProps) => {
  const outputType = useFlussStore((store) =>
    store.outputTypes.find((type) => type.id === outputTypeId)
  )

  if (!outputType) {
    return <span>{outputTypeId} not found</span>
  }

  return (
    <span className="flex items-center">
      <outputType.icon className="mr-2 h-4 w-4" />
      {outputType.name}
    </span>
  )
}
