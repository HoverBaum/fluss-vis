/* eslint-disable react-compiler/react-compiler */
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { createEditorStore, EditorStore } from './editorStore'

export type EditorStoreApi = ReturnType<typeof createEditorStore>

export const EditorStoreContext = createContext<EditorStoreApi | undefined>(
  undefined
)

export interface EditorStoreProviderProps {
  children: ReactNode
}

export const EditorStoreProvider = ({ children }: EditorStoreProviderProps) => {
  const storeRef = useRef<EditorStoreApi>(undefined)

  if (!storeRef.current) {
    storeRef.current = createEditorStore()
  }

  return (
    // eslint-disable-next-line react-compiler/react-compiler
    <EditorStoreContext.Provider value={storeRef.current}>
      {children}
    </EditorStoreContext.Provider>
  )
}

export const useEditorStore = <T,>(selector: (store: EditorStore) => T): T => {
  const editorStoreContext = useContext(EditorStoreContext)

  if (!editorStoreContext) {
    throw new Error(`useEditorStore must be used within EditorStoreProvider`)
  }

  return useStore(editorStoreContext, selector)
}
