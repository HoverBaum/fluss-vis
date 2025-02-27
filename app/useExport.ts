import { useFlussStore } from '@/stores/FlussStoreProvider'

export const useExport = () => {
  const nodes = useFlussStore((store) => store.nodes)
  const edges = useFlussStore((store) => store.edges)

  const flussExport = () => {
    console.log('exporting…')
    console.log(nodes)
    console.log(edges)
  }
  return {
    flussExport,
  }
}
