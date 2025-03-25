'use client'

import { useEffect, useMemo } from 'react'
import { githubLight } from '@/components/code-styles/github-light'
import { useIsDark } from '@/lib/useIsDark'
import { githubDark } from './code-styles/github-dark'

const HLJS_STYLE_ID = 'syntaxHighlightingStyles'

/**
 * Injects a style tag into the head of the document to style hljs parsed code.
 * Detects the current theme and updates the style accordingly.
 */
export const useHljsStyles = () => {
  const isDark = useIsDark()
  const editorTheme = useMemo(
    () => (isDark ? githubDark : githubLight),
    [isDark]
  )

  // Update the CSS we need to style the code editor.
  useEffect(() => {
    // Check if the style tag already exists
    let style: HTMLElement
    const existingStyle = document.getElementById(HLJS_STYLE_ID)
    if (!existingStyle) {
      style = document.createElement('style')
      style.id = HLJS_STYLE_ID
      document.head.appendChild(style)
    } else {
      style = existingStyle
    }

    style.textContent = editorTheme
  }, [editorTheme])
}
