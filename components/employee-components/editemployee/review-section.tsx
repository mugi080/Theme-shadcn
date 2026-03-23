"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // Optional: If you have badge component
import { ScrollArea } from "@/components/ui/scroll-area"

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
    const changes = keys.filter((key) => {
      const oldValue = oldData?.[key]
      const newValue = newData?.[key]
      return JSON.stringify(oldValue) !== JSON.stringify(newValue)
    })

    if (changes.length === 0) {
      return (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          No changes detected.
        </div>
      )
    }

    return changes.map((key) => {
      const oldValue = oldData?.[key]
      const newValue = newData?.[key]

      return (
        <div key={key} className="group rounded-lg border border-border bg-card overflow-hidden">
          {/* Field Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
            <span className="font-semibold text-sm text-foreground capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <Badge variant="outline" className="text-xs">Modified</Badge>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            
            {/* Old Value Column */}
            <div className="p-4 bg-destructive/5 space-y-2">
              <div className="text-xs font-medium text-destructive uppercase tracking-wider">
                Previous Value
              </div>
              <div className="relative">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all font-mono bg-background/50 p-3 rounded-md border border-destructive/10 max-h-40 overflow-y-auto">
                  {JSON.stringify(oldValue, null, 2)}
                </pre>
              </div>
            </div>

            {/* New Value Column */}
            <div className="p-4 bg-primary/5 space-y-2">
              <div className="text-xs font-medium text-primary uppercase tracking-wider">
                New Value
              </div>
              <div className="relative">
                <pre className="text-xs text-foreground whitespace-pre-wrap break-all font-mono bg-background/50 p-3 rounded-md border border-primary/10 max-h-40 overflow-y-auto">
                  {JSON.stringify(newValue, null, 2)}
                </pre>
              </div>
            </div>

          </div>
        </div>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      {/* 
         CRITICAL FIX: 
         1. 'flex flex-col' ensures footer stays at bottom.
         2. 'h-[90vh]' limits dialog height to viewport.
         3. 'overflow-hidden' prevents double scrollbars.
      */}
      <DialogContent className="flex flex-col h-[90vh] max-w-4xl p-0 gap-0 bg-card text-card-foreground border-border">
        
        {/* Header - Fixed */}
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-lg font-semibold">Review Changes</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Please verify the following modifications before submitting.
          </p>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-full w-full pr-4">
            <div className="space-y-4">
              {renderChanges()}
            </div>
          </ScrollArea>
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/20 shrink-0">
          <Button variant="outline" onClick={onCancel} className="border-border">
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