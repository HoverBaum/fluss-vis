import { BaseIOTypes, EdgeTypeMap } from '@/components/nodes/TypePicker'

type EdgeTypeProps = {
  type: BaseIOTypes
}

export const EdgeType = ({ type }: EdgeTypeProps) => {
  const Icon = EdgeTypeMap[type].icon
  const label = EdgeTypeMap[type].label

  return (
    <span className="flex items-center">
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </span>
  )
}
