import { useShallow } from 'zustand/react/shallow'
import { FlussStepDefault } from '@/fluss-lib/fluss'
import { newId, shortId } from '@/fluss-lib/flussId'
import { useFlussStore } from '@/stores/FlussStoreProvider'
import { Node, NodeChange, useReactFlow } from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FlussNodeType } from '@/stores/flussStore'

export const useCopyPaste = () => {
  const { screenToFlowPosition } = useReactFlow()
  const onNodesChange = useFlussStore(
    useShallow((state) => state.onNodesChange)
  )
  // On Screen Position of Mouse.
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const selectedNodes = useFlussStore(
    useShallow((state) => state.nodes.filter((node) => node.selected))
  )
  const [copiedNodes, setCopiedNodes] = useState<Node<FlussStepDefault>[]>([])

  // Sadly we can not get the mouse position, only listen to it's change.
  const mouseMoveLIstener = (event: MouseEvent) => {
    const { clientX, clientY } = event
    setMousePosition({ x: clientX, y: clientY })
  }

  // Make sure only steps are copied.
  const onCopy = useCallback(() => {
    if (selectedNodes.length === 0) return
    if (selectedNodes.some((node) => node.data.type !== 'step')) {
      toast.error(
        'Only steps can be copied. You can not copy start or end nodes.'
      )
      return
    }
    setCopiedNodes(selectedNodes as Node<FlussStepDefault>[])
  }, [selectedNodes])

  /**
   * On paste we transform copied nodes into new nodes.
   * We change all ids, and remove inputs, while keeping the outputs.
   * We also move the nodes to the mouse position.
   * Pasted elements will appear to the bottom and right of mouse position.
   */
  const onPaste = useCallback(() => {
    if (copiedNodes.length === 0) return
    // Use top left corner of all copied nodes as reference.
    const TopLeftCornder = copiedNodes.reduce(
      (acc, node) => {
        const { x, y } = node.position
        return {
          x: Math.min(acc.x, x),
          y: Math.min(acc.y, y),
        }
      },
      { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY }
    )
    // Move all nodes by how far mouse moved from that position.
    const { x: mouseFlowX, y: mouseFlowY } = screenToFlowPosition(mousePosition)
    const movedByX = mouseFlowX - TopLeftCornder.x
    const movedByY = mouseFlowY - TopLeftCornder.y
    const newNodes: Node<FlussStepDefault>[] = copiedNodes.map((node) => {
      const newNodeId = shortId()
      return {
        ...node,
        id: newNodeId,
        position: {
          x: node.position.x + movedByX,
          y: node.position.y + movedByY,
        },
        data: {
          ...node.data,
          id: newNodeId,
          inputs: [],
          outputs: [{ ...node.data.outputs[0], id: newId() }],
        },
      }
    })
    // Deselect all nodes.
    const deselectChanges: NodeChange<FlussNodeType>[] = selectedNodes.map(
      (node) => ({
        id: node.id,
        type: 'select',
        selected: false,
      })
    )
    onNodesChange(deselectChanges)
    // Paste the nodes as ReactFlow changes.
    const changes: NodeChange<FlussNodeType>[] = newNodes.map((node) => ({
      type: 'add',
      item: node,
    }))
    onNodesChange(changes)
  }, [
    copiedNodes,
    mousePosition,
    onNodesChange,
    screenToFlowPosition,
    selectedNodes,
  ])

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveLIstener)
    document.addEventListener('copy', onCopy)
    document.addEventListener('paste', onPaste)

    return () => {
      document.removeEventListener('mousemove', mouseMoveLIstener)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('paste', onPaste)
    }
  }, [onCopy, onPaste])
}
