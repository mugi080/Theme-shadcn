// components/Field.tsx

interface FieldProps {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}

export default function Field({ label, value, onChange, type = "text", className = "" }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#64748b",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      />
    </div>
  );
}