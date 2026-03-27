// components/sections/AnnouncementsSection.tsx
"use client";

import { useState } from "react";
import { Calendar, Building2, ArrowRight, Megaphone } from "lucide-react";
import { ANNOUNCEMENTS } from "@/lib/constants";
/* Shadcn UI Primitives */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnnouncementsSectionProps {
  className?: string;
}

function AnnouncementSlideshow({ className = "" }: { className?: string }) {
  const [paused, setPaused] = useState(false);

  // Triple the items for a seamless three-cycle scroll
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: marquee-scroll 22s linear infinite;
          padding: 0.5rem 0 1rem;
        }
        .marquee-track.paused { animation-play-state: paused; }
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
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-2xl bg-background">
        {/* Fade edges using CSS variables */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

        <div
          className={`marquee-track${paused ? " paused" : ""}`}
          onClick={() => setPaused((v) => !v)}
          role="list"
          aria-label="Announcements carousel"
        >
          {items.map((ann, idx) => (
            <div key={idx} className="marquee-card" role="listitem">
              <Card className="h-full flex flex-col overflow-hidden border-border hover:shadow-lg transition-shadow duration-200">
                {/* Badge color bar */}
                <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: ann.badgeColor }} />
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Badge 
                        className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border-0"
                        style={{ backgroundColor: ann.badgeColor, color: "#fff" }}
                      >
                        {ann.badge}
                      </Badge>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {ann.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{ann.date}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex flex-col gap-3 flex-1 pt-0">
                  <h3 className="text-sm font-black leading-snug line-clamp-2 text-foreground">
                    {ann.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-3 text-muted-foreground">
                    {ann.body}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] min-w-0 text-muted-foreground">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{ann.author}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto text-[10px] font-bold px-2 py-0.5 rounded-md text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      Read more <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Pause / resume toggle */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button
          variant={paused ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? (
            <>
              <ArrowRight className="w-3 h-3" /> Resume scrolling
            </>
          ) : (
            <>
              <span className="w-3 h-3 flex items-center justify-center font-black text-[10px]">⏸</span> Click any card to pause
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function AnnouncementsSection({ className = "" }: AnnouncementsSectionProps) {
  return (
    <section id="announcements" className={`py-20 px-4 sm:px-6 bg-muted/30 ${className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="flex items-start gap-5">
            {/* Icon with badge */}
            <div className="relative flex-shrink-0 mt-1">
              <Card className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border-border">
                <img src="/mic1.png" alt="Announcements" className="w-10 h-10 object-contain" />
              </Card>
              <Badge className="absolute -top-2 -left-2 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-white border-0 bg-primary shadow">
                NEW
              </Badge>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Announcements
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                City Announcements
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Official advisories, memoranda, and HR updates from the City Government.
              </p>
            </div>
          </div>

          {/* Official logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Card className="p-1 border-border">
              <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
            </Card>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Official</p>
              <p className="text-sm font-bold text-foreground">City Government</p>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <AnnouncementSlideshow />

        {/* View all CTA */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="h-11 px-8 text-sm font-semibold rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Megaphone className="w-4 h-4 mr-2" /> View All City Announcements
          </Button>
        </div>
      </div>
    </section>
  );
}