// components/sections/FeaturesSection.tsx (Updated usage)
"use client";

import {
  Users, FileText, BarChart3, Shield, ClipboardList, Award, ArrowRight,
} from "lucide-react";
import FlipCard from "./Flipcard";
/* Shadcn UI Primitives */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturesSectionProps {
  className?: string;
}

// ─── Features data ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Users,
    title: "Employee Records",
    desc: "Manage complete employee profiles, personal data sheets, and employment history in one secure place.",
    image: "/employeerecord.jpg",
    tag: "Employee Records",
    backTitle: "Your Complete Profile",
    backColor: "bg-primary",
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
    backColor: "bg-cyan-600",
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
    backColor: "bg-violet-600",
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
    backColor: "bg-emerald-600",
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
    backColor: "bg-amber-600",
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
    backColor: "bg-rose-600",
    details: [
      "Fully compliant with the Data Privacy Act of 2012 (RA 10173)",
      "Role-based access control for all HR data",
      "Encrypted data transmission and secure cloud storage",
      "Regular security audits aligned with CSC standards",
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturesSection({ className = "" }: FeaturesSectionProps) {
  return (
    <section id="features" className={`py-20 px-4 sm:px-6 bg-muted/30 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-primary" />
            <Badge variant="secondary" className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary/15 border-0">
              Features
            </Badge>
            <div className="w-8 h-0.5 bg-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Everything You Need
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-muted-foreground">
            A complete HR ecosystem built for city government employees and administrators.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            ✦ Hover any card to see how it helps you
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(feat => (
            <FlipCard
              key={feat.title}
              icon={feat.icon}
              title={feat.title}
              desc={feat.desc}
              image={feat.image}
              tag={feat.tag}
              backTitle={feat.backTitle}
              backColor={feat.backColor}
              details={feat.details}
            />
          ))}
        </div>

        {/* View All Features CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="h-11 px-8 text-sm font-semibold rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            View All Features <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}