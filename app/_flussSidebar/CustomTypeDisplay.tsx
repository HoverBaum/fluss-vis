import { CodeDisplay } from '@/components/CodeDisplay'
import { FlussStepOutputType } from '@/fluss-lib/fluss'
import { DynamicIcon } from 'lucide-react/dynamic'

type CustomTypeDisplayProps = {
  type: FlussStepOutputType
}

export const CustomTypeDisplay = ({ type }: CustomTypeDisplayProps) => {
  return (
    <div>
      <h3 className="text-lg mb-2 font-semibold flex gap-2 items-center">
        <DynamicIcon name={type.icon} size="1em" />
        {type.displayName}
      </h3>

      <div className="border w-full">
        <CodeDisplay>{`type ${type.typeName} = ${type.content}`}</CodeDisplay>
      </div>
    </div>
  )
}
