import { Position } from '@xyflow/react'
import { FlussState } from '../flussStore'
import { outputTypesBasics } from '../outputTypesBaics'

export const squareNumberExampleState: FlussState = {
  name: 'Squared number 🧮',
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
            state: 'entered',
          },
        ],
        description: 'Takes a number and returns that number squared.',
        state: 'entered',
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
            state: 'entered',
          },
          {
            id: 'XyASV-TNZj8',
            state: 'entered',
          },
        ],
        description:
          "Turns a number and it's squared result into a locale specific string.",
        state: 'entered',
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
        state: 'entered',
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
            state: 'entered',
          },
        ],
        outputs: [],
        state: 'entered',
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
      data: {
        state: 'entered',
      },
    },
    {
      source: 'XyASV',
      sourceHandle: 'VQJps',
      target: 'end',
      targetHandle: 'end-IMC3S',
      id: 'xy-edge__XyASVVQJps-endend-IMC3S',
      data: {
        state: 'entered',
      },
    },
    {
      source: 'TRqTC',
      sourceHandle: 'Ki3pb',
      target: 'XyASV',
      targetHandle: 'XyASV-TNZj8',
      id: 'xy-edge__TRqTCKi3pb-XyASVXyASV-TNZj8',
      data: {
        state: 'entered',
      },
    },
    {
      source: 'start',
      sourceHandle: 'nZEBo',
      target: 'TRqTC',
      targetHandle: 'TRqTC-wzsOw',
      id: 'xy-edge__startnZEBo-TRqTCTRqTC-wzsOw',
      data: {
        state: 'entered',
      },
    },
  ],
  outputTypes: [
    ...outputTypesBasics,
    {
      id: 'locale',
      displayName: 'Locale',
      typeName: 'Locale',
      content: '"en" | "de"',
      icon: 'languages',
    },
  ],
  uiState: {
    isEditSidebarOpen: false,
    isTypeDialogOpen: false,
    isShowingGreeting: false,
  },
  hasHydrated: true,
}
