'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { createFlussStore, FlussStore } from './flussStore'

export type FlussStoreApi = ReturnType<typeof createFlussStore>

export const FlussStoreContext = createContext<FlussStoreApi | undefined>(
  undefined
)

export interface FlussStoreProviderProps {
  children: ReactNode
}

export const FlussStoreProvider = ({ children }: FlussStoreProviderProps) => {
  const storeRef = useRef<FlussStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createFlussStore()
  }

  return (
    <FlussStoreContext.Provider value={storeRef.current}>
      {children}
    </FlussStoreContext.Provider>
  )
}

export const useFlussStore = <T,>(selector: (store: FlussStore) => T): T => {
  const flussStoreContext = useContext(FlussStoreContext)

  if (!flussStoreContext) {
    throw new Error(`useFlussStore must be used within FlussStoreProvider`)
  }

  return useStore(flussStoreContext, selector)
}
