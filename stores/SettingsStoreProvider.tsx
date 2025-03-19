'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { createSettingsStore, SettingsStore } from './settingsStore'

export type SettingsStoreApi = ReturnType<typeof createSettingsStore>

export const SettingsStoreContext = createContext<SettingsStoreApi | undefined>(
  undefined
)

export interface SettingsStoreProviderProps {
  children: ReactNode
}

export const SettingsStoreProvider = ({
  children,
}: SettingsStoreProviderProps) => {
  const storeRef = useRef<SettingsStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createSettingsStore()
  }

  return (
    <SettingsStoreContext.Provider value={storeRef.current}>
      {children}
    </SettingsStoreContext.Provider>
  )
}

export const useSettingsStore = <T,>(
  selector: (store: SettingsStore) => T
): T => {
  const settingsStoreContext = useContext(SettingsStoreContext)

  if (!settingsStoreContext) {
    throw new Error(
      `useSettingsStore must be used within SettingsStoreProvider`
    )
  }

  return useStore(settingsStoreContext, selector)
}
