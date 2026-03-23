"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

// ─────────────────────────────────────────────────────────────────────────────
// AddItemDialog
// Generic single-textarea dialog reused for Skills, Recognitions,
// and Memberships. Owns its own local description + error state.
// ─────────────────────────────────────────────────────────────────────────────

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
  title: string;
  icon: React.ElementType;
  accentColor: string;
  placeholder: string;
}

export default function AddItemDialog({
  open, onClose, onSave, title, icon: Icon, accentColor, placeholder,
}: AddItemDialogProps) {
  const [desc,  setDesc]  = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!desc.trim()) { setError("Description is required."); return; }
    onSave(desc.trim());
    setDesc("");
    setError("");
  };

  const handleClose = () => { setDesc(""); setError(""); onClose(); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#1CA7EC 0%,#1F2F98 100%)" }}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground -mt-1">
          Once saved, this record cannot be edited.
        </p>

        <div className="space-y-1.5 py-1">
          <Label
            htmlFor="add_desc"
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "#1976D2" }}
          >
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="add_desc"
            placeholder={placeholder}
            value={desc}
            onChange={(e) => { setDesc(e.target.value); setError(""); }}
            rows={3}
            className={`text-sm resize-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
              error ? "border-destructive ring-1 ring-destructive/30" : ""
            }`}
          />
          {error && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" className="rounded-xl" onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            className="hris-btn text-white gap-1.5 rounded-xl border-0"
            style={{ backgroundColor: accentColor }}
          >
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}