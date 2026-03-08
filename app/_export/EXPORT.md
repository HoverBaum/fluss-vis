# Fluss Export Architecture

Fluss-Vis generates explicit TypeScript from the visual graph. This replaced a more generic orchestration style to keep generated code easier to read/debug and to support future code-to-editor round-tripping. The visual graph is the orchestration source of truth; generated code is its executable projection.

## High-Level Flow

1. User clicks `Save` / `Save to` / `Download` in `SaveButton`.
2. `SaveButton` calls `useExport().flussExport()`.
3. `flussExport()` reads current flow state from store (`nodes`, `edges`, `outputTypes`, `name`).
4. Export metadata is derived from graph structure and types.
5. `flussTemplate(...)` generates TypeScript source code.
6. Source is formatted with Prettier.
7. Save logic writes to an existing file handle, asks for a new handle, or falls back to browser download.

---

## Generated Runtime Example

This is the shape of generated runtime code (simplified):

```ts
const startResultPromise = Promise.resolve(inputs)

const enrichResultPromise = (async () => {
  const enrichInput = {
    userId: (await startResultPromise).userId,
  }
  return await stepFunctions.enrich(enrichInput)
})()

const auditResultPromise = (async () => {
  const auditInput = {
    userId: (await startResultPromise).userId,
  }
  return await stepFunctions.audit(auditInput)
})()

const finalizeResultPromise = (async () => {
  const finalizeInput = {
    profile: (await enrichResultPromise).profile,
    auditId: (await auditResultPromise).auditId,
  }
  return await stepFunctions.finalize(finalizeInput)
})()

const endResultPromise = (async () => {
  const endInput = {
    result: await finalizeResultPromise,
  }
  return endInput
})()

return await endResultPromise
```

Rules shown above:

- One promise per step.
- A step waits only for direct dependencies.
- Independent branches execute in parallel.
- End node assembles output and returns `EndOutput`.
- No scheduler loop, polling, or runtime "canRun" checks.

---

## Core Files

- `app/_export/SaveButton.tsx`
  - Entry point for export from UI.
  - Handles save behavior:
    - save back to existing file handle when possible,
    - otherwise open file picker (`Save to`),
    - fallback download for browsers without File System Access API.

- `app/_export/useExport.ts`
  - Reads current store state.
  - Derives:
    - custom type declarations,
    - `FlussInputs`,
    - step function signatures and dependencies,
    - generation order (dependency-safe).
  - Calls `flussTemplate(...)`.
  - Formats generated code with Prettier.

- `app/_export/flussTemplate.ts`
  - Renders the final `*.fluss.ts` source file.
  - Emits:
    - custom types,
    - `FlussInputs`,
    - per-step `*StepFunction` types,
    - explicit `StepFunctions` contract,
    - `EndInput` / `EndOutput`,
    - `runFluss(...)` runtime implementation,
    - embedded flow JSON for re-import.

---

## Generated Output Contract

Each generated `*.fluss.ts` file contains:

- `runFluss({ inputs, stepFunctions })` as the execution entrypoint.
- `FlussInputs` from start node outputs.
- One `*StepFunction` type per executable step.
- Explicit `StepFunctions` contract mapping step names to generated step function types.
- `EndInput` and `EndOutput` types from end-node wiring.
- Embedded graph JSON between `STATE_JSON_START` and `STATE_JSON_END` markers for editor import.

Execution and failure rules:

- Dependency order is deterministic.
- Sibling branch completion order is not deterministic (async timing).
- If a step rejects, dependent steps fail when awaiting that dependency.
- `runFluss` rejects with propagated error (no retry/recovery layer).

---

## Error Cases During Export

`flussExport()` throws when export invariants are broken, for example:

- an input has no incoming edge,
- an input has ambiguous/multiple incoming edges,
- an edge references an unknown output,
- an output references an unknown type,
- dependency ordering cannot be resolved (for example cycles),
- required structural nodes are missing (for example `start`).

UI (`SaveButton`) surfaces failures via toast notifications.

---

## Save Rules

- Reuse existing file handle when available.
- Otherwise open file picker (`Save to`).
- Fallback to browser download if File System Access API is unavailable.

---

## Practical Constraints and Assumptions

- One incoming edge per input.
- Cycles are invalid.
- End node is assembled output, not executable user logic.
- Nested property mapping uses generated argument names.

---

## Change Safety Checklist

When modifying export architecture, verify all of the following:

1. `runFluss({ inputs, stepFunctions })` API still matches README expectations.
2. Generated `StepFunctions`, `EndInput`, and `EndOutput` remain readable and correct.
3. Parallel dependency behavior still works (independent branches start without waiting on each other).
4. JSON markers (`STATE_JSON_START` / `STATE_JSON_END`) remain intact for import compatibility.
5. Save behavior still supports:
   - save back to existing handle,
   - Save As via picker,
   - browser fallback download.

