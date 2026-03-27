// components/Flipcard.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FlipCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  image: string | null;
  tag: string | null;
  backTitle: string;
  backColor: string; // Tailwind class like "bg-primary" or "bg-cyan-600"
  details: string[];
}

export default function FlipCard({
  icon: Icon,
  title,
  desc,
  image,
  tag,
  backTitle,
  backColor,
  details,
}: FlipCardProps) {
  return (
    <div className="flip-card group" style={{ height: "380px" }}>
      {/* Flip animation CSS — minimal, only 3D transforms */}
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
        @media (prefers-reduced-motion: reduce) {
          .flip-inner, .flip-img, .flip-hint { transition: none !important; }
        }
      `}</style>

      <div className="flip-inner">
        {/* ══════════════════════════════ FRONT ══════════════════════════════ */}
        <Card className="flip-front h-full flex flex-col overflow-hidden border-border hover:shadow-lg transition-shadow duration-200">
          {/* Image / fallback */}
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            {image ? (
              <>
                <img src={image} alt={title} className="flip-img w-full h-full object-cover" />
                {/* Gradient overlay using CSS variables */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                {/* Tag pill */}
                {tag && (
                  <Badge className={`absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border-0 text-white ${backColor}`}>
                    {tag}
                  </Badge>
                )}
              </>
            ) : (
              /* No image — show icon centred on gradient */
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg ${backColor}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            )}

            {/* "Hover to flip" hint — fades out on hover */}
            <div className="flip-hint absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              <span>Hover to flip</span>
            </div>
          </div>

          {/* Body */}
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground flex-shrink-0 ${backColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-bold text-foreground">{title}</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              {desc}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex items-end pb-4 pt-0">
            <Button variant="ghost" size="sm" className="h-auto text-[10px] font-semibold px-2 py-0.5 rounded-md text-primary hover:bg-primary/10 hover:text-primary ml-auto">
              Learn more <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </Button>
          </CardContent>
        </Card>

        {/* ══════════════════════════════ BACK ══════════════════════════════ */}
        <Card className={`flip-back h-full flex flex-col overflow-hidden border-border text-white ${backColor}`}>
          {/* Back header */}
          <CardHeader className="pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/15">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest mb-0.5 text-white/60">
                  How it helps you
                </p>
                <CardTitle className="text-sm font-black leading-tight text-white">{backTitle}</CardTitle>
              </div>
            </div>
          </CardHeader>

          {/* Detail bullets */}
          <CardContent className="flex-1 flex flex-col gap-3 pt-4 pb-4 overflow-hidden">
            {details.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black bg-white/20 min-w-[20px]">
                  {i + 1}
                </div>
                <p className="text-xs leading-relaxed text-white/90">{d}</p>
              </div>
            ))}
          </CardContent>

          {/* Back footer */}
          <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-white/10">
            <span className="text-[9px] font-medium text-white/50">
              Move cursor away to flip back
            </span>
            <Badge variant="secondary" className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white/85 border-0">
              ✦ {tag ?? title}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}