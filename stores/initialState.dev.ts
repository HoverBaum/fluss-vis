import { Position } from '@xyflow/react'
import { FlussState } from './flussStore'
import {
  Calculator,
  Languages,
  Signature,
  Slash,
  ToggleRight,
} from 'lucide-react'
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
        output: {
          typeId: 'number',
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
        output: {
          typeId: 'string',
          name: 'Written equation',
        },
        name: 'Create string',
        inputs: [
          {
            id: 'XyASV-B2xbU',
          },
          {
            id: 'XyASV-IxTuQ',
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
        output: {
          typeId: 'locale',
          name: 'Locale',
        },
        name: 'Start',
        inputs: [],
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
      source: 'start',
      sourceHandle: 'start-output',
      target: 'XyASV',
      targetHandle: 'XyASV-B2xbU',
      id: 'xy-edge__startstart-output-XyASVXyASV-B2xbU',
    },
    {
      source: 'TRqTC',
      sourceHandle: 'TRqTC-output',
      target: 'XyASV',
      targetHandle: 'XyASV-IxTuQ',
      id: 'xy-edge__TRqTCTRqTC-output-XyASVXyASV-IxTuQ',
    },
    {
      source: 'XyASV',
      sourceHandle: 'XyASV-output',
      target: 'end',
      targetHandle: 'end-EpoqZ',
      id: 'xy-edge__XyASVXyASV-output-endend-EpoqZ',
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
