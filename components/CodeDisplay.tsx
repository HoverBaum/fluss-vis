import hljs from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'
import { useHljsStyles } from './useHljsStyles'

hljs.registerLanguage('typescript', typescript)

type CodeDisplayProps = {
  children: string
}

export const CodeDisplay = ({ children }: CodeDisplayProps) => {
  useHljsStyles()
  const highlightedCode = hljs.highlight(children, {
    language: 'typescript',
  })

  return (
    <div
      className="w-full hljs p-2 whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: highlightedCode.value }}
    ></div>
  )
}
