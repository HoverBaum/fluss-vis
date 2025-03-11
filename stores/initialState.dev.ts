import { Position } from '@xyflow/react'
import { FlussState } from './flussStore'
import { END_NODE_ID, START_NODE_ID } from './storeHelpers'

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
        output: {
          id: 'Ki3pb',
          type: 'number',
          name: 'Squared number',
        },
        name: 'Square number',
        inputs: [],
        description: 'Takes a number and returns that number squared.',
      },
      sourcePosition: Position.Right,
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
        output: {
          id: 'VQJps',
          type: 'string',
          name: 'Written equation',
        },
        name: 'Create string',
        inputs: [
          {
            id: 'XyASV-XNqwk',
          },
          {
            id: 'XyASV-0-b8k',
          },
        ],
        description:
          "Turns a number and it's squared result into a locale specific string.",
      },
      sourcePosition: Position.Right,
    },
    {
      id: START_NODE_ID,
      position: {
        x: 82,
        y: 158,
      },
      type: 'startNode',
      data: {
        type: 'start',
        id: START_NODE_ID,
        outputs: [
          {
            id: 'qs56w',
            type: 'locale',
            name: 'Locale',
          },
        ],
        name: 'Start 🛫',
        description: 'Start of the Fluss.',
      },
      sourcePosition: Position.Right,
      deletable: false,
    },
    {
      id: END_NODE_ID,
      position: {
        x: 1124,
        y: 368,
      },
      type: 'endNode',
      data: {
        type: 'end',
        id: END_NODE_ID,
        name: 'End 🛬',
        description: 'End of the Fluss',
        inputs: [
          {
            id: 'end-EpoqZ',
          },
        ],
      },
      sourcePosition: Position.Right,
      deletable: false,
    },
  ],
  edges: [
    {
      source: 'XyASV',
      sourceHandle: 'XyASV-output',
      target: 'end',
      targetHandle: 'end-EpoqZ',
      id: 'xy-edge__XyASVXyASV-output-endend-EpoqZ',
    },
    {
      source: 'start',
      sourceHandle: 'qs56w',
      target: 'XyASV',
      targetHandle: 'XyASV-XNqwk',
      id: 'xy-edge__startqs56w-XyASVXyASV-XNqwk',
    },
    {
      source: 'TRqTC',
      sourceHandle: 'TRqTC-output',
      target: 'XyASV',
      targetHandle: 'XyASV-0-b8k',
      id: 'xy-edge__TRqTCTRqTC-output-XyASVXyASV-0-b8k',
    },
  ],
  outputTypes: [
    {
      id: 'void',
      name: 'Void',
      content: 'void',
      isPrimitive: true,
      icon: 'slash',
    },
    {
      id: 'string',
      name: 'String',
      content: 'string',
      isPrimitive: true,
      icon: 'signature',
    },
    {
      id: 'number',
      name: 'Number',
      content: 'number',
      isPrimitive: true,
      icon: 'calculator',
    },
    {
      id: 'boolean',
      name: 'Boolean',
      content: 'boolean',
      isPrimitive: true,
      icon: 'toggle-right',
    },
    {
      id: 'locale',
      name: 'Locale',
      content: '"en" | "de"',
      icon: 'languages',
    },
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
}
