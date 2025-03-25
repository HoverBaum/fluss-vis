import React from 'react'
import { Button } from './ui/button'

type ButtonDangerProps = {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const ButtonDanger = ({
  children,
  className,
  ...props
}: ButtonDangerProps) => {
  return (
    <Button
      variant="secondary"
      {...props}
      className={`hover:bg-danger hover:text-danger-foreground ${className || ''}`}
    >
      {children}
    </Button>
  )
}
