import { expect, test } from 'vitest'
import { PumpFluss, pumpFluss } from './flowPump'

test('FlussPump Async', async () => {
  const exampleFlussWithAsync: PumpFluss = {
    name: 'Example testing fluss with async',
    steps: [
      {
        id: 'start',
        status: 'done',
        execute: (args) => args,
        result: {
          name: 'World',
        },
        arguments: [],
      },
      {
        id: 'sayHello',
        status: 'waiting',
        execute: ({ name }) => `Hello ${name}`,
        arguments: [
          {
            sourceStepId: 'start',
            argumentName: 'name',
            sourceProperty: 'name',
          },
        ],
      },
      {
        id: 'addExclamation',
        status: 'waiting',
        execute: ({ greeting }) =>
          new Promise((resolve) =>
            setTimeout(() => resolve(`${greeting}!`), 10)
          ),
        arguments: [
          {
            sourceStepId: 'sayHello',
            argumentName: 'greeting',
          },
        ],
      },
      {
        id: 'end',
        status: 'waiting',
        execute: (args) => args,
        arguments: [
          {
            sourceStepId: 'addExclamation',
            argumentName: 'result',
          },
        ],
      },
    ],
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pumpAsyncesult = (await pumpFluss(exampleFlussWithAsync)) as any
  expect(pumpAsyncesult.result).toBe('Hello World!')
})

test('FlussPump Basic', async () => {
  const exampleFluss: PumpFluss = {
    name: 'Example testing fluss with async',
    steps: [
      {
        id: 'start',
        status: 'done',
        execute: (args) => args,
        result: {
          name: 'World',
        },
        arguments: [],
      },
      {
        id: 'sayHello',
        status: 'waiting',
        execute: ({ name }) => `Hello ${name}!`,
        arguments: [
          {
            sourceStepId: 'start',
            argumentName: 'name',
            sourceProperty: 'name',
          },
        ],
      },
      {
        id: 'end',
        status: 'waiting',
        execute: (args) => args,
        arguments: [
          {
            sourceStepId: 'sayHello',
            argumentName: 'result',
          },
        ],
      },
    ],
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pumpAsyncesult = (await pumpFluss(exampleFluss)) as any
  expect(pumpAsyncesult.result).toBe('Hello World!')
})
