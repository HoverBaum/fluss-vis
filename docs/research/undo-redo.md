# Undo Redo

Allows users to do cmd+z to undo the last step. (like exidental deletion).

We can use Zundo for time traveling in Zustand. https://github.com/charkour/zundo?tab=readme-ov-file
Tried this before, below is the code I created and learnings.

## Learnings

- React Flow creates a bunch of events we don't care about. -> probably need to refactor state handling before we can really do undo.
- V3 of Zundo is coming which will streamline handleSet - potentially turning it into a nice place to work with to decide what to save.
- Played around with delta https://github.com/charkour/zundo?tab=readme-ov-file#store-state-delta-rather-than-full-object but didn't see a benefit. Didn't understand why only store change events. The example in docs uses microdoff but just-diff can do the same with `.op`.

- We could look at providing a custom equality function that excludes certain state updates from being stored.

## Temporal wrapper for store

I tried with this config:

```typescript
{
        // How many steps one can go back.
        limit: 100,
        // Exclude some properties from the history.
        partialize: (state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { uiState, ...rest } = state
          return rest
        },
        // Throttle history snapshots.
        handleSet: (handleSet) =>
          debounce<typeof handleSet>((state) => {
            handleSet(state)
          }, 300),
      }
```

Seemed to work okay but the real problem is in which updates do we want to be able to turn back. We don't care about sidebar. We probably don't care about highlight. We care about position and edge changes. We also have some changes that trigger more events.

## Hook to use temporal

```typescript
export const useFlussTemporalStore = () => {
  const flussStoreContext = useContext(FlussStoreContext)

  if (!flussStoreContext) {
    throw new Error(
      `useFlussStoreTemporal must be used within FlussStoreProvider`
    )
  }
  return flussStoreContext.temporal.getState()
}
```

```typescript
const { undo } = useFlussTemporalStore()
```

Had to call undo twice to skip irrelevant react flow events. Like focus.
