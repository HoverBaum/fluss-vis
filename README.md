# Fluss Viz

Visual development toolkit for data flows in TypeScript.

This tool is meant to create a frame through visual means which can then be filled with TypeScript functions. By this we want to lift each aspect of the creation of complex flows into the space that fits them best. The orchestration of the flow into a visual layer while keeping the implementation of logic in a well suited, TypeScript powered realm.

Fluss Viz will handle the execution of your logic and parallelize async operations where applicable.


# Plan
- Add Start node - no input and can NOT be deleted
- Add Final node - only input
- Export flow

We probably need to switch from associating nodes with an output type to associating handles with one. Or we need more special handling of startNode, because StartNode has multiple outputs.
