import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useSettingsStore } from '@/stores/SettingsStoreProvider'

export const SettingsDialog = () => {
  const {
    displayIds,
    toggleDisplayIds,
    edgesSelectedToFront,
    toggleEdgesSelectedToFront,
    edgesSelectionAnimated,
    toggleEdgesSelectionAnimated,
    alwaysShowDelete,
    toggleAlwaysShowDelete,
    showExampleOverwriteWarning,
    setShowExampleOverwriteWarning,
    overviewZoomThreshold,
    setOverviewZoomThreshold,
  } = useSettingsStore((store) => store)
  const isOpen = useSettingsStore((state) => state.settingsDialogOpen)
  const setSettingsDialogOpen = useSettingsStore(
    (state) => state.setSettingsDialogOpen
  )

  return (
    <Dialog open={isOpen} onOpenChange={setSettingsDialogOpen}>
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

        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="zoom">Zoom</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-2">
            <div className="flex flex-row items-center justify-between gap-2 p-4">
              <div>
                <Label className="text-base font-bold">Display ID</Label>
                <div>
                  <small>Displays a Steps ID in the top right corner.</small>
                </div>
              </div>

              <Switch checked={displayIds} onCheckedChange={toggleDisplayIds} />
            </div>

            <hr />

            <div className="flex flex-row items-center justify-between gap-2 p-4">
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
                checked={edgesSelectedToFront}
                onCheckedChange={toggleEdgesSelectedToFront}
              />
            </div>

            <hr />

            <div className="flex flex-row items-center justify-between gap-2 p-4">
              <div>
                <Label className="text-base font-bold">
                  Animate selected Edges
                </Label>
                <div>
                  <small>
                    Edges will be animated upon selection to visualize data flow
                    direction.
                  </small>
                </div>
              </div>

              <Switch
                checked={edgesSelectionAnimated}
                onCheckedChange={toggleEdgesSelectionAnimated}
              />
            </div>

            <hr />

            <div className="flex flex-row items-center justify-between gap-2 p-4">
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
          </TabsContent>

          <TabsContent value="zoom" className="mt-2">
            <div className="flex flex-col gap-2 p-4">
              <div>
                <Label className="text-base font-bold">
                  Overview mode zoom threshold
                </Label>
                <div>
                  <small>
                    Switch to overview when zoom is at or below this value. Range
                    0.3–1.0.
                  </small>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-full">
                  <Slider
                    min={0.3}
                    max={1}
                    step={0.05}
                    value={[overviewZoomThreshold]}
                    onValueChange={(vals) => {
                      const next = Array.isArray(vals) ? vals[0] : Number(vals)
                      if (Number.isFinite(next)) setOverviewZoomThreshold(next)
                    }}
                  />
                </div>

              </div>
              <Input
                type="number"
                inputMode="decimal"
                min={0.3}
                max={1}
                step={0.05}
                className="w-20 text-right"
                value={Number.isFinite(overviewZoomThreshold) ? overviewZoomThreshold : 0.6}
                onChange={(e) => {
                  const next = parseFloat(e.target.value)
                  if (Number.isFinite(next)) setOverviewZoomThreshold(next)
                }}
              />

            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-2">
            <div className="flex flex-row items-center justify-between gap-2 p-4">
              <div>
                <Label className="text-base font-bold">
                  Example overwrite warning
                </Label>
                <div>
                  <small>
                    Show a warning that loading an example will overwrite the
                    editor.
                  </small>
                </div>
              </div>

              <Switch
                checked={showExampleOverwriteWarning}
                onCheckedChange={() =>
                  setShowExampleOverwriteWarning(!showExampleOverwriteWarning)
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent >
    </Dialog >
  )
}
