// components/sections/HeroSection.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, ChevronRight, ChevronDown,
  FileText, Calendar, Bell, Clock, Users,
  ClipboardList, Award, BarChart3,
} from "lucide-react";
import { STATS } from "@/lib/constants";

interface HeroSectionProps {
  className?: string;
}

// ─── Ticker items with icon components ──────────────────────────────────────
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

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section
      id="home"
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden pt-16 bg-background ${className}`}
    >
      {/* Ticker animation CSS — using CSS variables for colors */}
      <style>{`
        @keyframes ticker-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .preview-ticker { 
          animation: ticker-up 8s linear infinite; 
        }
        .preview-ticker:hover { 
          animation-play-state: paused; 
        }
        .preview-ticker-row { 
          transition: background-color 0.2s ease, transform 0.2s ease; 
        }
        .preview-ticker-row:hover {
          transform: translateX(4px);
          box-shadow: -3px 0 0 0 var(--primary);
        }
        @media (prefers-reduced-motion: reduce) {
          .preview-ticker { animation: none !important; }
        }
      `}</style>

      {/* ── Background blobs using CSS variables ── */}
      <div
        className="absolute top-20 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none bg-primary/20"
        style={{ transform: "translate(30%,-20%)" }}
      />
      <div
        className="absolute bottom-10 left-0 w-96 h-96 rounded-full opacity-10 pointer-events-none bg-primary/10"
        style={{ transform: "translate(-30%,20%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col lg:flex-row items-center gap-16">

        {/* ══ LEFT: copy ══ */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" />
            <Badge variant="secondary" className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border-0">
              City Government HRIS
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-foreground">
            One Portal.<br />
            <span className="text-primary">All Your HR</span><br />
            Needs.
          </h1>

          <p className="text-base sm:text-lg max-w-lg leading-relaxed text-muted-foreground">
            The official Human Resource Information System for City Government employees.
            Access your records, manage requests, and stay updated — all in one secure place.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" className="h-11 px-6 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 gap-2">
              Access Employee Portal <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 text-sm font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
            >
              View Announcements <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 pt-4">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-primary">{s.value}</p>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT: live ticker card ══ */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            <Card className="rounded-2xl shadow-2xl overflow-hidden border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Card className="p-1 border-border">
                    <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                  </Card>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Welcome to
                    </p>
                    <p className="text-base font-black text-foreground">City HRIS Portal</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    <Badge className="text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                      LIVE
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Ticker window */}
                <div className="relative overflow-hidden" style={{ height: "252px" }}>
                  {/* Fade top/bottom using CSS variables */}
                  <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-8 bg-gradient-to-b from-card to-transparent" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8 bg-gradient-to-t from-card to-transparent" />

                  <div className="preview-ticker space-y-2">
                    {doubled.map(({ icon: Icon, label, sub }, i) => (
                      <div
                        key={i}
                        className="preview-ticker-row flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 border-l-4 border-primary"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground bg-primary flex-shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{label}</p>
                          <p className="text-xs truncate text-muted-foreground">{sub}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className="mt-3 pt-3 flex items-center justify-between border-t border-border">
                  <span className="text-[10px] text-muted-foreground">Hover to pause</span>
                  <Badge className="px-3 py-1 rounded-full text-[10px] font-black text-white bg-gradient-to-r from-cyan-500 to-indigo-600 border-0">
                    ✓ CSC Compliant
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 shadow-lg rounded-2xl overflow-hidden z-10">
              <div className="px-4 py-3 text-white text-center bg-gradient-to-br from-cyan-500 to-indigo-600">
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
        <p className="text-xs text-muted-foreground">Scroll down</p>
        <ChevronDown className="w-4 h-4 animate-bounce text-muted-foreground" />
      </div>
    </section>
  );
}