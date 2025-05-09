import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'

type ButtonXProps = {
  onClick: () => void
  isInvisible: boolean
  disabled?: boolean
}

export const ButtonRemove = ({
  onClick,
  isInvisible,
  disabled,
}: ButtonXProps) => {
  return (
    <Button
      disabled={disabled}
      className={`h-8 w-8 ${isInvisible ? 'opacity-0!' : ''} hover:bg-danger! hover:text-danger-foreground!`}
      variant="ghost"
      onClick={onClick}
    >
      <Trash2 size={8} />
    </Button>
  )
}
