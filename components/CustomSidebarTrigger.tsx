import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'
import { Button } from './ui/button'
import { useSidebar } from './ui/sidebar'
import { Position } from '@xyflow/react'

type CustomSidebarTriggerProps = {
  // Whether the sidebar controlled by this trigger is right or left.
  siedebarPosition: Position.Right | Position.Left
}

export const CustomSidebarTrigger = ({
  siedebarPosition,
}: CustomSidebarTriggerProps) => {
  const { toggleSidebar, open } = useSidebar()

  const displayLeft =
    (siedebarPosition === Position.Right && !open) ||
    (siedebarPosition === Position.Left && open)

  return (
    <Button variant="secondary" size="icon" onClick={toggleSidebar}>
      {displayLeft && <ArrowLeftFromLine />}
      {!displayLeft && <ArrowRightFromLine />}
    </Button>
  )
}
