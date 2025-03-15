export type Person = { name: string }

type runInput = {
  inputs: {
    person: Person
  }
  stepFunctions: {
    step1: (arg1: Person) => string
    step2: (arg1: string) => number
  }
}

type runResult = number

export const runFluss = async (input: runInput): Promise<runResult> => {
  const step1Result = await input.stepFunctions.step1(input.inputs.person)
  const step2Result = await input.stepFunctions.step2(step1Result)
  return step2Result
}

/**
 * We probably need to walk backwards to setup the logic.
 * Lokk at last node, await all previous nodes, for each node do the same.
 */
