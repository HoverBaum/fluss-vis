import {
  deleteFlussFilehandle,
  saveFlussFilehandle,
} from '@/lib/useIndexDBUtils'

export type FlussFileHandleStore = {
  setFileHandleKey: (key: string | undefined) => void
  setSavedFileName: (name: string | undefined) => void
}

/**
 * Sets the current file: stores handle in IndexedDB and updates Zustand (key + name).
 * If previousKey is provided, removes the old handle from IDB first.
 * This is the only place that should update both IDB and store for "current file".
 */
export async function setCurrentFile(
  handle: FileSystemFileHandle,
  store: FlussFileHandleStore,
  previousKey?: string
): Promise<void> {
  if (previousKey) {
    await deleteFlussFilehandle(previousKey)
  }
  const key = await saveFlussFilehandle(handle)
  store.setFileHandleKey(key)
  store.setSavedFileName(handle.name)
}

/**
 * Clears the current file: removes handle from IndexedDB and clears key + name in Zustand.
 */
export async function clearCurrentFile(
  key: string,
  store: FlussFileHandleStore
): Promise<void> {
  await deleteFlussFilehandle(key)
  store.setFileHandleKey(undefined)
  store.setSavedFileName(undefined)
}
