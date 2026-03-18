"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Props {
  open: boolean
  oldData: any
  newData: any
  onCancel: () => void
  onConfirm: () => void
}

export default function ReviewChanges({
  open,
  oldData,
  newData,
  onCancel,
  onConfirm,
}: Props) {

  const renderChanges = () => {
    if (!oldData || !newData) return null

    const keys = Object.keys(newData)

    return keys.map((key) => {
      const oldValue = oldData?.[key]
      const newValue = newData?.[key]

      const isChanged =
        JSON.stringify(oldValue) !== JSON.stringify(newValue)

      if (!isChanged) return null

      return (
        <Card key={key} className="p-4 space-y-2">
          <div className="font-semibold text-sm">
            {key}
          </div>

          <div className="text-xs space-y-1">
            <div>
              <span className="text-red-600 font-medium">
                Old:
              </span>
              <pre className="whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(oldValue, null, 2)}
              </pre>
            </div>

            <div>
              <span className="text-green-600 font-medium">
                New:
              </span>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(newValue, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Changes</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {renderChanges()}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onConfirm}>
            Confirm & Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}