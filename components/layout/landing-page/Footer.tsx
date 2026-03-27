// components/Footer.tsx
"use client";

import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = ["Privacy Policy", "Terms", "Contact HRMO"] as const;

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`py-8 px-4 sm:px-6 bg-background border-t border-border ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <img 
            src="/image6.png" 
            alt="City Government Logo" 
            className="w-8 h-8 object-contain rounded-lg" 
          />
          <div>
            <p className="text-xs font-bold text-foreground">
              City Government HRIS Portal
            </p>
            <p className="text-xs text-muted-foreground">
              Human Resource Information System
            </p>
          </div>
        </div>

        {/* Copyright - Centered on mobile, left-aligned on desktop */}
        <p className="text-xs text-center sm:text-left text-muted-foreground order-3 sm:order-2">
          © {new Date().getFullYear()} City Government. All rights reserved. Powered by HRMO.
        </p>

        {/* Links */}
        <nav className="flex items-center gap-4 order-2 sm:order-3" aria-label="Footer navigation">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-offset-2 focus:ring-offset-background rounded"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
      
      {/* Optional decorative separator for visual polish */}
      <Separator className="mt-6 max-w-7xl mx-auto bg-border" />
    </footer>
  );
}