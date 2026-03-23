// components/AccordionSection.tsx
"use client";

import { ChevronDown } from "lucide-react";

interface AccordionSectionProps {
  sectionKey: string;
  label: string;
  Icon: React.ElementType;
  gradient: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function AccordionSection({
  sectionKey,
  label,
  Icon,
  gradient,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <div
      className={`
        border border-border rounded-[14px] overflow-hidden
        transition-shadow duration-200
        ${isOpen ? "shadow-[0_2px_12px_color-mix(in_oklch,var(--foreground)_6%,transparent)]" : "shadow-none"}
        bg-card
      `}
    >
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 px-4 py-3.5
          bg-card hover:bg-muted/40 transition-colors duration-150
          text-left border-none cursor-pointer
          ${isOpen ? "rounded-t-[14px] border-b border-border" : "rounded-[14px]"}
          focus:outline-none focus:ring-2 focus:ring-ring/20
        `}
        aria-expanded={isOpen}
        aria-controls={`section-${sectionKey}`}
      >
        {/* Icon with gradient */}
        <span
          className={`
            w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0
            bg-gradient-to-br ${gradient}
          `}
        >
          <Icon size={17} className="text-white" />
        </span>

        {/* Label */}
        <span className="font-semibold text-sm text-foreground">
          {label}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={17}
          className={`
            ml-auto text-muted-foreground
            transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div
          id={`section-${sectionKey}`}
          className="accordion-body p-4 bg-background/60 animate-accordion-open"
        >
          {children}
        </div>
      )}
    </div>
  );
}