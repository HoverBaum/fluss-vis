import { FlussStepOutputTypeId } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { DynamicIcon } from 'lucide-react/dynamic'

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
      <DynamicIcon name={outputType.icon} className="mr-2 size-4" />
      {outputType.displayName}
    </span>
  )
}
