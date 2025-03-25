'use client'

import React from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  useViewport,
  type EdgeProps,
} from '@xyflow/react'
import connectionAnimation from './connectionAnimation.json'
import { updateLottieFillColor } from '@/lib/updateLottieColor'
import { useIsDark } from '@/lib/useIsDark'
import { FlussEdgeType } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import dynamic from 'next/dynamic'

// Dynamically import Lottie so that it’s only loaded on the client side.
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

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
  source,
  target,
}: EdgeProps<FlussEdgeType>) => {
  const isHighlighted = useFlussStore((state) =>
    state.nodes.some(
      (node) => (node.id === source || node.id === target) && node.selected
    )
  )
  const { state = 'entering' } = data || {}
  const edgeSetState = useFlussStore((state) => state.edgeSetState)
  const isDark = useIsDark()
  const { flowToScreenPosition } = useReactFlow()
  const targetScreenPosition = flowToScreenPosition({ x: targetX, y: targetY })
  const { x, y } = useViewport()
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
          strokeDasharray: state === 'exiting' ? '4 2' : undefined, // Dotted line for "exiting" state
        }}
      />

      <EdgeLabelRenderer>
        {state === 'entering' && (
          <Lottie
            onComplete={() => edgeSetState(id, 'entered')}
            animationData={updateLottieFillColor(
              connectionAnimation,
              isDark ? [159, 205, 242] : [55, 137, 205],
              1
            )}
            loop={false}
            className="w-14 h-14 fixed"
            style={{
              transform: `translate(-50%, -50%) translate(${targetScreenPosition.x - x}px, ${targetScreenPosition.y - y}px)`,
            }}
          />
        )}
      </EdgeLabelRenderer>
    </>
  )
}
