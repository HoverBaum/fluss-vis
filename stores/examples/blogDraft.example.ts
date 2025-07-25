import { Position } from '@xyflow/react'
import { FlussState } from '../flussStore'
import { outputTypesBasics } from '../outputTypesBaics'

export const BlogDraftExampleState: FlussState = {
  name: 'Blogpost Draft ✏️',
  nodes: [
    {
      id: 'start',
      position: {
        x: 59,
        y: 253,
      },
      type: 'startNode',
      data: {
        type: 'start',
        id: 'start',
        outputs: [
          {
            id: 'QvuWYaXYQN66PEdg6mrKU',
            name: 'Blogpost Topic',
            type: 'string',
          },
        ],
        name: 'Start 🦛',
        description: 'Start node of the Fluss.',
        state: 'entered',
      },
      measured: {
        width: 275,
        height: 268,
      },
      selected: false,
      dragging: false,
      sourcePosition: Position.Right,
      deletable: false,
    },
    {
      id: 'end',
      position: {
        x: 1164,
        y: 350,
      },
      type: 'endNode',
      data: {
        type: 'end',
        id: 'end',
        inputs: [
          {
            id: 'mV955aU9A42_6WgL7xuro',
            state: 'entered',
          },
          {
            id: 'lPbbtJhrmrQTYIGMCzED2',
            state: 'entered',
          },
        ],
        name: 'End 🏁',
        description: 'End node of the Fluss.',
        state: 'entered',
        outputs: [],
      },
      measured: {
        width: 275,
        height: 200,
      },
      selected: false,
      dragging: false,
      sourcePosition: Position.Right,
      deletable: false,
    },
    {
      id: 'kNcea',
      position: {
        x: 431,
        y: 156,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'kNcea',
        description:
          'Search the internet for relevant information on the topic.',
        name: 'Research Topic',
        inputs: [
          {
            id: '_QJ1jQRdqhLz9PDBJFS8H',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'DQVZiVd6LzxOA_Gyc3ioP',
            name: 'Research Result',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      measured: {
        width: 275,
        height: 333,
      },
      selected: false,
      dragging: false,
      sourcePosition: Position.Right,
    },
    {
      id: 'MdExu',
      position: {
        x: 801,
        y: 159,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'MdExu',
        description:
          'Write a draft based on users prompt and research conducted.',
        name: 'Create Draft',
        inputs: [
          {
            id: 'w3HV60f1YJSYjzTNDgcjm',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'iVPK8h9FhZBveKxRgKE47',
            name: 'Draft',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      measured: {
        width: 275,
        height: 349,
      },
      selected: false,
      dragging: false,
      sourcePosition: Position.Right,
    },
    {
      id: 'lBEfW',
      position: {
        x: 614,
        y: 552,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'lBEfW',
        description:
          'Create an image that can go along with the blogpost idea.',
        name: 'Create Visual 🎨',
        inputs: [
          {
            id: 'UXZTs5OMhHVkKUH2mOvl2',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'MmaCBDZiBcvIrKci_J4Sm',
            name: 'Header Visual',
            type: 'urEZwhzf422tCpHOVn-vm',
          },
        ],
        state: 'entered',
      },
      measured: {
        width: 275,
        height: 333,
      },
      selected: false,
      dragging: false,
      sourcePosition: Position.Right,
    },
  ],
  edges: [
    {
      source: 'start',
      sourceHandle: 'QvuWYaXYQN66PEdg6mrKU',
      target: 'kNcea',
      targetHandle: '_QJ1jQRdqhLz9PDBJFS8H',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startQvuWYaXYQN66PEdg6mrKU-kNcea_QJ1jQRdqhLz9PDBJFS8H',
    },
    {
      source: 'kNcea',
      sourceHandle: 'DQVZiVd6LzxOA_Gyc3ioP',
      target: 'MdExu',
      targetHandle: 'w3HV60f1YJSYjzTNDgcjm',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__kNceaDQVZiVd6LzxOA_Gyc3ioP-MdExuw3HV60f1YJSYjzTNDgcjm',
    },
    {
      source: 'MdExu',
      sourceHandle: 'iVPK8h9FhZBveKxRgKE47',
      target: 'end',
      targetHandle: 'mV955aU9A42_6WgL7xuro',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__MdExuiVPK8h9FhZBveKxRgKE47-endmV955aU9A42_6WgL7xuro',
    },
    {
      source: 'lBEfW',
      sourceHandle: 'MmaCBDZiBcvIrKci_J4Sm',
      target: 'end',
      targetHandle: 'lPbbtJhrmrQTYIGMCzED2',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__lBEfWMmaCBDZiBcvIrKci_J4Sm-endlPbbtJhrmrQTYIGMCzED2',
    },
    {
      source: 'start',
      sourceHandle: 'QvuWYaXYQN66PEdg6mrKU',
      target: 'lBEfW',
      targetHandle: 'UXZTs5OMhHVkKUH2mOvl2',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startQvuWYaXYQN66PEdg6mrKU-lBEfWUXZTs5OMhHVkKUH2mOvl2',
    },
  ],
  outputTypes: [
    ...outputTypesBasics,
    {
      id: 'urEZwhzf422tCpHOVn-vm',
      typeName: 'Visual',
      displayName: 'Visual',
      content: '{\n  imageUrl: string\n  altText: string\n}',
      icon: 'image',
    },
  ],
  uiState: {
    isEditSidebarOpen: false,
    isTypeDialogOpen: false,
  },
  hasHydrated: true,
}
