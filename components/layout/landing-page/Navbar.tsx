// components/Navbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "../toggle-mode";

interface NavbarProps {
  className?: string;
}

const NAV_LINKS = ["Home", "Announcements", "Features", "About"] as const;

export default function Navbar({ className = "" }: NavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm bg-background/80 border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border border-border group-hover:border-primary/50 transition-colors">
            <img src="/image6.png" alt="City Government Logo" className="w-7 h-7 object-contain" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              City Government
            </p>
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              HRIS Portal
            </p>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => router.push("/login")}
          >
            Employee Login
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-1">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-lg hover:bg-muted/50"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-4 space-y-2 bg-card border-t border-border">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between gap-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleLogin}
            >
              Employee Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}