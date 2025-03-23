import Editor from 'react-simple-code-editor'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { CustomTypeDisplay } from './CustomTypeDisplay'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import hljs from 'highlight.js'
import typescript from 'highlight.js/lib/languages/typescript'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { SaveIcon, Trash2Icon } from 'lucide-react'
import parserTypeScript from 'prettier/parser-typescript'
import prettierPluginEstree from 'prettier/plugins/estree'
import prettier from 'prettier/standalone'
import { useTheme } from 'next-themes'
import { githubdarkDimmed } from '@/components/code-styles/githubg-dark-dimmed'
import { githubLight } from '@/components/code-styles/github-light'
import { IconSelect } from './IconSelect'
import { Separator } from '@/components/ui/separator'

type CustomTypeEditorProps = {
  typeId: string
}

hljs.registerLanguage('typescript', typescript)

export const CustomTypeEditor = ({ typeId }: CustomTypeEditorProps) => {
  const deleteOutputType = useFlussStore((store) => store.outputTypeRemove)
  const { theme, systemTheme } = useTheme()
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  const type = useFlussStore((store) =>
    store.outputTypes.find((type) => type.id === typeId)
  )
  const codePrefix = useMemo(
    () => `type ${type?.typeName} = `,
    [type?.typeName]
  )
  const outputTypeUpdate = useFlussStore((store) => store.outputTypeUpdate)
  const [editingCode, setEditingCode] = useState(codePrefix + type?.content)
  const hasUnsafedChanges = useMemo(
    () => editingCode.replace(codePrefix, '') !== type?.content,
    [codePrefix, editingCode, type?.content]
  )

  useEffect(() => {
    setEditingCode(codePrefix + type?.content)
  }, [type?.content, codePrefix])

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
      <div className="mt-4 p-4 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="grid w-full items-center gap-0.5">
            <Label htmlFor="displayName" className="font-semibold">
              Icon
            </Label>
            <small>
              Visually represent this type. Powered by{' '}
              <a className="underline" href="https://lucide.dev/icons/">
                Lucide
              </a>
            </small>
            <div className="mt-2">
              <IconSelect
                icon={type.icon}
                onSelect={(icon) => outputTypeUpdate(typeId, { icon })}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-0.5">
            <Label htmlFor="displayName" className="font-semibold">
              Display Name
            </Label>
            <small>Name used in the UI of Fluss-Vis.</small>
            <Input
              id="displayName"
              value={type.displayName}
              onChange={(e) =>
                outputTypeUpdate(typeId, { displayName: e.target.value })
              }
              className="mt-2"
            />
          </div>
        </div>

        <Separator />

        <div className="grid w-full items-center gap-0.5">
          <Label htmlFor="typeName" className="font-semibold">
            Type Name
          </Label>
          <small>
            The name used in generated code - you will use this in your code.
          </small>
          <Input
            id="typeName"
            value={type.typeName}
            onChange={(e) =>
              outputTypeUpdate(typeId, { typeName: e.target.value })
            }
            className="mt-2"
          />
        </div>

        <div className="grid w-full items-center gap-0.5">
          <Label htmlFor="content" className="font-semibold">
            Content{' '}
            {hasUnsafedChanges && (
              <small className="text-destructive">Unsafed changes</small>
            )}
          </Label>
          <small>
            Definition of this type. Do not edit anything before the
            &quot;=&quot;.
          </small>
          <div className="editor-container">
            <Editor
              id="content"
              className="border hljs mt-2"
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

        <Separator />

        <Button
          variant="secondary"
          onClick={() => deleteOutputType(typeId)}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2Icon /> Delete &quot;{type.displayName}&quot;
        </Button>
      </div>
    </div>
  )
}
