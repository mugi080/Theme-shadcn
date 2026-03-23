"use client";

import {
  Users, FileText, BarChart3, Shield, ClipboardList, Award,
} from "lucide-react";
import FlipCard from "./Flipcard";
import { Theme, ACCENT } from "@/lib/constants";

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturesSectionProps {
  t: Theme;
}

// ─── Features data ────────────────────────────────────────────────────────────
// Defined locally so icon components are real Lucide components, not strings.
// constants.ts keeps iconKey strings for non-React contexts (server, tests).

const FEATURES = [
  {
    icon: Users,
    title: "Employee Records",
    desc: "Manage complete employee profiles, personal data sheets, and employment history in one secure place.",
    image: "/employeerecord.jpg",
    tag: "Employee Records",
    backTitle: "Your Complete Profile",
    backColor: "#1565C0",
    details: [
      "View & update your Personal Data Sheet (CS Form 212)",
      "Access your full employment history and appointments",
      "Manage government IDs, eligibilities, and education records",
      "Update family background and character references",
    ],
  },
  {
    icon: ClipboardList,
    title: "Leave Forms",
    desc: "File and track leave requests, approvals, and balances with automated workflows.",
    image: "/leave.jpg",
    tag: "Leave Management",
    backTitle: "Hassle-Free Leave Filing",
    backColor: "#1565C0",
    details: [
      "File vacation, sick, maternity, and other leave types online",
      "Track real-time approval status of your requests",
      "View remaining leave balance per leave type",
      "Receive notifications on approvals or rejections instantly",
    ],
  },
  {
    icon: BarChart3,
    title: "Real-Time Attendance",
    desc: "Monitor daily attendance, tardiness, and absences with live dashboard updates.",
    image: "/Attendance.jpg",
    tag: "Attendance Tracking",
    backTitle: "Always Know Your Status",
    backColor: "#1565C0",
    details: [
      "View your daily time-in and time-out records",
      "Monitor tardiness, absences, and undertime at a glance",
      "Access monthly attendance summary and DTR reports",
      "Biometric integration for accurate real-time tracking",
    ],
  },
  {
    icon: Award,
    title: "Payroll",
    desc: "Automated payroll computation with deductions, allowances, and payslip generation.",
    image: "/payroll.jpg",
    tag: "Payroll System",
    backTitle: "Transparent Pay Management",
    backColor: "#1565C0",
    details: [
      "View detailed payslips with all deductions and allowances",
      "Track GSIS, PhilHealth, and Pag-IBIG contributions",
      "Access historical payroll records anytime",
      "Automated 13th month pay and year-end benefit computation",
    ],
  },
  {
    icon: FileText,
    title: "Loans & Benefits",
    desc: "Track employee loans, GSIS, Pag-IBIG, and government benefit applications in one place.",
    image: "/loan.jpg",
    tag: "Loans & Benefits",
    backTitle: "Benefits at Your Fingertips",
    backColor: "#1565C0",
    details: [
      "Monitor outstanding GSIS and Pag-IBIG loan balances",
      "Apply for government loans directly through the portal",
      "Track monthly amortization and remaining loan terms",
      "View all benefit entitlements and availment history",
    ],
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    desc: "Built with government data privacy standards and CSC compliance requirements in mind.",
    image: "/securecomp.jpg",
    tag: "Secure & Compliant",
    backTitle: "Your Data Is Protected",
    backColor: "#1565C0",
    details: [
      "Fully compliant with the Data Privacy Act of 2012 (RA 10173)",
      "Role-based access control for all HR data",
      "Encrypted data transmission and secure cloud storage",
      "Regular security audits aligned with CSC standards",
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeaturesSection({ t }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-20 px-4 sm:px-6" style={{ backgroundColor: t.bg }}>

      {/* Flip card CSS — scoped here, consumed by FlipCard class names */}
      <style>{`
        .flip-card { perspective: 1400px; cursor: default; }
        .flip-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.4,0.2,0.2,1);
        }
        .flip-card:hover .flip-inner { transform: rotateY(180deg); }
        .flip-front, .flip-back {
          position: absolute; width: 100%; height: 100%;
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
          border-radius: 1rem; overflow: hidden;
        }
        .flip-back  { transform: rotateY(180deg); }
        .flip-img   { transition: transform 0.75s ease; }
        .flip-card:hover .flip-img  { transform: scale(1.07); }
        .flip-hint  { opacity: 0.85; transition: opacity 0.3s; }
        .flip-card:hover .flip-hint { opacity: 0; pointer-events: none; }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-0.5" style={{ backgroundColor: ACCENT }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              Features
            </span>
            <div className="w-8 h-0.5" style={{ backgroundColor: ACCENT }} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black" style={{ color: t.text }}>
            Everything You Need
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base" style={{ color: t.muted }}>
            A complete HR ecosystem built for city government employees and administrators.
          </p>
          <p className="mt-2 text-xs" style={{ color: t.muted }}>
            ✦ Hover any card to see how it helps you
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(feat => (
            <FlipCard
              key={feat.title}
              icon={feat.icon}       // ← real Lucide component, never undefined
              title={feat.title}
              desc={feat.desc}
              image={feat.image}
              tag={feat.tag}
              backTitle={feat.backTitle}
              backColor={feat.backColor}
              details={feat.details}
              t={t}
              accent={ACCENT}
            />
          ))}
        </div>

      </div>
    </section>
  );
}