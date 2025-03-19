import { Position } from '@xyflow/react'
import { FlussState } from './flussStore'

export const devInitialState: FlussState = {
  name: 'Dev Fluss 🌊',
  nodes: [
    {
      id: 'TRqTC',
      position: {
        x: 394,
        y: 199,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'TRqTC',
        outputs: [
          {
            id: 'Ki3pb',
            type: 'number',
            name: 'Squared number',
          },
        ],
        name: 'Square number',
        inputs: [
          {
            id: 'TRqTC-wzsOw',
          },
        ],
        description: 'Takes a number and returns that number squared.',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 321,
      },
    },
    {
      id: 'XyASV',
      position: {
        x: 747,
        y: 251,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'XyASV',
        outputs: [
          {
            id: 'VQJps',
            type: 'string',
            name: 'Written equation',
          },
        ],
        name: 'Create string',
        inputs: [
          {
            id: 'XyASV-XNqwk',
          },
          {
            id: 'XyASV-TNZj8',
          },
        ],
        description:
          "Turns a number and it's squared result into a locale specific string.",
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 353,
      },
    },
    {
      id: 'start',
      position: {
        x: 82,
        y: 158,
      },
      type: 'startNode',
      data: {
        type: 'start',
        id: 'start',
        outputs: [
          {
            id: 'qs56w',
            type: 'locale',
            name: 'Locale',
          },
          {
            id: 'nZEBo',
            name: 'Base number',
            type: 'number',
          },
        ],
        name: 'Start 🛫',
        description: 'Start of the Fluss.',
      },
      sourcePosition: Position.Right,
      deletable: false,
      measured: {
        width: 250,
        height: 404,
      },
      selected: false,
    },
    {
      id: 'end',
      position: {
        x: 1124,
        y: 368,
      },
      type: 'endNode',
      data: {
        type: 'end',
        id: 'end',
        name: 'End 🛬',
        description: 'End of the Fluss',
        inputs: [
          {
            id: 'end-IMC3S',
          },
        ],
        outputs: [],
      },
      sourcePosition: Position.Right,
      deletable: false,
      measured: {
        width: 275,
        height: 152,
      },
    },
  ],
  edges: [
    {
      source: 'start',
      sourceHandle: 'qs56w',
      target: 'XyASV',
      targetHandle: 'XyASV-XNqwk',
      id: 'xy-edge__startqs56w-XyASVXyASV-XNqwk',
    },
    {
      source: 'XyASV',
      sourceHandle: 'VQJps',
      target: 'end',
      targetHandle: 'end-IMC3S',
      id: 'xy-edge__XyASVVQJps-endend-IMC3S',
    },
    {
      source: 'TRqTC',
      sourceHandle: 'Ki3pb',
      target: 'XyASV',
      targetHandle: 'XyASV-TNZj8',
      id: 'xy-edge__TRqTCKi3pb-XyASVXyASV-TNZj8',
    },
    {
      source: 'start',
      sourceHandle: 'nZEBo',
      target: 'TRqTC',
      targetHandle: 'TRqTC-wzsOw',
      id: 'xy-edge__startnZEBo-TRqTCTRqTC-wzsOw',
    },
  ],
  outputTypes: [
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
    {
      id: 'locale',
      displayName: 'Locale',
      typeName: 'Locale',
      content: '"en" | "de"',
      icon: 'languages',
    },
  ],
}
