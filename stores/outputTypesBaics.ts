import { FlussStepOutputType } from '@/fluss-lib/fluss'

/**
 * These are the basic outputTypes that every Fluss should have.
 */
export const outputTypesBasics: FlussStepOutputType[] = [
  {
    id: 'void',
    displayName: 'Void',
    typeName: 'void',
    content: 'void',
    isPrimitive: true,
    icon: 'slash',
  },
  {
    id: 'string',
    displayName: 'String',
    typeName: 'string',
    content: 'string',
    isPrimitive: true,
    icon: 'signature',
  },
  {
    id: 'number',
    displayName: 'Number',
    typeName: 'number',
    content: 'number',
    isPrimitive: true,
    icon: 'calculator',
  },
  {
    id: 'boolean',
    displayName: 'Boolean',
    typeName: 'boolean',
    content: 'boolean',
    isPrimitive: true,
    icon: 'toggle-right',
  },
]
