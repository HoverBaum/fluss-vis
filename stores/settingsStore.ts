import { createStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type SettingsState = {
  displayIds: boolean
  alwaysShowDelete: boolean
  bringSelectedEdgesToFront: boolean
}

type SettingsActions = {
  toggleDisplayIds: () => void
  toggleAlwaysShowDelete: () => void
  toggleBringSelectedEdgesToFront: () => void
}

export type SettingsStore = SettingsState & SettingsActions

const initialState: SettingsState = {
  displayIds: true,
  alwaysShowDelete: false,
  bringSelectedEdgesToFront: true,
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
        }),
        {
          name: 'settings-store',
        }
      ),
      { name: 'SettingsStore' }
    )
  )
}
