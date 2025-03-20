import { useFlussStore } from '@/stores/FlussStoreProvider'
import { CustomTypeDisplay } from './CustomTypeDisplay'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type CustomTypeEditorProps = {
  typeId: string
}

export const CustomTypeEditor = ({ typeId }: CustomTypeEditorProps) => {
  const type = useFlussStore((store) =>
    store.outputTypes.find((type) => type.id === typeId)
  )
  const outputTypeUpdate = useFlussStore((store) => store.outputTypeUpdate)

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
          <Label htmlFor="displayName">Type Name</Label>
          <Input
            id="displayName"
            value={type.typeName}
            onChange={(e) =>
              outputTypeUpdate(typeId, { typeName: e.target.value })
            }
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="displayName">Content</Label>
          <Textarea
            id="displayName"
            value={type.content}
            onChange={(e) =>
              outputTypeUpdate(typeId, { content: e.target.value })
            }
            rows={5}
          />
        </div>
      </div>
    </div>
  )
}
