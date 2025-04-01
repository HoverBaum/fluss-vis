import { ReactFlowState, useStore } from '@xyflow/react'
import { useMemo } from 'react'

const zoomSelector = (state: ReactFlowState) => state.transform[2]

export const useZoom = () => {
  const zoom = useStore(zoomSelector)

  const isZoomedOut = useMemo(() => zoom <= 0.7, [zoom])

  return {
    zoom,
    isZoomedOut,
  }
}
