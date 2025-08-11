import { createStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type SettingsState = {
  settingsDialogOpen: boolean
  displayIds: boolean
  alwaysShowDelete: boolean
  edgesSelectedToFront: boolean
  edgesSelectionAnimated: boolean
  showExampleOverwriteWarning: boolean
  /**
   * At or below this zoom level the editor switches to overview mode.
   * Example: 0.6 means overview at 60% or less.
   */
  overviewZoomThreshold: number
}

type SettingsActions = {
  toggleDisplayIds: () => void
  toggleAlwaysShowDelete: () => void
  toggleEdgesSelectedToFront: () => void
  toggleEdgesSelectionAnimated: () => void
  setShowExampleOverwriteWarning: (show: boolean) => void
  setSettingsDialogOpen: (isOpen: boolean) => void
  setOverviewZoomThreshold: (value: number) => void
}

export type SettingsStore = SettingsState & SettingsActions

const initialState: SettingsState = {
  settingsDialogOpen: false,
  displayIds: true,
  alwaysShowDelete: false,
  edgesSelectedToFront: true,
  edgesSelectionAnimated: true,
  showExampleOverwriteWarning: true,
  overviewZoomThreshold: 0.6,
}

export const createSettingsStore = (
  initState: SettingsState = initialState
) => {
  return createStore<SettingsStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initState,
          toggleAlwaysShowDelete() {
            set({ alwaysShowDelete: !get().alwaysShowDelete })
          },
          toggleDisplayIds() {
            set({ displayIds: !get().displayIds })
          },
          toggleEdgesSelectedToFront() {
            set({ edgesSelectedToFront: !get().edgesSelectedToFront })
          },
          toggleEdgesSelectionAnimated() {
            set({ edgesSelectionAnimated: !get().edgesSelectionAnimated })
          },
          setShowExampleOverwriteWarning(show: boolean) {
            set({ showExampleOverwriteWarning: show })
          },
          setOverviewZoomThreshold(value: number) {
            // Clamp to reasonable bounds used in UI (0.3–1.0)
            const clamped = Math.max(0.3, Math.min(1, value))
            set({ overviewZoomThreshold: clamped })
          },
          setSettingsDialogOpen(isOpen) {
            set({ settingsDialogOpen: isOpen })
          },
        }),
        {
          name: 'SettingsStore',
        }
      ),
      { name: 'SettingsStore' }
    )
  )
}
