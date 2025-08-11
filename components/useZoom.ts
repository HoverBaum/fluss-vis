import { ReactFlowState, useStore } from '@xyflow/react'
import { useMemo } from 'react'
import { useSettingsStore } from '@/stores/SettingsStoreProvider'

const zoomSelector = (state: ReactFlowState) => state.transform[2]

export const useZoom = () => {
  const zoom = useStore(zoomSelector)
  const overviewZoomThreshold = useSettingsStore((s) => s.overviewZoomThreshold)

  const isZoomedOut = useMemo(
    () => zoom <= overviewZoomThreshold,
    [zoom, overviewZoomThreshold]
  )

  return {
    zoom,
    isZoomedOut,
  }
}
