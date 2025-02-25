import { useFlussStore } from '@/stores/FlussStoreProvider'
import { useOnViewportChange } from '@xyflow/react'

export const FlowEditorViewportReporter = () => {
  const setViewport = useFlussStore((state) => state.setViewport)
  useOnViewportChange({
    onEnd: setViewport,
  })

  return null
}
