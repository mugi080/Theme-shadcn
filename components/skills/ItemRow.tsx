"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ItemRow
// Numbered row with a coloured circle index badge.
// Used inside ColumnCard for skills, recognitions, and memberships.
// ─────────────────────────────────────────────────────────────────────────────

interface ItemRowProps {
  index: number;
  description: string;
  accentColor: string;
}

export default function ItemRow({ index, description, accentColor }: ItemRowProps) {
  return (
    <div
      className="flex items-start gap-3 py-3 border-b border-border last:border-0"
      style={{ animation: `hris-in 0.3s ease ${index * 50}ms both` }}
    >
      <span
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
        style={{ backgroundColor: accentColor }}
      >
        {index + 1}
      </span>
      <p className="text-sm text-foreground leading-snug">{description}</p>
    </div>
  );
}