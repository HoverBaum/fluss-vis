'use client'

import { LaptopIcon, MoonIcon, SmartphoneIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMemo } from 'react'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  console.log(theme)

  // Define the Icon to be used for system based on the users system.
  const SystemIcon = useMemo(() => {
    const userAgent = navigator.userAgent
    // Basic check for mobile devices
    if (
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      )
    ) {
      return SmartphoneIcon
    } else {
      return LaptopIcon
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === 'light' && <SunIcon className="h-[1.2rem] w-[1.2rem]" />}
          {theme === 'dark' && <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
          {theme === 'system' && (
            <SystemIcon className="h-[1.2rem] w-[1.2rem]" />
          )}

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <SunIcon /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <MoonIcon /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <SystemIcon /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
