import { createStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type SettingsState = {
  settingsDialogOpen: boolean
  displayIds: boolean
  alwaysShowDelete: boolean
  bringSelectedEdgesToFront: boolean
  showExampleOverwriteWarning: boolean
}

type SettingsActions = {
  toggleDisplayIds: () => void
  toggleAlwaysShowDelete: () => void
  toggleBringSelectedEdgesToFront: () => void
  setShowExampleOverwriteWarning: (show: boolean) => void
  setSettingsDialogOpen: (isOpen: boolean) => void
}

export type SettingsStore = SettingsState & SettingsActions

const initialState: SettingsState = {
  settingsDialogOpen: false,
  displayIds: true,
  alwaysShowDelete: false,
  bringSelectedEdgesToFront: true,
  showExampleOverwriteWarning: true,
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
          toggleBringSelectedEdgesToFront() {
            set({ bringSelectedEdgesToFront: !get().bringSelectedEdgesToFront })
          },
          setShowExampleOverwriteWarning(show: boolean) {
            set({ showExampleOverwriteWarning: show })
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
