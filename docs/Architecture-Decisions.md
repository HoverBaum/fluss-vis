# Architecture decisions

## 2025-03-08 Only one connection per handle

Each input/target handle will only allow one incoming connection!
Also: edges can be dropped on nodes to create a new input which the edge connects to.

Previously we enabled multiple edges to connect to the same input handle. We had logic to make sure that they were of the same type.
This complexity will be removed by allowing only one connection per handle.
Previously we thought that multiple ingoing connections could be use to collect arrays but we will not support collecting multiple values into an array for now. Instead we want to support collecting into objects or just having function with multiple inputs.
We also want to enable both: inputs being created when an edge is dropped on a note and pre-configured inputs that have a fixed type. (maybe later though)
