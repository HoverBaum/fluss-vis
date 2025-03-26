import { IconName } from 'lucide-react/dynamic'
import JSONIcons from './generated/icons.json'

export type PossibleIconName = (typeof PossibleIcons)[number]['name']

export type PossibleIcon = {
  name: IconName
  label: string
}

export const PossibleIcons: PossibleIcon[] = JSONIcons as PossibleIcon[]
