"use client";

import { useState } from "react";
import { Calendar, Building2, ArrowRight, Megaphone } from "lucide-react";
import { Theme, ACCENT } from "@/lib/constants";
import { ANNOUNCEMENTS } from "@/lib/constants";

interface AnnouncementsSectionProps {
  t: Theme;
}

function AnnouncementSlideshow({ t }: { t: Theme }) {
  const [paused, setPaused] = useState(false);

  // Triple the items for a seamless three-cycle scroll
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="relative">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0);    }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marquee-scroll 22s linear infinite;
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
      `}</style>

      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ "--fade-color": t.announceBg } as React.CSSProperties}
      >
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20"
          style={{ background: `linear-gradient(to right, ${t.announceBg}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20"
          style={{ background: `linear-gradient(to left, ${t.announceBg}, transparent)` }}
        />

        <div
          className={`marquee-track${paused ? " paused" : ""}`}
          style={{ padding: "8px 0 16px" }}
          onClick={() => setPaused(v => !v)}
        >
          {items.map((ann, idx) => (
            <div key={idx} className="marquee-card">
              <div
                className="rounded-2xl overflow-hidden shadow-md h-full flex flex-col"
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}
              >
                <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: ann.badgeColor }} />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: ann.badgeColor }}
                      >
                        {ann.badge}
                      </span>
                      <span className="text-[10px] font-semibold" style={{ color: t.muted }}>
                        {ann.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: t.muted }}>
                      <Calendar className="w-3 h-3" />{ann.date}
                    </div>
                  </div>
                  <h3 className="text-sm font-black leading-snug line-clamp-2" style={{ color: t.text }}>
                    {ann.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: t.muted }}>
                    {ann.body}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] min-w-0" style={{ color: t.muted }}>
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{ann.author}</span>
                    </div>
                    <span
                      className="hris-btn hris-btn-soft text-[10px] font-bold flex items-center gap-0.5 flex-shrink-0 px-2 py-0.5 rounded-md"
                      style={{ color: ACCENT }}
                    >
                      Read more <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pause / resume toggle */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div
          className="hris-btn flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
          style={{
            backgroundColor: paused ? ACCENT : "transparent",
            color: paused ? "#fff" : t.muted,
            border: `1px solid ${paused ? ACCENT : t.cardBorder}`,
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

export default function AnnouncementsSection({ t }: AnnouncementsSectionProps) {
  return (
    <section
      id="announcements"
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: t.announceBg }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="flex items-start gap-5">
            {/* Icon with badge */}
            <div className="relative flex-shrink-0 mt-1">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}
              >
                <img src="/mic1.png" alt="Announcements" className="w-10 h-10 object-contain" />
              </div>
              <span
                className="absolute -top-2 -left-2 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-white shadow"
                style={{ backgroundColor: ACCENT }}
              >
                NEW
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5" style={{ backgroundColor: ACCENT }} />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: ACCENT }}
                >
                  Announcements
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ color: t.text }}>
                City Announcements
              </h2>
              <p className="mt-2 text-sm sm:text-base" style={{ color: t.muted }}>
                Official advisories, memoranda, and HR updates from the City Government.
              </p>
            </div>
          </div>

          {/* Official logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-md" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Official</p>
              <p className="text-sm font-bold" style={{ color: t.text }}>City Government</p>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <AnnouncementSlideshow t={t} />

        {/* View all CTA */}
        <div className="text-center mt-10">
          <button
            className="hris-btn h-11 px-8 text-sm font-semibold rounded-lg border flex items-center gap-2 mx-auto transition-all overflow-hidden relative"
            style={{ borderColor: ACCENT, color: ACCENT, backgroundColor: "transparent" }}
          >
            <Megaphone className="w-4 h-4" /> View All City Announcements
          </button>
        </div>
      </div>
    </section>
  );
}