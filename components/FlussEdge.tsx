'use client'

import { CSSProperties, useMemo, useState } from 'react'
import {
  BaseEdge,
  getBezierPath,
  ViewportPortal,
  type EdgeProps,
} from '@xyflow/react'
import connectionAnimation from './connectionAnimation.json'
import { updateLottieFillColor } from '@/lib/updateLottieColor'
import { useIsDark } from '@/lib/useIsDark'
import { FlussEdgeType } from '@/stores/flussStore'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import dynamic from 'next/dynamic'
import { EnterExitAnimationDurationMS } from '@/lib/constants'

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
  source,
  target,
}: EdgeProps<FlussEdgeType>) => {
  const isHighlighted = useFlussStore((state) =>
    state.nodes.some(
      (node) => (node.id === source || node.id === target) && node.selected
    )
  )
  const { state = 'entering' } = data || {}
  const isDark = useIsDark()
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const [playAnimation, setPlayAnimation] = useState(state === 'entering')

  const style: CSSProperties = useMemo(() => {
    const base: CSSProperties = {
      strokeWidth: selected || isHighlighted ? 2 : 1,
      transition: `stroke ${EnterExitAnimationDurationMS / 1000}s, stroke-width ${EnterExitAnimationDurationMS / 1000}s`,
    }

    // Exiting state takes full precedence
    if (data?.state === 'exiting') {
      return {
        ...base,
        strokeDasharray: '4 2',
        stroke: 'var(--danger)',
        opacity: 0,
        transition: `opacity ${EnterExitAnimationDurationMS / 1000}s`,
      }
    }

    // Entering state can be combined with selection
    let style = { ...base }
    if (selected) {
      style = {
        ...style,
      }
    }
    if (data?.state === 'entering') {
      style = {
        ...style,
        stroke: 'var(--positive)',
      }
    }

    return style
  }, [data?.state, isHighlighted, selected])

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={style}
        className={`${selected ? 'animate-flowingDashToSolid' : ''}`}
      />

      {/* ViewportPortal enables us to just use target position. */}
      <ViewportPortal>
        {playAnimation && (
          <Lottie
            onComplete={() => setPlayAnimation(false)}
            animationData={updateLottieFillColor(
              connectionAnimation,
              isDark ? [159, 205, 242] : [55, 137, 205],
              1
            )}
            loop={false}
            // -z to position this behind the nodes. Thus only animating to one side.
            className="absolute -z-10 h-14 w-14"
            style={{
              transform: `translate(-50%, -50%) translate(${targetX}px, ${targetY}px)`,
            }}
          />
        )}
      </ViewportPortal>
    </>
  )
}
