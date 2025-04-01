type PlaceholderProps = {
  className?: string
}
export const Placeholder = ({ className }: PlaceholderProps) => {
  return <div className={`bg-muted h-4 w-full rounded-md ${className}`}></div>
}
