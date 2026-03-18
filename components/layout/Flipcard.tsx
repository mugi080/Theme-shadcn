"use client";

import React from "react";
import { Theme, ACCENT } from "@/lib/constants";

// ─── Props ────────────────────────────────────────────────────────────────────

interface FlipCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  image: string | null;
  tag: string | null;
  backTitle: string;
  backColor: string;
  details: string[];
  t: Theme;
  accent?: string; // optional — falls back to ACCENT from constants
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FlipCard({
  icon: Icon,
  title,
  desc,
  image,
  tag,
  backTitle,
  backColor,
  details,
  t,
  accent = ACCENT,
}: FlipCardProps) {
  return (
    <div className="flip-card" style={{ height: "380px" }}>
      <div className="flip-inner" style={{ height: "100%" }}>

        {/* ══════════════════════════════ FRONT ══════════════════════════════ */}
        <div
          className="flip-front flex flex-col shadow-md hover:shadow-xl"
          style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}
        >
          {/* Image / fallback */}
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            {image ? (
              <>
                <img src={image} alt={title} className="flip-img w-full h-full object-cover" />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }}
                />
                {/* Tag pill */}
                {tag && (
                  <span
                    className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: "rgba(25,118,210,0.85)" }}
                  >
                    {tag}
                  </span>
                )}
              </>
            ) : (
              /* No image — show icon centred on gradient */
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EEF3FA 0%, #DAEAF8 100%)" }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: accent }}
                >
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            )}

            {/* "Hover to flip" hint — fades out on hover via .flip-hint CSS */}
            <div
              className="flip-hint absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold"
              style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              <span>Hover to flip</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: accent }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold" style={{ color: t.text }}>{title}</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: t.muted }}>{desc}</p>
            <div
              className="mt-auto pt-1 flex items-center gap-1 text-[10px] font-semibold"
              style={{ color: accent }}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              Hover to see how this helps you
            </div>
          </div>
        </div>

        {/* ══════════════════════════════ BACK ══════════════════════════════ */}
        <div
          className="flip-back flex flex-col text-white"
          style={{ background: `linear-gradient(145deg, ${backColor} 0%, #0a0f2e 100%)` }}
        >
          {/* Back header */}
          <div
            className="px-5 pt-5 pb-4 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p
                className="text-[9px] font-black uppercase tracking-widest mb-0.5"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                How it helps you
              </p>
              <h3 className="text-sm font-black leading-tight">{backTitle}</h3>
            </div>
          </div>

          {/* Detail bullets */}
          <div className="px-5 py-4 flex-1 flex flex-col gap-3 overflow-hidden">
            {details.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", minWidth: "20px" }}
                >
                  {i + 1}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>{d}</p>
              </div>
            ))}
          </div>

          {/* Back footer */}
          <div
            className="px-5 pb-4 pt-2 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-[9px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Move cursor away to flip back
            </span>
            <span
              className="text-[9px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}
            >
              ✦ {tag ?? title}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}