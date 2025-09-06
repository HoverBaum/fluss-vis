# Fluss Scheduler & Executor — Plan and Contract

This document defines the goals, constraints, architecture, public contract, integration strategy, and testing approach for extracting the scheduler and executor from the export template into a self-contained TypeScript module. It’s written so any teammate can implement the work without prior context.

## Why

- Improve testability: isolate scheduler/executor logic to unit test independently of the export template.
- Improve developer experience: type-safe authoring with clear contracts.
- Preserve export guarantees: final exported runtime remains dependency-free and deterministic.

## Goals and constraints

- Output must be TypeScript (the exported artifact is TS, not converted to JS).
- Extract into a single `.ts` file located at `app/_export/`.
- The extracted file must have no imports (no external or internal dependencies).
- Execution model: run-as-soon-as-ready, parallel where possible (no phase barriers).
- Determinism: stable tie-breaking by node id.
- Error policy: fail-fast on first error; do not start new nodes after a failure.
- No maxConcurrency/cancellation/timeouts/retries for v1.
- Tests co-located with the extracted module.
- Version string should reflect `package.json` version.
- Export currently runs on the client; reading files happens at build time (not at client runtime).
- Live-reload during dev: edits to the extracted file should be reflected in the generated string used by the template without manual steps.

## High-level approach

- Create `app/_export/schedulerExecutor.ts` containing:
  - Minimal types, error classes, scheduler, executor, convenience runner, and a version placeholder constant.
  - No imports; fully self-contained.
- Build-time ingestion:
  - A small Node-based code-generation step reads the file contents and generates `lib/generated/flussRuntimeSource.ts` that exports a string constant with the source.
  - Replace the version placeholder with `package.json` version during generation.
  - The template code (e.g., `app/_export/flussTemplate.ts`) imports the generated string and injects it into the final exported TS.
- Dev live-reload:
  - Add a watch script (or re-run the generator on file change) so that the Next development server picks up changes via HMR.

## Alternatives considered

- Convert at export-time (TypeScript `transpileModule`) to JS, then inject:
  - Discarded because the final output must remain TS; JS conversion is unnecessary.
- AST-based inlining (ts-morph) to inject only function bodies:
  - Precise but heavier than needed; future option if we need fine-grained control.
- Bundle with a small bundler then inject:
  - Overkill for a single self-contained file with no imports.

## Public contract (TypeScript signatures)

These signatures define the import-free API of the extracted module. They favor clarity and stability while keeping room for future extensions.

```ts
// Core ids and graph
export type FlussNodeId = string
export type FlussEdge = { from: FlussNodeId; to: FlussNodeId }
export type FlussGraph = { nodes: FlussNodeId[]; edges: FlussEdge[] }

// Context and implementations
export type FlussContext<C = Record<string, unknown>> = C
export type FlussMaybePromise<T> = T | Promise<T>
export type FlussNodeFn<C> = (ctx: C) => FlussMaybePromise<Partial<C> | void>
export type FlussImplementations<C> = Record<FlussNodeId, FlussNodeFn<C>>

// Plan (for independent testing of scheduler)
export type FlussPlan = {
  nodeIds: FlussNodeId[]
  successors: Record<FlussNodeId, FlussNodeId[]>
  indegree: Record<FlussNodeId, number>
  initialReady: FlussNodeId[] // sorted by id when stableSort=true
}

// Options and hooks
export type FlussScheduleOptions = {
  stableSort?: boolean // default: true
}

export type FlussExecuteHooks<C> = {
  onNodeStart?: (id: FlussNodeId, ctx: C) => void
  onNodeSuccess?: (id: FlussNodeId, ctx: C, update: Partial<C> | void) => void
  onNodeError?: (id: FlussNodeId, error: unknown) => void
}

export type FlussExecuteOptions<C> = {
  failFast?: boolean // default: true
  stableSort?: boolean // default: true (ties for newly-ready nodes)
  hooks?: FlussExecuteHooks<C>
}

// Results and errors
export type FlussRunResult<C> = {
  context: C // initialContext merged with all node updates
  results: Record<FlussNodeId, unknown>
  order: FlussNodeId[] // actual start order for determinism/debug
}

export class FlussScheduleError extends Error {
  kind: 'cycle' | 'missing-node' | 'invalid-graph'
  details?: unknown
  constructor(message: string, kind: FlussScheduleError['kind'], details?: unknown)
}

export class FlussExecuteError extends Error {
  nodeId: FlussNodeId
  cause: unknown
  constructor(nodeId: FlussNodeId, cause: unknown)
}

// Version placeholder (replaced from package.json at build time)
export const FLUSS_RUNTIME_VERSION: string // e.g. '__FLUSS_VERSION__'

// Public API
export function flussCreatePlan(
  graph: FlussGraph,
  opts?: FlussScheduleOptions
): FlussPlan // throws FlussScheduleError

export function flussRunPlan<C>(
  plan: FlussPlan,
  impls: FlussImplementations<C>,
  initialContext: C,
  opts?: FlussExecuteOptions<C>
): Promise<FlussRunResult<C>> // fail-fast by default; no cancellation/maxConcurrency

// Convenience: schedule + execute
export function flussRunGraph<C>(
  graph: FlussGraph,
  impls: FlussImplementations<C>,
  initialContext: C,
  opts?: FlussExecuteOptions<C> & FlussScheduleOptions
): Promise<FlussRunResult<C>>
```

### Behavioral guarantees

- As-soon-as-ready: No phase barriers; successors can start as soon as all their prerequisites complete—even if other ready tasks are still running.
- Determinism: When multiple nodes become ready simultaneously, start order is ascending node id by default (`stableSort=true`). Completion timing remains dependent on user functions.
- Fail-fast: On the first task failure, no new tasks are started. Already running tasks are allowed to complete. The promise rejects with a `FlussExecuteError` for the failing node.
- Validation: Scheduler throws `FlussScheduleError` for invalid graphs (cycles, missing node refs). Executor may throw `FlussExecuteError` for missing implementations at runtime.

## Data model notes

- Graph shape is intentionally minimal: list of node ids and directed edges `{ from, to }`.
- Context merging: Each node may return `Partial<C>`; executor merges into a shared context object in completion order.
- Results: Raw per-node return values (if any) are surfaced via `results` for diagnostics.

## Testing plan (Vitest)

Location: co-located with the module, e.g. `app/_export/__tests__/schedulerExecutor.test.ts`.

Cover initially:

- Linear: A → B → C
  - Expected order of starts is A, B, C.
  - Context updates merge in sequence; results contain all node returns.
- Parallel/diamond: A → B, A → C, B → D, C → D
  - A starts first; then both B and C start (sorted order: by id).
  - D starts after both B and C complete.
  - Use different delays in B/C to prove as-soon-as-ready behavior and concurrency.
- Optional starter: Cycle detection
  - A ↔ B should throw `FlussScheduleError` with `kind: 'cycle'`.

Later (nice-to-have):

- Missing node/edge reference error.
- Empty graph behavior.
- Deterministic start order when many nodes are ready.

## Build-time ingestion and dev workflow

- Generator script (Node):
  - Reads `app/_export/schedulerExecutor.ts`.
  - Replaces `FLUSS_RUNTIME_VERSION` placeholder with the version from `package.json`.
  - Writes `lib/generated/flussRuntimeSource.ts` exporting a string constant, e.g.:
    - `export const FLUSS_RUNTIME_SOURCE = "...escaped TS source...";`
- Template usage:
  - `app/_export/flussTemplate.ts` imports `FLUSS_RUNTIME_SOURCE` and injects the runtime TS into the exported code string.
- Live-reload:
  - Provide a package.json script to run the generator in watch mode during local development so changes to `schedulerExecutor.ts` update `flussRuntimeSource.ts` automatically and trigger HMR.

## Versioning

- Embed `FLUSS_RUNTIME_VERSION` constant in the extracted TS file (placeholder string).
- Replace it with the `package.json` version during generation.
- Optionally include a `runtimeVersion` comment in the exported code for traceability.

## Edge cases and error modes

- Cycles: Detected by scheduler; throw `FlussScheduleError` with `kind: 'cycle'`.
- Missing node references in edges: `FlussScheduleError` with `kind: 'invalid-graph'` or `kind: 'missing-node'`.
- Duplicate node ids: Either reject during planning or normalize to unique set; pick one consistent approach (recommend: reject as invalid-graph).
- Missing implementation for a node at execution: `FlussExecuteError` identifying the node.
- Empty graph: Should succeed with unchanged context and empty order.

## Future enhancements (explicitly out-of-scope for v1)

- Max concurrency (per executor) using a small inlined pool.
- Cancellation (AbortSignal), per-node timeouts, and retries/backoff.
- Additional hooks (onPlan, onAllComplete) and richer tracing.
- Optional phase-based plan emitter for alternative execution strategies.
- Standalone type package for consumers of exported TS.

## Implementation steps (summary)

1. Add `app/_export/schedulerExecutor.ts` implementing the contract above (no imports).
2. Add co-located tests under `app/_export/__tests__/` covering linear and parallel scenarios.
3. Implement generator script to produce `lib/generated/flussRuntimeSource.ts` and inject version.
4. Update `app/_export/flussTemplate.ts` to consume `FLUSS_RUNTIME_SOURCE` and include it in the final exported TS.
5. Add a package.json script for watch mode to keep dev live-reload seamless.
6. Optional: add a snapshot test for the generated source string to catch accidental changes.

## Acceptance criteria

- The extracted file compiles in isolation (no imports, no TypeScript errors).
- Tests for linear and parallel graphs pass reliably and deterministically.
- Export flow uses the generated string and still produces valid TypeScript output.
- Version is embedded from `package.json`.
- Dev live-reload updates the generated string upon changes to `schedulerExecutor.ts`.

---

If anything above needs adjustment (e.g., naming conventions), update this plan before implementation to keep the code aligned with the intended contract.
