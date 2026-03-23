"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Users, FileText, BarChart3, Shield, Bell, ChevronRight,
  Calendar, Megaphone, ArrowRight, Menu, X, Building2,
  ClipboardList, Award, Clock, MapPin, ChevronDown, Sun, Moon
} from "lucide-react";
import { ModeToggle } from "@/components/layout/toggle-mode";

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const LIGHT = {
  bg:           "#ffffff",
  heroBg:       "linear-gradient(135deg, #EEF3FA 0%, #DAEAF8 50%, #EEF3FA 100%)",
  announceBg:   "#EEF3FA",
  navBg:        "rgba(255,255,255,0.93)",
  navBorder:    "#e2e8f0",
  cardBg:       "#ffffff",
  cardBorder:   "#e2e8f0",
  cardRowHover: "#f1f5f9",
  cardRowBase:  "#f8fafc",
  text:         "#0f172a",
  muted:        "#64748b",
  sep:          "#e2e8f0",
  toggleBg:     "#EEF3FA",
  toggleColor:  "#1976D2",
  menuBg:       "#ffffff",
};

const DARK = {
  bg:           "#0f172a",
  heroBg:       "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  announceBg:   "#1e293b",
  navBg:        "rgba(15,23,42,0.95)",
  navBorder:    "#334155",
  cardBg:       "#1e293b",
  cardBorder:   "#334155",
  cardRowHover: "#334155",
  cardRowBase:  "#0f172a",
  text:         "#f1f5f9",
  muted:        "#94a3b8",
  sep:          "#334155",
  toggleBg:     "#334155",
  toggleColor:  "#fbbf24",
  menuBg:       "#1e293b",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

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

const ANNOUNCEMENTS = [
  {
    id: 1, category: "HR Advisory", badge: "New", badgeColor: "#1565C0", date: "June 10, 2026",
    title: "Submission of Updated Personal Data Sheet (CS Form 212)",
    body: "All city government employees are hereby directed to submit an updated CS Form 212 to the Human Resource Management Office on or before June 30, 2025. Failure to comply may affect the processing of your benefits and salary adjustments.",
    author: "City Human Resource Management Office",
  },
  {
    id: 2, category: "Memorandum", badge: "Urgent", badgeColor: "#1565C0", date: "June 5, 2026",
    title: "Mandatory Anti-Sexual Harassment Seminar for All City Employees",
    body: "Pursuant to Republic Act No. 7877, all city government employees are required to attend the scheduled Anti-Sexual Harassment Seminar. Schedule and venue will be announced per department through the HRIS portal.",
    author: "Office of the City Mayor",
  },
  {
    id: 3, category: "General Announcement", badge: "Open", badgeColor: "#1565C0", date: "May 28, 2026",
    title: "Job Vacancy: Administrative Officer II (Human Resource)",
    body: "The City Government is accepting applications for the position of Administrative Officer II in the HRMO. Interested and qualified applicants must submit complete documentary requirements to the HRMO not later than June 20, 2025.",
    author: "City Human Resource Management Office",
  },
  {
    id: 4, category: "Wellness Program", badge: "Upcoming", badgeColor: "#1565C0", date: "May 20, 2027",
    title: "Annual Medical and Dental Mission for City Employees",
    body: "The City Health Office, in partnership with the HRMO, will conduct its Annual Medical and Dental Mission for all permanent and casual city employees. Registration is now open through the HRIS Employee Portal.",
    author: "City Health Office",
  },
];

const STATS = [
  { value: "2,400+", label: "City Employees" },
  { value: "38",     label: "Departments" },
  { value: "99.8%",  label: "Data Accuracy" },
  { value: "24/7",   label: "Portal Access" },
];


// ─── CTASection Component — scroll-triggered slow text reveal ────────────────

function CTASection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 text-white relative overflow-hidden"
      style={{ backgroundColor: "#1565C0" }}
    >
      <style>{`
        /* Dot grid background */
        .cta-dots {
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)";
          backgroundSize: "60px 60px";
        }

        /* ── Reveal keyframes ── */
        @keyframes cta-reveal-up {
          0%   { opacity: 0; transform: translateY(32px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        @keyframes cta-reveal-scale {
          0%   { opacity: 0; transform: scale(0.75) translateY(16px); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1)    translateY(0);    filter: blur(0);   }
        }
        @keyframes cta-reveal-btn {
          0%   { opacity: 0; transform: translateY(24px) scale(0.88); }
          60%  { transform: translateY(-4px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cta-line-grow {
          0%   { width: 0; opacity: 0; }
          100% { width: 80px; opacity: 1; }
        }
        @keyframes cta-word-pop {
          0%   { opacity: 0; transform: translateY(20px) rotateX(40deg); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0)    rotateX(0deg);  filter: blur(0); }
        }

        /* Hidden state */
        .cta-el { opacity: 0; }

        /* Triggered state — each element gets its own delay */
        .cta-visible .cta-logo  {
          animation: cta-reveal-scale 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s forwards;
        }
        .cta-visible .cta-line  {
          animation: cta-line-grow 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
        }
        .cta-visible .cta-h2    {
          animation: cta-reveal-up 0.9s cubic-bezier(0.4,0,0.2,1) 0.4s forwards;
        }
        .cta-visible .cta-p     {
          animation: cta-reveal-up 0.9s cubic-bezier(0.4,0,0.2,1) 0.65s forwards;
        }
        .cta-visible .cta-btn-1 {
          animation: cta-reveal-btn 0.7s cubic-bezier(0.4,0,0.2,1) 0.90s forwards;
        }
        .cta-visible .cta-btn-2 {
          animation: cta-reveal-btn 0.7s cubic-bezier(0.4,0,0.2,1) 1.10s forwards;
        }

        /* Shimmer on h2 after it appears */
        @keyframes cta-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .cta-shimmer {
          background: linear-gradient(90deg, #ffffff 0%, #93c5fd 35%, #ffffff 55%, #bfdbfe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: cta-shimmer 5s linear 1.5s infinite;
        }

        /* Pulse ring on logo */
        @keyframes cta-ring-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0;   }
        }
        .cta-ring {
          animation: cta-ring-pulse 2s ease-out 1s infinite;
        }
      `}</style>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* All animated content */}
      <div className={`relative max-w-4xl mx-auto text-center space-y-6 ${inView ? "cta-visible" : ""}`}>

        {/* Logo with pulse ring */}
        <div className="cta-el cta-logo relative inline-flex items-center justify-center mx-auto">
          <div className="cta-ring absolute w-14 h-14 rounded-2xl border-2 border-white/60" />
          <img src="/image6.png" alt="Logo"
            className="w-14 h-14 object-contain rounded-2xl shadow-xl relative z-10" />
        </div>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3">
          <div className="cta-el cta-line h-0.5 rounded-full bg-blue-300" style={{ width: 0 }} />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300">City Government HRIS</span>
          <div className="cta-el cta-line h-0.5 rounded-full bg-blue-300" style={{ width: 0 }} />
        </div>

        {/* Heading */}
        <h2 className="cta-el cta-h2 cta-shimmer text-3xl sm:text-4xl font-black leading-tight">
          Ready to Get Started?
        </h2>

        {/* Body */}
        <p className="cta-el cta-p text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Join the City Government's digital HR transformation. Access your employee profile,
          submit requests, and stay informed — all from one secure portal.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Button size="lg"
            className="cta-el cta-btn-1 hris-btn h-11 px-8 text-sm font-bold rounded-lg text-white border-0 transition-all"
            style={{ backgroundColor: "#1976D2", boxShadow: "0 0 0 2px white" }}>
            Login
          </Button>
          <Button size="lg" variant="outline"
            className="cta-el cta-btn-2 hris-btn h-11 px-8 text-sm font-bold rounded-lg border-2 border-white text-white bg-transparent transition-all">
            Learn More
          </Button>
        </div>

      </div>
    </section>
  );
}

// ─── AnnouncementSlideshow Component — infinite rolling marquee ───────────────

function AnnouncementSlideshow({
  announcements, accent, cardBg, cardBorder, textColor, mutedColor, announceBg,
}: {
  announcements: typeof ANNOUNCEMENTS;
  accent: string; cardBg: string; cardBorder: string;
  textColor: string; mutedColor: string; announceBg: string;
}) {
  const [paused, setPaused] = useState(false);
  const items = [...announcements, ...announcements, ...announcements];

  return (
    <div className="relative">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marquee-scroll 22s linear infinite;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }
        .marquee-card {
          width: 380px;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .marquee-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }
        .marquee-fade-left {
          background: linear-gradient(to right, var(--fade-color) 0%, transparent 100%);
        }
        .marquee-fade-right {
          background: linear-gradient(to left, var(--fade-color) 0%, transparent 100%);
        }
      `}</style>

      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ "--fade-color": announceBg } as React.CSSProperties}
      >
        <div className="marquee-fade-left pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20" />
        <div className="marquee-fade-right pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20" />
        <div
          className={`marquee-track${paused ? " paused" : ""}`}
          style={{ padding: "8px 0 16px" }}
          onClick={() => setPaused(v => !v)}
        >
          {items.map((ann, idx) => (
            <div key={idx} className="marquee-card">
              <div
                className="rounded-2xl overflow-hidden shadow-md h-full flex flex-col"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: ann.badgeColor }} />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: ann.badgeColor }}>
                        {ann.badge}
                      </span>
                      <span className="text-[10px] font-semibold" style={{ color: mutedColor }}>
                        {ann.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: mutedColor }}>
                      <Calendar className="w-3 h-3" />{ann.date}
                    </div>
                  </div>
                  <h3 className="text-sm font-black leading-snug line-clamp-2" style={{ color: textColor }}>
                    {ann.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: mutedColor }}>
                    {ann.body}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] min-w-0" style={{ color: mutedColor }}>
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{ann.author}</span>
                    </div>
                    <span className="hris-btn hris-btn-soft text-[10px] font-bold flex items-center gap-0.5 flex-shrink-0 px-2 py-0.5 rounded-md"
                      style={{ color: accent }}>
                      Read more <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <div
          className="hris-btn flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
          style={{
            backgroundColor: paused ? accent : "transparent",
            color: paused ? "#fff" : mutedColor,
            border: `1px solid ${paused ? accent : cardBorder}`,
          }}
          onClick={() => setPaused(v => !v)}
        >
          {paused ? (
            <><ArrowRight className="w-3 h-3" /> Resume scrolling</>
          ) : (
            <><span className="w-3 h-3 flex items-center justify-center font-black text-[10px]">⏸</span> Click any card to pause</>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FlipCard Component — pure CSS hover flip ─────────────────────────────────

function FlipCard({
  icon: Icon, title, desc, image, tag,
  backTitle, backColor, details,
  cardBg, cardBorder, accent, textColor, mutedColor,
}: {
  icon: React.ElementType; title: string; desc: string;
  image: string | null; tag: string | null;
  backTitle: string; backColor: string; details: string[];
  cardBg: string; cardBorder: string; accent: string;
  textColor: string; mutedColor: string;
}) {
  return (
    <div className="flip-card" style={{ height: "380px" }}>
      <div className="flip-inner" style={{ height: "100%" }}>
        <div className="flip-front flex flex-col shadow-md hover:shadow-xl"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            {image ? (
              <>
                <img src={image} alt={title} className="flip-img w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                {tag && (
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: "rgba(25,118,210,0.85)" }}>
                    {tag}
                  </span>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EEF3FA 0%, #DAEAF8 100%)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: accent }}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            )}
            <div className="flip-hint absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold"
              style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
              </svg>
              <span>Hover to flip</span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: accent }}>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold" style={{ color: textColor }}>{title}</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: mutedColor }}>{desc}</p>
            <div className="mt-auto pt-1 flex items-center gap-1 text-[10px] font-semibold" style={{ color: accent }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
              </svg>
              Hover to see how this helps you
            </div>
          </div>
        </div>

        <div className="flip-back flex flex-col text-white"
          style={{ background: `linear-gradient(145deg, ${backColor} 0%, #0a0f2e 100%)` }}>
          <div className="px-5 pt-5 pb-4 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                style={{ color: "rgba(255,255,255,0.6)" }}>How it helps you</p>
              <h3 className="text-sm font-black leading-tight">{backTitle}</h3>
            </div>
          </div>
          <div className="px-5 py-4 flex-1 flex flex-col gap-3 overflow-hidden">
            {details.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", minWidth: "20px" }}>
                  {i + 1}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>{d}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4 pt-2 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-[9px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Move cursor away to flip back
            </span>
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}>
              ✦ {tag ?? title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HRISLandingPage() {
  const [dark, setDark] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const t = dark ? DARK : LIGHT;

  return (
    <div
      style={{
        backgroundColor: t.bg,
        color: t.text,
        transition: "background-color .3s, color .3s",
        minHeight: "100vh",
      }}
    >
      {/* Global styles injected once */}
      <style>{GLOBAL_STYLES}</style>

      {/* ── Layout shell ── */}
      <Navbar dark={dark} onToggleDark={() => setDark(v => !v)} t={t} />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm"
        style={{ backgroundColor: t.navBg, borderBottom: `1px solid ${t.navBorder}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/image6.png" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
            <div className="leading-tight">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>City Government</p>
              <p className="text-sm font-bold" style={{ color: t.text }}>HRIS Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["Home", "Announcements", "Features", "About"].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="hris-btn-soft text-sm font-medium transition-all px-2 py-1 rounded-md"
                style={{ color: t.muted }}>
                {link}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">          
            <button
              onClick={() => setDark(v => !v)}
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="hris-btn-icon w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Button variant="outline" size="sm"
              className="hris-btn h-8 text-xs"
              style={{ borderColor: accent, color: accent, backgroundColor: "transparent" }}>
              Employee Login
            </Button>
   
          </div>
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setDark(v => !v)}
              className="hris-btn-icon w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="hris-btn-icon p-2" style={{ color: t.text }} onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 py-4 space-y-3"
            style={{ backgroundColor: t.menuBg, borderTop: `1px solid ${t.sep}` }}>
            {["Home", "Announcements", "Features", "About"].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="block text-sm font-medium py-1"
                style={{ color: t.muted }}
                onClick={() => setMenuOpen(false)}>
                {link}
              </a>
            ))}
            <div style={{ height: 1, backgroundColor: t.sep }} />
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="hris-btn flex-1 text-xs" style={{ borderColor: accent, color: accent }}>Login</Button>
              
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
        style={{ background: t.heroBg }}>
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #1976D2, transparent)", transform: "translate(30%, -20%)" }} />
        <div className="absolute bottom-10 left-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #1565C0, transparent)", transform: "translate(-30%, 20%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className={`flex-1 space-y-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                City Government HRIS
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight" style={{ color: t.text }}>
              One Portal.<br />
              <span style={{ color: accent }}>All Your HR</span><br />
              Needs.
            </h1>
            <p className="text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: t.muted }}>
              The official Human Resource Information System for City Government employees.
              Access your records, manage requests, and stay updated — all in one secure place.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="hris-btn h-11 px-6 text-sm font-semibold text-white gap-2"
                style={{ backgroundColor: accent }}>
                Access Employee Portal <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline"
                className="hris-btn h-11 px-6 text-sm font-semibold gap-2"
                style={{ borderColor: accent, color: accent, backgroundColor: "transparent" }}>
                View Announcements <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black" style={{ color: accent }}>{s.value}</p>
                  <p className="text-xs font-medium" style={{ color: t.muted }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right preview card */}
          <div className={`flex-1 flex justify-center transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative w-full max-w-sm">
              <style>{`
                @keyframes ticker-up {
                  0%   { transform: translateY(0); }
                  100% { transform: translateY(-50%); }
                }
                .preview-ticker { animation: ticker-up 8s linear infinite; }
                .preview-ticker:hover { animation-play-state: paused; }
                .preview-ticker-row { transition: background-color 0.2s ease, transform 0.2s ease; }
                .preview-ticker-row:hover { transform: translateX(4px); box-shadow: -3px 0 0 0 #1CA7EC; }
              `}</style>
              <div className="rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: t.muted }}>Welcome to</p>
                      <p className="text-base font-black" style={{ color: t.text }}>City HRIS Portal</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#22c55e" }} />
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#22c55e" }} />
                      </span>
                      <span className="text-[10px] font-bold" style={{ color: "#22c55e" }}>LIVE</span>
                    </div>
                  </div>
                  <div style={{ height: 1, backgroundColor: t.sep }} className="mb-4" />
                  <div className="relative overflow-hidden" style={{ height: "252px" }}>
                    <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-8"
                      style={{ background: `linear-gradient(to bottom, ${t.cardBg}, transparent)` }} />
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8"
                      style={{ background: `linear-gradient(to top, ${t.cardBg}, transparent)` }} />
                    <div className="preview-ticker space-y-2">
                      {[
                        { icon: FileText,      label: "Personal Data Sheet", sub: "CS Form 212 — Updated",  color: "#1565C0" },
                        { icon: Calendar,      label: "Leave Application",   sub: "3 pending requests",     color: "#1565C0" },
                        { icon: Bell,          label: "Announcements",       sub: "4 new city advisories",  color: "#1565C0" },
                        { icon: Clock,         label: "Service Record",      sub: "Complete history",       color: "#1565C0" },
                        { icon: Users,         label: "Employee Records",    sub: "Profile up to date",     color: "#1565C0" },
                        { icon: ClipboardList, label: "Leave Balance",       sub: "15 vacation days left",  color: "#1565C0" },
                        { icon: Award,         label: "Eligibility",         sub: "CS Prof — Passed",       color: "#1565C0" },
                        { icon: BarChart3,     label: "Attendance",          sub: "No absences this month", color: "#1565C0" },
                        { icon: FileText,      label: "Personal Data Sheet", sub: "CS Form 212 — Updated",  color: "#1565C0" },
                        { icon: Calendar,      label: "Leave Application",   sub: "3 pending requests",     color: "#1565C0" },
                        { icon: Bell,          label: "Announcements",       sub: "4 new city advisories",  color: "#1565C0" },
                        { icon: Clock,         label: "Service Record",      sub: "Complete history",       color: "#1565C0" },
                        { icon: Users,         label: "Employee Records",    sub: "Profile up to date",     color: "#1565C0" },
                        { icon: ClipboardList, label: "Leave Balance",       sub: "15 vacation days left",  color: "#1565C0" },
                        { icon: Award,         label: "Eligibility",         sub: "CS Prof — Passed",       color: "#1565C0" },
                        { icon: BarChart3,     label: "Attendance",          sub: "No absences this month", color: "#1565C0" },
                      ].map(({ icon: Icon, label, sub, color }, i) => (
                        <div key={i}
                          className="preview-ticker-row flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                          style={{ backgroundColor: t.cardRowBase, borderLeft: `3px solid ${color}` }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.cardRowHover)}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.cardRowBase)}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: color }}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold" style={{ color: t.text }}>{label}</p>
                            <p className="text-xs truncate" style={{ color: t.muted }}>{sub}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: t.muted }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: `1px solid ${t.sep}` }}>
                    <span className="text-[10px]" style={{ color: t.muted }}>Hover to pause</span>
                    <div className="px-3 py-1 rounded-full text-[10px] font-black text-white"
                      style={{ background: "linear-gradient(135deg,#1CA7EC,#1F2F98)" }}>
                      ✓ CSC Compliant
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 shadow-lg rounded-2xl overflow-hidden z-10">
                <div className="px-4 py-3 text-white text-center"
                  style={{ background: "linear-gradient(135deg,#1CA7EC,#1F2F98)" }}>
                  <p className="text-xs font-bold uppercase tracking-wide">Secured</p>
                  <p className="text-lg font-black">✓ CSC</p>
                  <p className="text-xs">Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <p className="text-xs" style={{ color: t.muted }}>Scroll down</p>
          <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: t.muted }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-4 sm:px-6" style={{ backgroundColor: t.bg }}>
        <style>{`
          .flip-card { perspective: 1400px; cursor: default; }
          .flip-inner {
            position: relative; width: 100%; height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
          }
          .flip-card:hover .flip-inner { transform: rotateY(180deg); }
          .flip-front, .flip-back {
            position: absolute; width: 100%; height: 100%;
            backface-visibility: hidden; -webkit-backface-visibility: hidden;
            border-radius: 1rem; overflow: hidden;
          }
          .flip-back { transform: rotateY(180deg); }
          .flip-img { transition: transform 0.75s ease; }
          .flip-card:hover .flip-img { transform: scale(1.07); }
          .flip-hint { opacity: 0.85; transition: opacity 0.3s; }
          .flip-card:hover .flip-hint { opacity: 0; pointer-events: none; }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Features</span>
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ color: t.text }}>Everything You Need</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base" style={{ color: t.muted }}>
              A complete HR ecosystem built for city government employees and administrators.
            </p>
            <p className="mt-2 text-xs" style={{ color: t.muted }}>✦ Hover any card to see how it helps you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, image, tag, backTitle, backColor, details }) => (
              <FlipCard
                key={title} icon={Icon} title={title} desc={desc}
                image={image} tag={tag} backTitle={backTitle} backColor={backColor} details={details}
                cardBg={t.cardBg} cardBorder={t.cardBorder} accent={accent}
                textColor={t.text} mutedColor={t.muted}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ── */}
      <section id="announcements" className="py-20 px-4 sm:px-6" style={{ backgroundColor: t.announceBg }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0 mt-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                  style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                  <img src="/mic1.png" alt="Announcements" className="w-10 h-10 object-contain" />
                </div>
                <span className="absolute -top-2 -left-2 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-white shadow"
                  style={{ backgroundColor: accent }}>NEW</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Announcements</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black" style={{ color: t.text }}>City Announcements</h2>
                <p className="mt-2 text-sm sm:text-base" style={{ color: t.muted }}>
                  Official advisories, memoranda, and HR updates from the City Government.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-md" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Official</p>
                <p className="text-sm font-bold" style={{ color: t.text }}>City Government</p>
              </div>
            </div>
          </div>
          <AnnouncementSlideshow
            announcements={ANNOUNCEMENTS} accent={accent}
            cardBg={t.cardBg} cardBorder={t.cardBorder}
            textColor={t.text} mutedColor={t.muted} announceBg={t.announceBg}
          />
          <div className="text-center mt-10">
            <button className="hris-btn h-11 px-8 text-sm font-semibold rounded-lg border flex items-center gap-2 mx-auto transition-all overflow-hidden relative"
              style={{ borderColor: accent, color: accent, backgroundColor: "transparent" }}>
              <Megaphone className="w-4 h-4" /> View All City Announcements
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection />
      <Footer t={t} />
    </div>
  );
}