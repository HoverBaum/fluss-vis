'use client'

import React from 'react'
import {
  BaseEdge,
  // EdgeLabelRenderer,
  getBezierPath,
  // useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
// import Lottie from 'lottie-react'
// import connectionAnimation from './connectionAnimation.json'
// import { updateLottieFillColor } from '@/lib/updateLottieColor'
// import { useIsDark } from '@/lib/useIsDark'
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
  // data,
  // id,
  source,
  target,
}: EdgeProps<FlussEdgeType>) => {
  const isHighlighted = useFlussStore((state) =>
    state.nodes.some(
      (node) => (node.id === source || node.id === target) && node.selected
    )
  )
  // const finsihedAnimating = data?.finsihedAnimating || false
  // const edgeFinishedAnimating = useFlussStore(
  //   (state) => state.edgeFinishedAnimating
  // )
  // const isDark = useIsDark()
  // const { flowToScreenPosition } = useReactFlow()
  // const targetScreenPosition = flowToScreenPosition({ x: targetX, y: targetY })
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
          strokeWidth: selected || isHighlighted ? 2 : 1,
        }}
      />
      {/* <EdgeLabelRenderer>
        {!finsihedAnimating && (
          <Lottie
            onComplete={() => edgeFinishedAnimating(id)}
            animationData={updateLottieFillColor(
              connectionAnimation,
              isDark ? [159, 205, 242] : [55, 137, 205],
              1
            )}
            loop={false}
            className="w-14 h-14 fixed"
            style={{
              transform: `translate(-50%, -50%) translate(${targetScreenPosition.x}px, ${targetScreenPosition.y}px)`,
            }}
            key={`${id}-create-animation`}
          />
        )}
      </EdgeLabelRenderer> */}
    </>
  )
}
