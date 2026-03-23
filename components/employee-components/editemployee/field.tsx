// components/Field.tsx
"use client";

import { useState } from "react";

interface FieldProps {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}

export default function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  const isFloated = type === "date" || focused || (value !== "" && value !== null && value !== undefined);

  return (
    <div className={`relative pt-0 mb-1 ${className}`}>
      {/* The input */}
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        className={`
          w-full bg-background text-foreground text-sm outline-none font-inherit
          border border-input rounded-lg
          transition-all duration-150
          placeholder:text-muted-foreground/70
          ${isFloated 
            ? 'pt-[18px] pb-[6px] px-3' 
            : 'py-3 px-3'
          }
          ${focused 
            ? 'border-ring ring-2 ring-ring/20' 
            : ''
          }
        `}
      />

      {/* Floating label */}
      <label
        className={`
          absolute left-3 -translate-y-1/2 pointer-events-none whitespace-nowrap leading-none
          transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isFloated
            ? 'top-0 text-[10px] font-semibold tracking-wide uppercase bg-background px-1 text-muted-foreground'
            : 'top-1/2 text-sm font-normal tracking-normal normal-case bg-transparent text-muted-foreground/80'
          }
          ${focused ? 'text-ring' : ''}
        `}
      >
        {label}
      </label>
    </div>
  );
}