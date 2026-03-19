// components/AccordionSection.tsx

import { ChevronDown } from "lucide-react";

interface AccordionSectionProps {
  sectionKey: string;
  label: string;
  Icon: any;
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
      style={{
        border: "1.5px solid #e9eef5",
        borderRadius: 14,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
        boxShadow: isOpen ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        className={`section-btn ${isOpen ? "open" : ""}`}
        style={{ borderBottom: isOpen ? "1.5px solid #f1f5f9" : "none" }}
      >
        <span className={`section-icon bg-gradient-to-br ${gradient}`}>
          <Icon size={17} color="white" />
        </span>
        <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{label}</span>
        <ChevronDown size={17} className={`chevron-icon ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="accordion-body p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}