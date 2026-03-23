"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { ACCENT, Theme } from "@/lib/constants";
interface NavbarProps {
  dark: boolean;
  onToggleDark: () => void;
  t: Theme;
}

const NAV_LINKS = ["Home", "Announcements", "Features", "About"] as const;

export default function Navbar({ dark, onToggleDark, t }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm"
      style={{ backgroundColor: t.navBg, borderBottom: `1px solid ${t.navBorder}` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/image6.png" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
          <div className="leading-tight">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
              City Government
            </p>
            <p className="text-sm font-bold" style={{ color: t.text }}>HRIS Portal</p>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="hris-btn-soft text-sm font-medium transition-all px-2 py-1 rounded-md"
              style={{ color: t.muted }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onToggleDark}
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="hris-btn-icon w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button
            variant="outline"
            size="sm"
            className="hris-btn h-8 text-xs"
            style={{ borderColor: ACCENT, color: ACCENT, backgroundColor: "transparent" }}
          >
            Employee Login
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={onToggleDark}
            className="hris-btn-icon w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className="hris-btn-icon p-2"
            style={{ color: t.text }}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-3"
          style={{ backgroundColor: t.menuBg, borderTop: `1px solid ${t.sep}` }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block text-sm font-medium py-1"
              style={{ color: t.muted }}
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <div style={{ height: 1, backgroundColor: t.sep }} />
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="hris-btn flex-1 text-xs"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}