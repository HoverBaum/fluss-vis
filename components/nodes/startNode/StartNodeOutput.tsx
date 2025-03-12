import { Button } from '@/components/ui/button'
import { FlussStepOutput } from '@/fluss-lib/fluss'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Trash } from 'lucide-react'
import { FlussNodeOutput } from '../flussNode/FlussNodeOutput'
import { useState } from 'react'

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
      <Button
        className={`opacity-0 ${isHovered && 'opacity-100'}`}
        variant="secondary"
        size="icon"
        onClick={() => removeFlussParameter(output.id)}
        disabled={!canBeRemoved}
      >
        <Trash />
      </Button>

      <FlussNodeOutput output={output} />
    </div>
  )
}
