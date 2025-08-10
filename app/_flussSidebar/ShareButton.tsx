'use client'

import { Button } from '@/components/ui/button'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { encodeSharedFluss } from '@/lib/share'
import { Link2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

type ShareButtonProps = {
  className?: React.ComponentProps<typeof Button>['className']
}

export const ShareButton = ({ className = '' }: ShareButtonProps) => {
  const state = useFlussStore(
    useShallow((flussStore) => ({
      name: flussStore.name,
      nodes: flussStore.nodes,
      edges: flussStore.edges,
      outputTypes: flussStore.outputTypes,
    }))
  )

  const onShare = async () => {
    try {
      const payload = { version: 1, state }
      const encoded = encodeSharedFluss(payload)
      const { origin } = window.location
      const shareUrl = `${origin}/open?fluss=${encoded}`
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard.')
    } catch (e) {
      console.error(e)
      toast.error('Failed to create share link.')
    }
  }

  return (
    <Button className={className} onClick={onShare} variant="secondary">
      Share <Link2Icon className="size-4" />
    </Button>
  )
}


