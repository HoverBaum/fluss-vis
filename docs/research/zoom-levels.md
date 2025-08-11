# Zoom Levels

It seem obvious that when zoomed out far enough nodes should behave differently.
At the point of writing I experimented with different behaviors but I realized that all of this is pre-mature optimization as I do not understand the use-case, yet. Possible use-cases could be:

- Have just names and connections to do a high level plan before assigning types. Then zooming in to do detail work.
- Zooming out to get an overview.

One thing I did is implement a hook to get an "isZoomedOut", this needs a zoom level, that could be configured in the final implementation.

```typescript
import { ReactFlowState, useStore } from '@xyflow/react'
import { useMemo } from 'react'

const zoomSelector = (state: ReactFlowState) => state.transform[2]

export const useZoom = () => {
  const zoom = useStore(zoomSelector)

  const isZoomedOut = useMemo(() => zoom <= 0.7, [zoom])

  return {
    zoom,
    isZoomedOut,
  }
}
```

I then used that hook to display placeholders for the cards description. Trick here is that I know how high the description can be, because it is limited in length and can thus just overlay an element that fills the space.

```tsx
<CardDescription>
  <div className="relative">
    <div className={`transition-opacity ${isZoomedOut ? 'opacity-0' : ''}`}>
      {descriptionIsEmpty && 'Double click node to edit'}
      {descriptionIsTruncated &&
        description?.substring(0, TruncatedDescriptionLength) + '…'}
      {description && !descriptionIsTruncated && description}
    </div>

    <div
      className={`absolute top-0 left-0 grid h-full w-full gap-2 overflow-hidden bg-transparent transition-opacity ${isZoomedOut ? '' : 'opacity-0'}`}
    >
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </div>
  </div>
</CardDescription>
```

I already noticed that animating between things felt weird. It meant that growing was triggered through a zoom point but then coupled to time and not zoom level. That felt off.

It might make sense to have a "work mode toggle" next tot he color mode toggle.

## Placeholder

```tsx
type PlaceholderProps = {
  className?: string
}
export const Placeholder = ({ className }: PlaceholderProps) => {
  return <div className={`bg-muted h-4 w-full rounded-md ${className}`}></div>
}
```
