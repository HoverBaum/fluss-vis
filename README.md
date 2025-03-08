# Fluss Viz

Visual development toolkit for data flows in TypeScript.

This tool is meant to create a frame through visual means which can then be filled with TypeScript functions. By this we want to lift each aspect of the creation of complex flows into the space that fits them best. The orchestration of the flow into a visual layer while keeping the implementation of logic in a well suited, TypeScript powered realm.

Fluss Viz will handle the execution of your logic and parallelize async operations where applicable.


# Plan
- Export flow
- Enable renaming of Outputs - probably name output and not inputs.
- Enable more Inputs for FlussNodes and EndNode
- Enable more Inputs for StartNode
- Selected Edges should be visible in front of other nodes
- Nodes should be able to pre-create inputs that do not disappear upon edge deletion.
- There should only be one connection between two nodes.

We probably need to switch from associating nodes with an output type to associating handles with one. Or we need more special handling of startNode, because StartNode has multiple outputs.


## Usage

This is the current, rough idea.
- Fluss-Viz will output a single file.
- The fluss.ts file will contain a config that can be used to create a fluss.
- A fluss can be run with different arguments.
- The fluss.ts will also export all custom types so users can use those for their logic. Think of intermediate functions.
- The fluss.ts file can be read by Fluss-Viz to load an editor and continue working on the fluss.
- All fluss.ts files should be checked into version control.
- We highly discourage to edit the fluss.ts file manually.

Custom Types
- Custom types come with a name and are valid TypeScript.
- We see developers as our user-base and will leave writing valid typescript to them!

```typescript
import {flussFromConfig} from 'fluss-viz'
const fluss = flussFromConfig(flussConfig)

fluss.run({
  name: 'Run name'
  inputs: {
    storyPrompt: 'pirates saving a princess'
  },
  stepFunctions: {
    createDraft: (storyPrompt: string) => 'Great story 🪄'
  }
})
```

```typescript
// fluss-name.fluss.ts
import {type FlussConfig} from 'fluss-viz'
export const flussConfig: FlussConfig = {
  //…
}

export type CustomType = {
  //…
}
```
