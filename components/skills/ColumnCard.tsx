"use client";

import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ─────────────────────────────────────────────────────────────────────────────
// ColumnCard
// Reusable card shell for Skills / Recognitions / Memberships.
// Renders a circle icon, title, subtitle, count pill, scrollable list,
// and a footer note. Uses .hris-btn for the Add button gradient.
// ─────────────────────────────────────────────────────────────────────────────

interface ColumnCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  accentColor: string;
  count: number;
  onAdd: () => void;
  children: React.ReactNode;
  animDelay?: number;
}

export default function ColumnCard({
  icon: Icon, title, subtitle, accentColor, count, onAdd, children, animDelay = 0,
}: ColumnCardProps) {
  return (
    <Card
      className="border-0 shadow-md rounded-2xl flex flex-col h-full overflow-hidden bg-white"
      style={{ animation: `hris-in 0.45s ease ${animDelay}ms both` }}
    >
      <CardContent className="px-6 pt-6 pb-0 flex-shrink-0">

        {/* Circle icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-5"
          style={{ backgroundColor: accentColor }}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Title + Add button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <Button
            size="sm"
            onClick={onAdd}
            className="hris-btn h-7 gap-1 text-xs text-white flex-shrink-0 rounded-full px-3 border-0"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-1">{subtitle}</p>

        {/* Count pill */}
        <div className="flex items-center gap-2 mt-2 mb-4">
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              border: `1px solid ${accentColor}35`,
            }}
          >
            {count} {count === 1 ? "record" : "records"}
          </span>
        </div>
      </CardContent>

      <Separator />

      {/* Scrollable list */}
      <CardContent className="px-6 py-0 flex-1 overflow-y-auto max-h-[360px]">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#EEF3FA 0%,#DAEAF8 100%)",
                border: "1px solid #B3D1F0",
                animation: "hris-float 3s ease-in-out infinite",
              }}
            >
              <Icon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <p className="text-xs text-muted-foreground">No records yet. Click <strong>Add</strong>.</p>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </CardContent>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground italic">Saved records cannot be edited.</p>
      </div>
    </Card>
  );
}