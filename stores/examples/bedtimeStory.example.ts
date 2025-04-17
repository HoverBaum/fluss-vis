import { Position } from '@xyflow/react'
import { FlussState } from '../flussStore'

export const bedtimeStoryExampleState: FlussState = {
  name: 'Bedtime Story 📖',
  nodes: [
    {
      id: 'start',
      position: {
        x: 11.215178766236704,
        y: 348.08227681493554,
      },
      type: 'startNode',
      deletable: false,
      data: {
        type: 'start',
        id: 'start',
        outputs: [
          {
            id: 'jK-3EQR7jjGqNSn4tCYE9',
            name: 'Story Prompt',
            type: 'string',
          },
        ],
        name: 'Start 📖',
        description: 'Start node of the Fluss.',
        state: 'entered',
      },
      measured: {
        width: 275,
        height: 268,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'end',
      position: {
        x: 3362.9698943865797,
        y: 421.9883495177088,
      },
      type: 'endNode',
      deletable: false,
      data: {
        type: 'end',
        id: 'end',
        inputs: [
          {
            id: 'i7O4ANDKKlrnKGp92kvsp',
            state: 'entered',
          },
          {
            id: 'M9lWlCCumWqzDnctFaMKU',
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
    },
    {
      id: 'ePzfp',
      position: {
        x: 508.86076500133584,
        y: -143.2444350892913,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'ePzfp',
        description: 'Write a draft for the story.',
        name: 'Write Draft 1',
        inputs: [
          {
            id: 'eDjCTp4CwS-4Wrz0iMUbP',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'HCUW_LCmoonUIWJ94Sf5x',
            name: 'Draft 1',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 313,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'R5L4M',
      position: {
        x: 510.6582644558731,
        y: 288.98117724082834,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'R5L4M',
        description: 'Write a draft for the story.',
        name: 'Write Draft 2',
        inputs: [
          {
            id: 'Zr9YASu31fydamXuE27yU',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'MdcR4sAs2YzePrKUhWq7o',
            name: 'Draft 2',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 313,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'F5UOD',
      position: {
        x: 516.7405412708085,
        y: 731.2975185330662,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'F5UOD',
        description: 'Write a draft for the story.',
        name: 'Write Draft 3',
        inputs: [
          {
            id: 'v9ZLSLhOhH6eGtOcCC20P',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'eCMG6wEmVFheBVdmuEa7Z',
            name: 'Draft 3',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 313,
      },
      selected: false,
      dragging: false,
    },
    {
      id: '9jgY_',
      position: {
        x: 1025.452484671804,
        y: 282.1648798219554,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: '9jgY_',
        description: '',
        name: 'Pick Draft',
        inputs: [
          {
            id: 'yId39wATHRRrZ52I73Kcx',
            state: 'entered',
          },
          {
            id: 'VbuE3ATj--n14dIAwcmrs',
            state: 'entered',
          },
          {
            id: 'MnFiayrPP0SBjP-yTAiMr',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'e1ebYgMWWIsmwsBg--9jv',
            name: 'Draft',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 393,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'k3uFb',
      position: {
        x: 1514.3574164395745,
        y: 322.5278307778388,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'k3uFb',
        description: '',
        name: 'Write Story',
        inputs: [
          {
            id: 'vWBdB_GsWRaKQNUo2cgpY',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'dU7LDMy-NjAvp4n6nE81z',
            name: 'Story',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 313,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'X4i7h',
      position: {
        x: 2109.3574164395745,
        y: -83.4721692221612,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'X4i7h',
        description: 'Feedback from an editor, focussed on style, grammar',
        name: 'Editor Feedback',
        inputs: [
          {
            id: 'mPaFyPO9dksTiX8hb-ug9',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'oTfLg2xRMAnHFp9iErgi9',
            name: 'Editor feedback',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 333,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'eME5H',
      position: {
        x: 2111.839354334263,
        y: 339.2868618304944,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'eME5H',
        description: 'Feedback for story from a parent.',
        name: 'Parent Feedback',
        inputs: [
          {
            id: 'p-qsNDYcUvqw2O8qwixPc',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'lacVTFSiDwaHRYHm8Pa_e',
            name: 'Parent Feedback',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 313,
      },
      selected: false,
      dragging: false,
    },
    {
      id: '_FjSh',
      position: {
        x: 2115.750766303839,
        y: 725.9507660816267,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: '_FjSh',
        description: 'Feedback from a kid.',
        name: 'Kid Feedback',
        inputs: [
          {
            id: 'nAotR1B7vZHo9DgC2YLby',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'jxm130NHtu3vh8HWfN9VP',
            name: 'Kid Feedback',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 313,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'EiQ4e',
      position: {
        x: 2649.271328168467,
        y: 319.7486151520927,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'EiQ4e',
        description: 'Takes Feedback and improves story based on it.',
        name: 'Improve Story',
        inputs: [
          {
            id: 'CjpobA5tdYYtBlikq5hsq',
            state: 'entered',
          },
          {
            id: 'hGcigGI47RgVQfzikAzvJ',
            state: 'entered',
          },
          {
            id: 'tSf7zIYzZJdCZz222y3S7',
            state: 'entered',
          },
          {
            id: 'zEuexK34pXPDJTxai3sKj',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'rZK483wgeiMPczMqa0AzN',
            name: 'Story',
            type: 'dLydlfUn0DEYbOtKeobUY',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 501,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'askHk',
      position: {
        x: 1947.6873094771227,
        y: 1497.3676050600272,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'askHk',
        description: 'Create an image to represent the story.',
        name: 'Create Visual',
        inputs: [
          {
            id: 'rfeNbaPinzKxmbUBPuLpw',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'CBjLQBXiXXBphpvlijJ_i',
            name: 'image URL',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 333,
      },
      selected: false,
      dragging: false,
    },
  ],
  edges: [
    {
      source: 'start',
      sourceHandle: 'jK-3EQR7jjGqNSn4tCYE9',
      target: 'ePzfp',
      targetHandle: 'eDjCTp4CwS-4Wrz0iMUbP',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startjK-3EQR7jjGqNSn4tCYE9-ePzfpeDjCTp4CwS-4Wrz0iMUbP',
    },
    {
      source: 'start',
      sourceHandle: 'jK-3EQR7jjGqNSn4tCYE9',
      target: 'R5L4M',
      targetHandle: 'Zr9YASu31fydamXuE27yU',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startjK-3EQR7jjGqNSn4tCYE9-R5L4MZr9YASu31fydamXuE27yU',
    },
    {
      source: 'start',
      sourceHandle: 'jK-3EQR7jjGqNSn4tCYE9',
      target: 'F5UOD',
      targetHandle: 'v9ZLSLhOhH6eGtOcCC20P',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startjK-3EQR7jjGqNSn4tCYE9-F5UODv9ZLSLhOhH6eGtOcCC20P',
    },
    {
      source: 'ePzfp',
      sourceHandle: 'HCUW_LCmoonUIWJ94Sf5x',
      target: '9jgY_',
      targetHandle: 'yId39wATHRRrZ52I73Kcx',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__ePzfpHCUW_LCmoonUIWJ94Sf5x-9jgY_yId39wATHRRrZ52I73Kcx',
    },
    {
      source: 'R5L4M',
      sourceHandle: 'MdcR4sAs2YzePrKUhWq7o',
      target: '9jgY_',
      targetHandle: 'VbuE3ATj--n14dIAwcmrs',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__R5L4MMdcR4sAs2YzePrKUhWq7o-9jgY_VbuE3ATj--n14dIAwcmrs',
    },
    {
      source: 'F5UOD',
      sourceHandle: 'eCMG6wEmVFheBVdmuEa7Z',
      target: '9jgY_',
      targetHandle: 'MnFiayrPP0SBjP-yTAiMr',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__F5UODeCMG6wEmVFheBVdmuEa7Z-9jgY_MnFiayrPP0SBjP-yTAiMr',
    },
    {
      source: '9jgY_',
      sourceHandle: 'e1ebYgMWWIsmwsBg--9jv',
      target: 'k3uFb',
      targetHandle: 'vWBdB_GsWRaKQNUo2cgpY',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__9jgY_e1ebYgMWWIsmwsBg--9jv-k3uFbvWBdB_GsWRaKQNUo2cgpY',
    },
    {
      source: 'k3uFb',
      sourceHandle: 'dU7LDMy-NjAvp4n6nE81z',
      target: 'X4i7h',
      targetHandle: 'mPaFyPO9dksTiX8hb-ug9',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__k3uFbdU7LDMy-NjAvp4n6nE81z-X4i7hmPaFyPO9dksTiX8hb-ug9',
    },
    {
      source: 'k3uFb',
      sourceHandle: 'dU7LDMy-NjAvp4n6nE81z',
      target: 'eME5H',
      targetHandle: 'p-qsNDYcUvqw2O8qwixPc',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__k3uFbdU7LDMy-NjAvp4n6nE81z-eME5Hp-qsNDYcUvqw2O8qwixPc',
    },
    {
      source: 'k3uFb',
      sourceHandle: 'dU7LDMy-NjAvp4n6nE81z',
      target: '_FjSh',
      targetHandle: 'nAotR1B7vZHo9DgC2YLby',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__k3uFbdU7LDMy-NjAvp4n6nE81z-_FjShnAotR1B7vZHo9DgC2YLby',
    },
    {
      source: 'X4i7h',
      sourceHandle: 'oTfLg2xRMAnHFp9iErgi9',
      target: 'EiQ4e',
      targetHandle: 'CjpobA5tdYYtBlikq5hsq',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__X4i7hoTfLg2xRMAnHFp9iErgi9-EiQ4eCjpobA5tdYYtBlikq5hsq',
    },
    {
      source: 'eME5H',
      sourceHandle: 'lacVTFSiDwaHRYHm8Pa_e',
      target: 'EiQ4e',
      targetHandle: 'hGcigGI47RgVQfzikAzvJ',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__eME5HlacVTFSiDwaHRYHm8Pa_e-EiQ4ehGcigGI47RgVQfzikAzvJ',
    },
    {
      source: '_FjSh',
      sourceHandle: 'jxm130NHtu3vh8HWfN9VP',
      target: 'EiQ4e',
      targetHandle: 'tSf7zIYzZJdCZz222y3S7',
      data: {
        state: 'entered',
      },
      id: 'xy-edge___FjShjxm130NHtu3vh8HWfN9VP-EiQ4etSf7zIYzZJdCZz222y3S7',
    },
    {
      source: 'EiQ4e',
      sourceHandle: 'rZK483wgeiMPczMqa0AzN',
      target: 'end',
      targetHandle: 'i7O4ANDKKlrnKGp92kvsp',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__EiQ4erZK483wgeiMPczMqa0AzN-endi7O4ANDKKlrnKGp92kvsp',
      selected: false,
    },
    {
      source: '9jgY_',
      sourceHandle: 'e1ebYgMWWIsmwsBg--9jv',
      target: 'askHk',
      targetHandle: 'rfeNbaPinzKxmbUBPuLpw',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__9jgY_e1ebYgMWWIsmwsBg--9jv-askHkrfeNbaPinzKxmbUBPuLpw',
    },
    {
      source: 'askHk',
      sourceHandle: 'CBjLQBXiXXBphpvlijJ_i',
      target: 'end',
      targetHandle: 'M9lWlCCumWqzDnctFaMKU',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__askHkCBjLQBXiXXBphpvlijJ_i-endM9lWlCCumWqzDnctFaMKU',
    },
    {
      source: 'k3uFb',
      sourceHandle: 'dU7LDMy-NjAvp4n6nE81z',
      target: 'EiQ4e',
      targetHandle: 'zEuexK34pXPDJTxai3sKj',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__k3uFbdU7LDMy-NjAvp4n6nE81z-EiQ4ezEuexK34pXPDJTxai3sKj',
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
      id: 'dLydlfUn0DEYbOtKeobUY',
      typeName: 'Story',
      displayName: 'Finished Story',
      content: '{\n  content: string\n  title: string\n}',
      icon: 'book-open-text',
    },
  ],
  uiState: {
    isEditSidebarOpen: false,
    isTypeDialogOpen: false,
  },
}
