"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ChevronRight, ChevronDown,
  FileText, Calendar, Bell, Clock, Users,
  ClipboardList, Award, BarChart3,
} from "lucide-react";
import { Theme, ACCENT, STATS } from "@/lib/constants";

interface HeroSectionProps {
  t: Theme;
  visible: boolean;
}

// ─── Ticker items defined here with real icon components ──────────────────────
// constants.ts stores iconKey strings (safe for server/non-React contexts).
// HeroSection owns the icon→component mapping so <Icon /> never gets undefined.

const TICKER_ITEMS = [
  { icon: FileText,      label: "Personal Data Sheet", sub: "CS Form 212 — Updated"    },
  { icon: Calendar,      label: "Leave Application",   sub: "3 pending requests"        },
  { icon: Bell,          label: "Announcements",       sub: "4 new city advisories"     },
  { icon: Clock,         label: "Service Record",      sub: "Complete history"          },
  { icon: Users,         label: "Employee Records",    sub: "Profile up to date"        },
  { icon: ClipboardList, label: "Leave Balance",       sub: "15 vacation days left"     },
  { icon: Award,         label: "Eligibility",         sub: "CS Prof — Passed"          },
  { icon: BarChart3,     label: "Attendance",          sub: "No absences this month"    },
];

export default function HeroSection({ t, visible }: HeroSectionProps) {
  // Double the array for a seamless infinite loop
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
      style={{ background: t.heroBg }}
    >
      <style>{`
        @keyframes ticker-up {
          0%   { transform: translateY(0);    }
          100% { transform: translateY(-50%); }
        }
        .preview-ticker       { animation: ticker-up 8s linear infinite; }
        .preview-ticker:hover { animation-play-state: paused; }
        .preview-ticker-row   { transition: background-color 0.2s ease, transform 0.2s ease; }
        .preview-ticker-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 0 #1CA7EC;
        }
      `}</style>

      {/* ── Background blobs ── */}
      <div
        className="absolute top-20 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1976D2, transparent)", transform: "translate(30%,-20%)" }}
      />
      <div
        className="absolute bottom-10 left-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1565C0, transparent)", transform: "translate(-30%,20%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col lg:flex-row items-center gap-16">

        {/* ══ LEFT: copy ══ */}
        <div
          className={`flex-1 space-y-6 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5" style={{ backgroundColor: ACCENT }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              City Government HRIS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight" style={{ color: t.text }}>
            One Portal.<br />
            <span style={{ color: ACCENT }}>All Your HR</span><br />
            Needs.
          </h1>

          <p className="text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: t.muted }}>
            The official Human Resource Information System for City Government employees.
            Access your records, manage requests, and stay updated — all in one secure place.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className="hris-btn h-11 px-6 text-sm font-semibold text-white gap-2"
              style={{ backgroundColor: ACCENT }}
            >
              Access Employee Portal <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hris-btn h-11 px-6 text-sm font-semibold gap-2"
              style={{ borderColor: ACCENT, color: ACCENT, backgroundColor: "transparent" }}
            >
              View Announcements <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 pt-4">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black" style={{ color: ACCENT }}>{s.value}</p>
                <p className="text-xs font-medium" style={{ color: t.muted }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT: live ticker card ══ */}
        <div
          className={`flex-1 flex justify-center transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative w-full max-w-sm">
            <div
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}
            >
              <div className="p-6">

                {/* Card header */}
                <div className="flex items-center gap-3 mb-4">
                  <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: t.muted }}>
                      Welcome to
                    </p>
                    <p className="text-base font-black" style={{ color: t.text }}>City HRIS Portal</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: "#22c55e" }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ backgroundColor: "#22c55e" }}
                      />
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: "#22c55e" }}>LIVE</span>
                  </div>
                </div>

                <div style={{ height: 1, backgroundColor: t.sep }} className="mb-4" />

                {/* Ticker window */}
                <div className="relative overflow-hidden" style={{ height: "252px" }}>
                  {/* Fade top */}
                  <div
                    className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-8"
                    style={{ background: `linear-gradient(to bottom, ${t.cardBg}, transparent)` }}
                  />
                  {/* Fade bottom */}
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8"
                    style={{ background: `linear-gradient(to top, ${t.cardBg}, transparent)` }}
                  />

                  <div className="preview-ticker space-y-2">
                    {doubled.map(({ icon: Icon, label, sub }, i) => (
                      <div
                        key={i}
                        className="preview-ticker-row flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                        style={{ backgroundColor: t.cardRowBase, borderLeft: `3px solid ${ACCENT}` }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.cardRowHover)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.cardRowBase)}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: ACCENT }}
                        >
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

                {/* Card footer */}
                <div
                  className="mt-3 pt-3 flex items-center justify-between"
                  style={{ borderTop: `1px solid ${t.sep}` }}
                >
                  <span className="text-[10px]" style={{ color: t.muted }}>Hover to pause</span>
                  <div
                    className="px-3 py-1 rounded-full text-[10px] font-black text-white"
                    style={{ background: "linear-gradient(135deg,#1CA7EC,#1F2F98)" }}
                  >
                    ✓ CSC Compliant
                  </div>
                </div>

              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 shadow-lg rounded-2xl overflow-hidden z-10">
              <div
                className="px-4 py-3 text-white text-center"
                style={{ background: "linear-gradient(135deg,#1CA7EC,#1F2F98)" }}
              >
                <p className="text-xs font-bold uppercase tracking-wide">Secured</p>
                <p className="text-lg font-black">✓ CSC</p>
                <p className="text-xs">Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
        <p className="text-xs" style={{ color: t.muted }}>Scroll down</p>
        <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: t.muted }} />
      </div>
    </section>
  );
}