'use client'

import { useFlussStore } from '@/stores/FlussStoreProvider'

export const FlussTitleDisplay = () => {
  const name = useFlussStore((store) => store.name)

  return <div className="p-2 px-4 bg-background shadow-md">{name}</div>
}
