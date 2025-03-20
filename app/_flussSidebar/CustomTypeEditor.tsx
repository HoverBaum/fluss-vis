import Editor from 'react-simple-code-editor'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { CustomTypeDisplay } from './CustomTypeDisplay'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import hljs from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import parserTypeScript from 'prettier/parser-typescript'
import prettierPluginEstree from 'prettier/plugins/estree'
import prettier from 'prettier/standalone'
import { useTheme } from 'next-themes'
import { githubdarkDimmed } from '@/components/code-styles/githubg-dark-dimmed'
import { githubLight } from '@/components/code-styles/github-light'

type CustomTypeEditorProps = {
  typeId: string
}

hljs.registerLanguage('typescript', typescript)

export const CustomTypeEditor = ({ typeId }: CustomTypeEditorProps) => {
  const { theme, systemTheme } = useTheme()
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  const type = useFlussStore((store) =>
    store.outputTypes.find((type) => type.id === typeId)
  )
  const codePrefix = `type ${type?.typeName} = `
  const outputTypeUpdate = useFlussStore((store) => store.outputTypeUpdate)
  const [editingCode, setEditingCode] = useState(codePrefix + type?.content)
  const hasUnsafedChanges =
    editingCode.replace(codePrefix, '') !== type?.content

  const editorTheme = useMemo(
    () => (isDark ? githubdarkDimmed : githubLight),
    [isDark]
  )

  // Update the CSS we need to style the code editor.
  useEffect(() => {
    // Check if the style tag already exists
    let style: HTMLElement
    const existingStyle = document.getElementById('syntax-highlighting-styles')
    if (!existingStyle) {
      style = document.createElement('style')
      style.id = 'syntax-highlighting-styles'
      document.head.appendChild(style)
    } else {
      style = existingStyle
    }

    style.textContent = editorTheme
  }, [editorTheme])

  if (!type) {
    return null
  }

  return (
    <div>
      <CustomTypeDisplay type={type} />
      <div className="mt-4 p-4 flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={type.displayName}
            onChange={(e) =>
              outputTypeUpdate(typeId, { displayName: e.target.value })
            }
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="typeName">Type Name</Label>
          <Input
            id="typeName"
            value={type.typeName}
            onChange={(e) =>
              outputTypeUpdate(typeId, { typeName: e.target.value })
            }
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="content">
            Content{' '}
            {hasUnsafedChanges && (
              <small className="text-destructive">Unsafed changes</small>
            )}
          </Label>
          <div className="editor-container">
            <Editor
              id="content"
              className="border hljs"
              value={editingCode}
              onValueChange={setEditingCode}
              highlight={(code) =>
                hljs.highlight(code, { language: 'typescript' }).value
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          </div>
          <div className="mt-2 flex flex-row gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                const formattedCode = await prettier.format(editingCode, {
                  parser: 'typescript',
                  plugins: [parserTypeScript, prettierPluginEstree],
                  semi: false,
                })
                // Prettier is opnionated about adding a new line at the End.
                // In thsi context we do not apprechiate this!
                setEditingCode(formattedCode.replace(/[\r\n]+$/, ''))
              }}
            >
              Format
            </Button>
            <Button
              variant="secondary"
              disabled={!hasUnsafedChanges}
              className="w-full"
              onClick={() => {
                if (!editingCode.startsWith(codePrefix)) {
                  return
                }
                outputTypeUpdate(typeId, {
                  content: editingCode.replace(codePrefix, ''),
                })
              }}
            >
              <SaveIcon size="1em" /> Save Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
