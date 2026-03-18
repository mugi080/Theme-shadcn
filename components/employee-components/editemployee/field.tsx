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

  // Label floats when the field is focused OR has a value
  const isFloated = focused || (value !== "" && value !== null && value !== undefined);

  return (
    <div className={`relative ${className}`} style={{ paddingTop: 0, marginBottom: 4 }}>
      {/* The input */}
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        style={{
          width: "100%",
          background: "#f8fafc",
          border: `1.5px solid ${focused ? "#3b82f6" : "#e2e8f0"}`,
          borderRadius: 10,
          padding: isFloated ? "18px 12px 6px 12px" : "12px 12px",
          fontSize: 14,
          color: "#1e293b",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s, padding 0.15s",
          boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.12)" : "none",
          fontFamily: "inherit",
        }}
      />

      {/* Floating label */}
      <label
        style={{
          position: "absolute",
          left: 12,
          // Floated: sits on top border line; inside: vertically centered
          top: isFloated ? 0 : "50%",
          transform: isFloated ? "translateY(-50%)" : "translateY(-50%)",
          fontSize: isFloated ? 10 : 14,
          fontWeight: isFloated ? 700 : 400,
          color: focused ? "#3b82f6" : isFloated ? "#64748b" : "#94a3b8",
          letterSpacing: isFloated ? "0.06em" : "0",
          textTransform: isFloated ? "uppercase" : "none",
          pointerEvents: "none",
          transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
          // Sit on the border line when floated
          background: isFloated ? "#f8fafc" : "transparent",
          paddingLeft: isFloated ? 4 : 0,
          paddingRight: isFloated ? 4 : 0,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {label}
      </label>
    </div>
  );
}