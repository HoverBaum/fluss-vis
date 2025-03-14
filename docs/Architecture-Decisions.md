# Architecture decisions

## 2025-03-14 Outputs are postfixed with _nodeId

In the created code, Results/Outputs are always postfixed with _id of their producing node.
This ensure uniqueness of variable names.
It enables users to use the same name twice without creating a conflict.

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
