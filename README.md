# Fluss Vis 🌊

Flow Editor that couples your diagrams to your code.

>Diagram first development for TypeScript applications 🌊

Fluss Vis lifts the creation of logic flow for your Typescript application into a visual space. Start with a diagram, the same way you probably do already and then fill in the boxes with Typescript functions. Fluss Vis creates the signatures for functions in the flow and handles orchestration (running what can be run). You take care of detailed logic using Typescript.

We believe that humans are visual and thus, lifting higher level orchestration into a visual space enables us to easier reason about it. By linking this diagrams to Typescript signatures, we use each tool for what it is best for. Visual editors for overviews and Typescript for implementing logic.

Fluss Viz will handle the execution of your logic and parallelize async operations where applicable.

**Currently in Alpha at: [alpha.fluss-vis.dev](https://alpha.fluss-vis.dev/)**

## Key Principles

- Targeted at Developers
- Easy for Developers to use
- Should make creating logic fun
- Fully Type-Safe
- We consciously take the tradeoff of fixing the generated code with "hardcoded" types. This makes the code easier to understand and create. When a change is needed, this should come form the visualization.

## Constraints

This you should be aware off, when using Fluss-Viz.

- A Fluss always has one start and one end node.
- The final result is always an object with one property per input defined for the end node.
- Branching is currently not supported!

## Road to Alpha

🏁 Reached 🎉

Fluss-Vis is in Alpha 🚀

**Currently in Alpha at: [alpha.fluss-vis.dev](https://alpha.fluss-vis.dev/)**

## Beta Plan

- Lint Fluss for stepFunctions with same name or inputs with same name and notify user. Ideally with visual indication.
- Normalize outputs to live in a list and nodes reference this list by id for inputs and outputs.
- Re-evaluate system for custom types. We might want a tighter integration with users system. The user probably has types already in their codebase that they would love to use.
  - Fluss-Viz wants to do things visually that are best done visually and leave things that are already great in other tools -> Typing is probably already great in Editors and more cumbersome digitally. Maybe only do display names and icons.
  - How to integrate with existing types from users projects?
- New project screen and flow into that application. Start with a blank editor, what do users see? how are start and end added?
- Logging, tracing - after a Fluss ran it would be great if users could see what happened. Ideally also visually.
- Re-Work save, load and example to be less disrupted by state related type changes.

## Full Release

- Explore how users should use the tool.
  - Npm CLI that can be used to work with FLuss-Viz in your project. Probably the minimum thing because it is IDE independent.
  - Plugins for popular IDEs like VS Code.

## Later Features

This we plan to do but don't know when, yet.

- VS Code Plugin
- Split State into Nodes (editor and visual) and Steps (Fluss parts for logic)
- Introduce undo-redo.
- Diff-Highlighting
  - For Merge Request review and similar we want to highlight want changes between two versions of a Fluss.
- "Drafting" or "Overview" mode where when users zoom out or toggle it, nodes are just bubbles with names that can be connected. Simulate the Diagrams people might do in Excalidraw and enable them to "zoom in" and add details. Also inspired by C4 Model layers.
  - For this Edges probably need to be created with "none" or another value signifying that their type has not yet been set.
- Re-order inputs.
  - Maybe automatically based on source Y position. Maybe that always makes this pretty.

### Ideas

These we might do, maybe not.

- Nodes should be able to pre-create inputs that do not disappear upon edge deletion.
- Fluss-Viz could create files for each node. Like define a function per file with signature.
- Enable users to provide custom nodes that handle recurring tasks they have in multiple flows. this could later enable a community to share steps in a flow.
- Sub-Flows. One flow could depend on another flow for task completion. Currently out of scope!
- Steps could be saved as templates. Or potentially re-used and linked (that is updated together) across multiple flows.
- Auto generate files for the step functions. We know the signature and could create placeholders, already wiring them up to the fluss.
- How can we make this "AI Friendly"? Like could devs build logic in Fluss-Vis and we optimize our output to be used by AI coding Agents?

## Usage

This is the current way of using Fluss-Vis (will change once we are more than a website).

- Fluss-Viz will output a single file.
- The *.fluss.ts file will contain a config that can be used to create a fluss.
- A fluss can be run with different arguments.
- The *.fluss.ts will also export all custom types so users can use those for their logic. Think of intermediate functions.
- The *.fluss.ts file can be read by Fluss-Viz to load an editor and continue working on the fluss.
- All *.fluss.ts files should be checked into version control.
- We highly discourage to edit the fluss.ts file manually.

Custom Types

- Custom types come with a name and are valid TypeScript.
- We see developers as our user-base and will leave writing valid typescript to them!

### Example

Below is a minimal example where our Fluss only squares a number.

![A flow in Fluss-Vis that squares a number.](/docs/example/squareNumber-screen.png)

This Fluss then needs to be filled with inputs and step functions in order to run.

>Note: any stepFunction can be async.

```typescript
import { runFluss, SquareNumberStepFunction } from './squaredNumber.fluss'

const squareNumber: SquareNumberStepFunction = ({ baseNumber }) =>
  Math.pow(baseNumber, 2)

runFluss({
  inputs: {
    baseNumber: 2,
  },
  stepFunctions: {
    squareNumber,
  },
})
```

This will currently produce the following output in your terminal.

```bash
npx tsx docs/example/runSquareNumber.ts 

Currently runnable: [ 'squareNumber' ]
Executing with Input: { baseNumber: { baseNumber: 2 } }
Result: NaN
Currently runnable: [ 'end' ]
Executing with Input: { squaredNumber: NaN }
Result: { squaredNumber: NaN }
Currently runnable: []
All steps done!
```

## Contribution

Contributions in code, ideas and discussion are highly welcome. Please [reach out](https://hendrikwallbaum.de/).
