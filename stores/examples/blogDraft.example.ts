import { Position } from '@xyflow/react'
import { FlussState } from '../flussStore'
import { outputTypesBasics } from '../outputTypesBaics'

export const BlogDraftExampleState: FlussState = {
  name: 'Blogpost draft',
  nodes: [
    {
      id: 'start',
      position: {
        x: 9.15848648912727,
        y: 239.3015027177035,
      },
      type: 'startNode',
      deletable: false,
      data: {
        type: 'start',
        id: 'start',
        outputs: [
          {
            id: 'out-2H3ZJmKTWsx6teMBCXFpQ',
            name: 'Post Voice note',
            type: 'f_DU5JfSq-qxMAVX6LfZj',
          },
          {
            id: 'out-RcuK1Ipi4tDGn3OHsilpC',
            name: 'Example Posts',
            type: 'enwEdnGKvMZmWDdp2uEqi',
          },
          {
            id: 'out--JXHVQ2fVeyZZwapdVJXO',
            name: 'Blog Notes',
            type: 'Rmvz3dF1qzxxZfTS7UfbL',
          },
        ],
        name: 'Start',
        description: 'Start node of the Fluss.',
        state: 'entered',
      },
      measured: {
        width: 275,
        height: 494,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'end',
      position: {
        x: 1608.446237930668,
        y: 459.5147385534135,
      },
      type: 'endNode',
      deletable: false,
      data: {
        type: 'end',
        id: 'end',
        inputs: [
          {
            id: 'in-QNo1SZdWw0PEKTItS0lrb',
            state: 'entered',
          },
        ],
        name: 'End 📄',
        description: 'End node of the Fluss.',
        state: 'entered',
        outputs: [],
      },
      measured: {
        width: 275,
        height: 160,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'dAtn7',
      position: {
        x: 433.22269492234034,
        y: 53.04710383584563,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'dAtn7',
        description: 'Turn Voice note to string.',
        name: 'Voice note to string',
        inputs: [
          {
            id: 'in-Bj9KQMbPWzS6wGIdc3A7P',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'out-_Ln7nCi3GM07GG2oyeH4u',
            name: 'Post Description',
            type: 'Rmvz3dF1qzxxZfTS7UfbL',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 329,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'kVY6O',
      position: {
        x: 848.3792575356163,
        y: 205.60340034338594,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'kVY6O',
        description:
          'Structures the users input.\nAssumes that either audio or text input was provided.',
        name: 'Structure Description',
        inputs: [
          {
            id: 'in-mGl4DbHlst7W3ZFotv6jV',
            state: 'entered',
          },
          {
            id: 'in-hd9XLWgxLWBpcQAnODX8m',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'out-Twxmg0HyI0NM9ceAioeId',
            name: 'Users Ideas',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 409,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'nadG-',
      position: {
        x: 1224.1674505826866,
        y: 416.56053961003585,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'nadG-',
        description:
          'Writes a draft based on the users idea and example posts.',
        name: 'Write Draft',
        inputs: [
          {
            id: 'in-hMdbvJ7HIPYXBrw8IHb8s',
            state: 'entered',
          },
          {
            id: 'in-enFAJU6v4co_Oz-iw_GgX',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'out-1rbw7UCHrf7jS8ggMxI5U',
            name: 'Post draft',
            type: 'string',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 373,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'UCH5q',
      position: {
        x: 569.2229163147833,
        y: 682.5017480252939,
      },
      type: 'flussNode',
      data: {
        type: 'step',
        id: 'UCH5q',
        description:
          'Analyses provided examples and distills them into the users style.',
        name: 'Understand Style',
        inputs: [
          {
            id: 'in-iODcRNToCZdoACw4QImFM',
            state: 'entered',
          },
        ],
        outputs: [
          {
            id: 'out-bdg9Ph4A6LycsX3qWlKYZ',
            name: 'Blog Style',
            type: 'Rmvz3dF1qzxxZfTS7UfbL',
          },
        ],
        state: 'entered',
      },
      sourcePosition: Position.Right,
      measured: {
        width: 275,
        height: 349,
      },
      selected: false,
      dragging: false,
    },
  ],
  edges: [
    {
      source: 'start',
      sourceHandle: 'out-2H3ZJmKTWsx6teMBCXFpQ',
      target: 'dAtn7',
      targetHandle: 'in-Bj9KQMbPWzS6wGIdc3A7P',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startout-2H3ZJmKTWsx6teMBCXFpQ-dAtn7in-Bj9KQMbPWzS6wGIdc3A7P',
    },
    {
      source: 'dAtn7',
      sourceHandle: 'out-_Ln7nCi3GM07GG2oyeH4u',
      target: 'kVY6O',
      targetHandle: 'in-mGl4DbHlst7W3ZFotv6jV',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__dAtn7out-_Ln7nCi3GM07GG2oyeH4u-kVY6Oin-mGl4DbHlst7W3ZFotv6jV',
    },
    {
      source: 'kVY6O',
      sourceHandle: 'out-Twxmg0HyI0NM9ceAioeId',
      target: 'nadG-',
      targetHandle: 'in-hMdbvJ7HIPYXBrw8IHb8s',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__kVY6Oout-Twxmg0HyI0NM9ceAioeId-nadG-in-hMdbvJ7HIPYXBrw8IHb8s',
    },
    {
      source: 'nadG-',
      sourceHandle: 'out-1rbw7UCHrf7jS8ggMxI5U',
      target: 'end',
      targetHandle: 'in-QNo1SZdWw0PEKTItS0lrb',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__nadG-out-1rbw7UCHrf7jS8ggMxI5U-endin-QNo1SZdWw0PEKTItS0lrb',
    },
    {
      source: 'start',
      sourceHandle: 'out--JXHVQ2fVeyZZwapdVJXO',
      target: 'kVY6O',
      targetHandle: 'in-hd9XLWgxLWBpcQAnODX8m',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startout--JXHVQ2fVeyZZwapdVJXO-kVY6Oin-hd9XLWgxLWBpcQAnODX8m',
    },
    {
      source: 'start',
      sourceHandle: 'out-RcuK1Ipi4tDGn3OHsilpC',
      target: 'UCH5q',
      targetHandle: 'in-iODcRNToCZdoACw4QImFM',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__startout-RcuK1Ipi4tDGn3OHsilpC-UCH5qin-iODcRNToCZdoACw4QImFM',
    },
    {
      source: 'UCH5q',
      sourceHandle: 'out-bdg9Ph4A6LycsX3qWlKYZ',
      target: 'nadG-',
      targetHandle: 'in-enFAJU6v4co_Oz-iw_GgX',
      data: {
        state: 'entered',
      },
      id: 'xy-edge__UCH5qout-bdg9Ph4A6LycsX3qWlKYZ-nadG-in-enFAJU6v4co_Oz-iw_GgX',
    },
  ],
  outputTypes: [
    ...outputTypesBasics,
    {
      id: 'f_DU5JfSq-qxMAVX6LfZj',
      typeName: 'OptionalAudio',
      displayName: 'Audio?',
      content: 'Blob | undefined',
      icon: 'speaker',
    },
    {
      id: 'Rmvz3dF1qzxxZfTS7UfbL',
      typeName: 'OptionalString',
      displayName: 'String?',
      content: 'string | undefined',
      icon: 'letter-text',
    },
    {
      id: 'JDGj_0kJfFKIarMEek7qj',
      typeName: 'ExamplePost',
      displayName: 'Example Post',
      content: '{\n  id: string\n  title: string\n  content: string\n}',
      icon: 'book-copy',
    },
    {
      id: 'enwEdnGKvMZmWDdp2uEqi',
      typeName: 'ExampleArray',
      displayName: 'Example Array',
      content: 'ExamplePost[]',
      icon: 'book-copy',
    },
  ],
  uiState: {
    isEditSidebarOpen: false,
    isTypeDialogOpen: false,
  },
  fileHandleKey: 'sVBFN4kr58bONpg_Jmhts',
  hasHydrated: true,
}
