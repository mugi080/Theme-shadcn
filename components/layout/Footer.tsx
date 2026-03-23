"use client";

import { Theme } from "@/lib/constants";

interface FooterProps {
  t: Theme;
}

const FOOTER_LINKS = ["Privacy Policy", "Terms", "Contact HRMO"] as const;

export default function Footer({ t }: FooterProps) {
  return (
    <footer
      className="py-8 px-4 sm:px-6"
      style={{ backgroundColor: t.bg, borderTop: `1px solid ${t.sep}` }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <img src="/image6.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
          <div>
            <p className="text-xs font-bold" style={{ color: t.text }}>
              City Government HRIS Portal
            </p>
            <p className="text-xs" style={{ color: t.muted }}>
              Human Resource Information System
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-center" style={{ color: t.muted }}>
          © {new Date().getFullYear()} City Government. All rights reserved. Powered by HRMO.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4">
          {FOOTER_LINKS.map(l => (
            <a
              key={l}
              href="#"
              className="text-xs hover:opacity-80 transition-opacity"
              style={{ color: t.muted }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}