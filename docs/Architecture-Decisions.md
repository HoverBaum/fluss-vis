# Architecture decisions

## 2025-03-28 Fluss execution just check which steps can be run

When a Fluss is executed we look at all steps and determine which can now be run. We then run all these steps and after any step finished check again, which steps can now be run.

This might impose a larger burden on runtime-memory usage but enables us to write much simpler logic. We played around with pre-determining the execution path but that turned out to be a very complex problem. We might tackle that in the future but not for now. While a single, directed flow that can be absolutely ordered into a single line is easy to implement, it gets Complex as soon, as we have branches and parallelisation.

## 2025-03-27 Lucid Icons are used as XYIcon

Instead of using `<Cirecle />`  we will use `<CircleIcon />`. This increases clarity, that these components are icons and nothing else. It eases readability wile mildly inconveniencing developers during creation. A trade-off we are happy to take.

## 2025-03-14 Outputs are postfixed with _nodeId - DEPRECATED

In the created code, Results/Outputs are always postfixed with _id of their producing node.
This ensure uniqueness of variable names.
It enables users to use the same name twice without creating a conflict.

**DEPRECATED**: this proved to be unnecessary complexity.

## 2025-03-11 Every Node has outputs

To write easier code in some places (mainly the store) and not always have to do type checks: each node will have outputs. To ensure the outputs still conform to:

- At least one, possibly more for the Start
- Exactly one for Steps
- None for End

We introduce helper types which enforce these constraints on the arrays.

## 2025-03-08 Only one connection per handle

Each input/target handle will only allow one incoming connection!
Also: edges can be dropped on nodes to create a new input which the edge connects to.

Previously we enabled multiple edges to connect to the same input handle. We had logic to make sure that they were of the same type.
This complexity will be removed by allowing only one connection per handle.
Previously we thought that multiple ingoing connections could be use to collect arrays but we will not support collecting multiple values into an array for now. Instead we want to support collecting into objects or just having function with multiple inputs.
We also want to enable both: inputs being created when an edge is dropped on a note and pre-configured inputs that have a fixed type. (maybe later though)
