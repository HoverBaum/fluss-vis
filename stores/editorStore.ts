import { createStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type EditorState = {
  showGreeting: boolean
}

type EditorActions = {
  setShowGreeting: (show: boolean) => void
}

export type EditorStore = EditorState & EditorActions

const initialState: EditorState = {
  showGreeting: true,
}

export const createEditorStore = (initState: EditorState = initialState) => {
  return createStore<EditorStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setShowGreeting(show) {
            set({ showGreeting: show })
          },
        }),
        {
          name: 'EditorStore',
        }
      ),
      { name: 'EditorStore' }
    )
  )
}
