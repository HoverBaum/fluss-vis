import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const VideoModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Hello World using Fluss Vis</DialogTitle>
        </DialogHeader>

        <iframe
          className="w-full"
          style={{ aspectRatio: '16 / 9' }}
          src="https://www.youtube-nocookie.com/embed/hyBCHvjpNt0?si=lVB4jzmdTeA-tobr"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </DialogContent>
    </Dialog>
  )
}
