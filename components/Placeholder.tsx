type PlaceholderProps = {
  className?: string
}
export const Placeholder = ({ className }: PlaceholderProps) => {
  return <div className={`bg-muted rounded-md w-full h-4 ${className}`}></div>
}
