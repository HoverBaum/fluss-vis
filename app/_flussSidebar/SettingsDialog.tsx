import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { useSettingsStore } from '@/stores/SettingsStoreProvider'

import { Settings } from 'lucide-react'

export const SettingsDialog = () => {
  const {
    displayIds,
    toggleDisplayIds,
    bringSelectedEdgesToFront,
    toggleBringSelectedEdgesToFront,
    alwaysShowDelete,
    toggleAlwaysShowDelete,
  } = useSettingsStore((store) => store)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="flex items-center gap-2 w-full">
          <Settings size="1rem" /> Editor Settings
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editor Settings</DialogTitle>
          <DialogDescription>
            Decide how the editor should behave.
            <br />
            These settings are local to you and will not be saved or exported
            with the Fluss.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex flex-row items-center justify-between p-4">
            <div>
              <Label className="text-base font-bold">Display ID</Label>
              <div>
                <small>Displays a Steps ID in the top right corner.</small>
              </div>
            </div>

            <Switch checked={displayIds} onCheckedChange={toggleDisplayIds} />
          </div>

          <hr />

          <div className="flex flex-row items-center justify-between p-4">
            <div>
              <Label className="text-base font-bold">
                Selected Edges To Front
              </Label>
              <div>
                <small>
                  Brings Edges to the front when they or a connected Step are
                  selected.
                </small>
              </div>
            </div>

            <Switch
              checked={bringSelectedEdgesToFront}
              onCheckedChange={toggleBringSelectedEdgesToFront}
            />
          </div>

          <hr />

          <div className="flex flex-row items-center justify-between p-4">
            <div>
              <Label className="text-base font-bold">Always show delete</Label>
              <div>
                <small>Permanently shows delete buttons for Inputs.</small>
              </div>
            </div>

            <Switch
              checked={alwaysShowDelete}
              onCheckedChange={toggleAlwaysShowDelete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
