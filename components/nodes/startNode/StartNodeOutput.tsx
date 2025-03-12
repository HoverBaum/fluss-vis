import { FlussStepOutput } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { FlussNodeOutput } from '../flussNode/FlussNodeOutput'
import { useState } from 'react'
import { ButtonX } from '@/components/ButtonX'

type StartNodeOutputProps = {
  output: FlussStepOutput
  canBeRemoved: boolean
}

export const StartNodeOutput = ({
  output,
  canBeRemoved,
}: StartNodeOutputProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const removeFlussParameter = useFlussStore(
    (state) => state.removeFlussParameter
  )

  return (
    <div
      className="flex flex-row items-center gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ButtonX
        onClick={() => removeFlussParameter(output.id)}
        isInvisible={!isHovered}
        disabled={!canBeRemoved}
      />
      <FlussNodeOutput output={output} />
    </div>
  )
}
