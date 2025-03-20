import { FlussStepOutputType } from '@/fluss-lib/fluss'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useTheme } from 'next-themes'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('typescript', ts)

type CustomTypeDisplayProps = {
  type: FlussStepOutputType
}

export const CustomTypeDisplay = ({ type }: CustomTypeDisplayProps) => {
  const { theme, systemTheme } = useTheme()
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <h3 className="text-lg mb-2 font-semibold flex gap-2 items-center">
          <DynamicIcon name={type.icon} size="1rem" />
          {type.displayName}
        </h3>

        <div className="border">
          <SyntaxHighlighter
            wrapLongLines
            language="typescript"
            style={isDark ? a11yDark : a11yLight}
          >
            {`type ${type.typeName} = ${type.content}`}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}
