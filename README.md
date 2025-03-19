# Fluss Viz

Visual development toolkit for data flows in TypeScript.

This tool is meant to create a frame through visual means which can then be filled with TypeScript functions. By this we want to lift each aspect of the creation of complex flows into the space that fits them best. The orchestration of the flow into a visual layer while keeping the implementation of logic in a well suited, TypeScript powered realm.

Fluss Viz will handle the execution of your logic and parallelize async operations where applicable.

## Key Principles

- Targeted at Developers
- Easy for Developers to use
- Should make creating logic fun
- Fully Type-Safe
- 0-Dependencies
- We consciously take the tradeoff of fixing the generated code with "hardcoded" types. This makes the code easier to understand and create. When a change is needed, this should come form the visualization.

## Road to Alpha

- EditSidebar should be able to edit output and remove inputs.
- Handle IDs should not contain node IDs! Or this whole id should be the output and inputId in the state. Remove indirect coupling of needing same logic in different places. Maybe just longer ids.
- Ability to edit custom Types.
- Persist Editor Settings. https://zustand.docs.pmnd.rs/integrations/persisting-store-data#storage 
- Provide more helper types like a type for each stepFunction and input and return so devs can use that in their code.
- Persist and load editor state - using a file, maybe also the .ts file.

### NOT part of Alpha

## Later Features

This we plan to do.

- Extract common logic from all Nodes.

### Ideas

These we might do, maybe not.

- Nodes should be able to pre-create inputs that do not disappear upon edge deletion.
- Fluss-Viz could create files for each node. Like define a function per file with signature.
- Enable users to provide custom nodes that handle recurring tasks they have in multiple flows. this could later enable a community to share steps in a flow.
- Sub-Flows. One flow could depend on another flow for task completion. Currently out of scope!

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
    locale: 'de'
  },
  stepFunctions: {
    squareNumber: (numberToSquare: number) => Math.square(numberToSquare),
    createString: ....
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

## Constraints

- A Fluss always has one start and one end node.
- The final result is always an object with one property per input defined for the end node.
- Branching is currently not supported!
