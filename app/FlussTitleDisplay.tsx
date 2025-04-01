'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { useState } from 'react'

export const FlussTitleDisplay = () => {
  const name = useFlussStore((store) => store.name)
  const rename = useFlussStore((store) => store.rename)
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(name)

  const cancelEditing = () => {
    setIsEditing(false)
    setNewName(name)
  }

  return (
    <div
      className={`bg-background rounded-xl border px-4 py-2 shadow-sm ${
        isEditing && 'px-6 py-6'
      }`}
    >
      {!isEditing && <span onClick={() => setIsEditing(true)}>{name}</span>}
      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsEditing(false)
            rename(newName)
          }}
        >
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                cancelEditing()
              }
            }}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button type="submit">Save</Button>
            <Button onClick={cancelEditing} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
