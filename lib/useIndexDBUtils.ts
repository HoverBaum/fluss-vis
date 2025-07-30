import { generateId } from '@/fluss-lib/flussId'
import { get, set } from 'idb-keyval'

export const saveFlussFilehandle = async (
  fileHandle: FileSystemFileHandle
): Promise<string> => {
  const key = generateId()
  console.log('Saving to', key)
  await set(key, fileHandle)
  return key
}

export const getFlussFilehandle = async (
  key: string
): Promise<FileSystemFileHandle | undefined> => {
  const fileHandle = await get<FileSystemFileHandle>(key)
  return fileHandle
}

export const deleteFlussFilehandle = async (key: string): Promise<void> => {
  console.log('Deleting file handle for key:', key)
  await set(key, undefined)
}
