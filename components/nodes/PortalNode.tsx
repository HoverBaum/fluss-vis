import { Node, NodeProps } from '@xyflow/react'
import React, { ReactNode } from 'react'

export type PortalNodeData = {
  children?: ReactNode
}

/**
 * PortalNode
 * A node for displaying arbitrary children (hints, intro texts, etc) in the flow editor.
 *
 * Usage: Pass React children via the node's data prop as `data: { children: <YourContent /> }`.
 */
export const PortalNode = ({
  data: { children },
}: NodeProps<Node<PortalNodeData>>) => {
  return (
    <div className="min-h-12 min-w-[275px]">
      {children ?? <span className="text-muted-foreground">No content</span>}
    </div>
  )
}
