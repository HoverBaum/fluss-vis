import { createStore } from 'zustand/vanilla'

export type FlussState = {
  name: string
}

export type FlussActions = {
  rename: (name: string) => void
}

export type FlussStore = FlussState & FlussActions

export const defaultInitState: FlussState = {
  name: 'Untitled Fluss 🌊',
}

export const createFlussStore = (initState: FlussState = defaultInitState) => {
  return createStore<FlussStore>()((set) => ({
    ...initState,
    rename: (name: string) => set({ name }),
  }))
}
