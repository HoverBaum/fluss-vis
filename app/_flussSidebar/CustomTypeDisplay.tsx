import { CodeDisplay } from '@/components/CodeDisplay'
import { FlussStepOutputType } from '@/fluss-lib/fluss'
import { DynamicIcon } from 'lucide-react/dynamic'

type CustomTypeDisplayProps = {
  type: FlussStepOutputType
}

export const CustomTypeDisplay = ({ type }: CustomTypeDisplayProps) => {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <DynamicIcon name={type.icon} size="1em" />
        {type.displayName}
      </h3>

      <div className="w-full border">
        <CodeDisplay>{`type ${type.typeName} = ${type.content}`}</CodeDisplay>
      </div>
    </div>
  )
}
