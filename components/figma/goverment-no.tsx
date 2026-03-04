"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type GovernmentData = {
  umid: string
  pagibig: string
  philhealth: string
  psn: string
  tin: string
  employeeNo: string
}

export function GovernmentIds() {
  const [open, setOpen] = useState(false)

  const [data, setData] = useState<GovernmentData>({
    umid: "",
    pagibig: "",
    philhealth: "",
    psn: "",
    tin: "",
    employeeNo: "",
  })

  const [form, setForm] = useState<GovernmentData>(data)
  const [error, setError] = useState("")

  const handleSave = () => {
    const hasEmpty = Object.values(form).some((value) => !value.trim())

    if (hasEmpty) {
      setError("Please complete all fields before saving.")
      return
    }

    setData(form)
    setError("")
    setOpen(false)
  }

  return (
    <Card className="shadow-lg border border-border rounded-2xl p-6 md:p-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          Government Identification Numbers
        </CardTitle>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setForm(data)}
            >
              Edit
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Government IDs</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>UMID ID No.</Label>
                <Input
                  value={form.umid}
                  onChange={(e) =>
                    setForm({ ...form, umid: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>PAG-IBIG ID No.</Label>
                <Input
                  value={form.pagibig}
                  onChange={(e) =>
                    setForm({ ...form, pagibig: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>PHILHEALTH No.</Label>
                <Input
                  value={form.philhealth}
                  onChange={(e) =>
                    setForm({ ...form, philhealth: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>PhilSys Number (PSN)</Label>
                <Input
                  value={form.psn}
                  onChange={(e) =>
                    setForm({ ...form, psn: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>TIN No.</Label>
                <Input
                  value={form.tin}
                  onChange={(e) =>
                    setForm({ ...form, tin: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Agency Employee No.</Label>
                <Input
                  value={form.employeeNo}
                  onChange={(e) =>
                    setForm({ ...form, employeeNo: e.target.value })
                  }
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button onClick={handleSave}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <DisplayRow label="UMID ID No." value={data.umid} />
        <DisplayRow label="PAG-IBIG ID No." value={data.pagibig} />
        <DisplayRow label="PHILHEALTH No." value={data.philhealth} />
        <DisplayRow label="PhilSys Number (PSN)" value={data.psn} />
        <DisplayRow label="TIN No." value={data.tin} />
        <DisplayRow label="Agency Employee No." value={data.employeeNo} />
      </CardContent>
    </Card>
  )
}

function DisplayRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">
        {value || "—"}
      </span>
    </div>
  )
}