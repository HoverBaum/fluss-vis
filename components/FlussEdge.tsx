import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import Lottie from 'lottie-react'
import connectionAnimation from './connectionAnimation.json'
import { updateLottieFillColor } from '@/lib/updateLottieColor'
import { useIsDark } from '@/lib/useIsDark'
import { FlussEdgeType } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'

export const FlussEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
  id,
}: EdgeProps<FlussEdgeType>) => {
  const finsihedAnimating = data?.finsihedAnimating || false
  const edgeFinishedAnimating = useFlussStore(
    (state) => state.edgeFinishedAnimating
  )
  const isDark = useIsDark()
  const { flowToScreenPosition } = useReactFlow()
  const targetScreenPosition = flowToScreenPosition({ x: targetX, y: targetY })
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          strokeWidth: selected ? 2 : 1,
        }}
      />
      <EdgeLabelRenderer>
        {!finsihedAnimating && (
          <Lottie
            onComplete={() => edgeFinishedAnimating(id)}
            animationData={updateLottieFillColor(
              connectionAnimation,
              isDark ? [1, 1, 1, 1] : [0, 0, 0, 1]
            )}
            loop={false}
            className="w-20 h-20 fixed"
            style={{
              transform: `translate(-50%, -50%) translate(${targetScreenPosition.x}px, ${targetScreenPosition.y}px)`,
            }}
            key={`${id}-create-animation`}
          />
        )}
      </EdgeLabelRenderer>
    </>
  )
}
