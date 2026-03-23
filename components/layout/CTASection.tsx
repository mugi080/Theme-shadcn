"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ACCENT } from "@/lib/constants";

export default function CTASection() {
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
        /* ── Keyframes ── */
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
          0%   { width: 0;    opacity: 0; }
          100% { width: 80px; opacity: 1; }
        }
        @keyframes cta-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes cta-ring-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0;   }
        }

        /* ── Hidden state ── */
        .cta-el { opacity: 0; }

        /* ── Triggered ── */
        .cta-visible .cta-logo  { animation: cta-reveal-scale 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s  forwards; }
        .cta-visible .cta-line  { animation: cta-line-grow    0.6s cubic-bezier(0.4,0,0.2,1) 0.3s  forwards; }
        .cta-visible .cta-h2    { animation: cta-reveal-up    0.9s cubic-bezier(0.4,0,0.2,1) 0.4s  forwards; }
        .cta-visible .cta-p     { animation: cta-reveal-up    0.9s cubic-bezier(0.4,0,0.2,1) 0.65s forwards; }
        .cta-visible .cta-btn-1 { animation: cta-reveal-btn   0.7s cubic-bezier(0.4,0,0.2,1) 0.90s forwards; }
        .cta-visible .cta-btn-2 { animation: cta-reveal-btn   0.7s cubic-bezier(0.4,0,0.2,1) 1.10s forwards; }

        /* ── Shimmer on heading ── */
        .cta-shimmer {
          background: linear-gradient(90deg, #ffffff 0%, #93c5fd 35%, #ffffff 55%, #bfdbfe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: cta-shimmer 5s linear 1.5s infinite;
        }

        /* ── Pulse ring ── */
        .cta-ring { animation: cta-ring-pulse 2s ease-out 1s infinite; }
      `}</style>

      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated content */}
      <div className={`relative max-w-4xl mx-auto text-center space-y-6 ${inView ? "cta-visible" : ""}`}>

        {/* Logo + pulse ring */}
        <div className="cta-el cta-logo relative inline-flex items-center justify-center mx-auto">
          <div className="cta-ring absolute w-14 h-14 rounded-2xl border-2 border-white/60" />
          <img
            src="/image6.png"
            alt="Logo"
            className="w-14 h-14 object-contain rounded-2xl shadow-xl relative z-10"
          />
        </div>

        {/* Decorative lines */}
        <div className="flex items-center justify-center gap-3">
          <div className="cta-el cta-line h-0.5 rounded-full bg-blue-300" style={{ width: 0 }} />
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
            City Government HRIS
          </span>
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
          <Button
            size="lg"
            className="cta-el cta-btn-1 hris-btn h-11 px-8 text-sm font-bold rounded-lg text-white border-0"
            style={{ backgroundColor: ACCENT, boxShadow: "0 0 0 2px white" }}
          >
            Login
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="cta-el cta-btn-2 hris-btn h-11 px-8 text-sm font-bold rounded-lg border-2 border-white text-white bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}