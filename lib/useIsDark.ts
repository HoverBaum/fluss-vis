import { useTheme } from 'next-themes'

export const useIsDark = () => {
  const { theme, systemTheme } = useTheme()
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  return isDark
}
