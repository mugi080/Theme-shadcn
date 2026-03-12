"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  Users, FileText, BarChart3, Shield, Bell, ChevronRight,
  Calendar, Megaphone, ArrowRight, Menu, X, Building2,
  ClipboardList, Award, Clock, MapPin, ChevronDown, Sun, Moon
} from "lucide-react";

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const LIGHT = {
  bg:           "#ffffff",
  heroBg:       "linear-gradient(135deg, #EEF3FA 0%, #DAEAF8 50%, #EEF3FA 100%)",
  announceBg:   "#EEF3FA",
  navBg:        "rgba(255,255,255,0.93)",
  navBorder:    "#e2e8f0",
  cardBg:       "#ffffff",
  cardBorder:   "#e2e8f0",
  cardRowHover: "#f1f5f9",
  cardRowBase:  "#f8fafc",
  text:         "#0f172a",
  muted:        "#64748b",
  sep:          "#e2e8f0",
  toggleBg:     "#EEF3FA",
  toggleColor:  "#1976D2",
  menuBg:       "#ffffff",
};

const DARK = {
  bg:           "#0f172a",
  heroBg:       "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  announceBg:   "#1e293b",
  navBg:        "rgba(15,23,42,0.95)",
  navBorder:    "#334155",
  cardBg:       "#1e293b",
  cardBorder:   "#334155",
  cardRowHover: "#334155",
  cardRowBase:  "#0f172a",
  text:         "#f1f5f9",
  muted:        "#94a3b8",
  sep:          "#334155",
  toggleBg:     "#334155",
  toggleColor:  "#fbbf24",
  menuBg:       "#1e293b",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Users,         title: "Employee Records",    desc: "Manage complete employee profiles, personal data sheets, and employment history in one secure place." },
  { icon: ClipboardList, title: "Leave Management",    desc: "File and track leave requests, approvals, and balances with automated workflows." },
  { icon: BarChart3,     title: "Reports & Analytics", desc: "Generate real-time workforce reports, attendance summaries, and performance dashboards." },
  { icon: Award,         title: "Service Records",     desc: "Maintain accurate civil service records, eligibilities, and career progression tracking." },
  { icon: FileText,      title: "Documents & Forms",   desc: "Access CS Form 212, certificates of employment, and official HR documents anytime." },
  { icon: Shield,        title: "Secure & Compliant",  desc: "Built with government data privacy standards and CSC compliance requirements in mind." },
];

const ANNOUNCEMENTS = [
  {
    id: 1, category: "HR Advisory", badge: "New", badgeColor: "#1976D2", date: "June 10, 2025",
    title: "Submission of Updated Personal Data Sheet (CS Form 212)",
    body: "All city government employees are hereby directed to submit an updated CS Form 212 to the Human Resource Management Office on or before June 30, 2025. Failure to comply may affect the processing of your benefits and salary adjustments.",
    author: "City Human Resource Management Office",
  },
  {
    id: 2, category: "Memorandum", badge: "Urgent", badgeColor: "#D32F2F", date: "June 5, 2025",
    title: "Mandatory Anti-Sexual Harassment Seminar for All City Employees",
    body: "Pursuant to Republic Act No. 7877, all city government employees are required to attend the scheduled Anti-Sexual Harassment Seminar. Schedule and venue will be announced per department through the HRIS portal.",
    author: "Office of the City Mayor",
  },
  {
    id: 3, category: "General Announcement", badge: "Open", badgeColor: "#2E7D32", date: "May 28, 2025",
    title: "Job Vacancy: Administrative Officer II (Human Resource)",
    body: "The City Government is accepting applications for the position of Administrative Officer II in the HRMO. Interested and qualified applicants must submit complete documentary requirements to the HRMO not later than June 20, 2025.",
    author: "City Human Resource Management Office",
  },
  {
    id: 4, category: "Wellness Program", badge: "Upcoming", badgeColor: "#7B1FA2", date: "May 20, 2025",
    title: "Annual Medical and Dental Mission for City Employees",
    body: "The City Health Office, in partnership with the HRMO, will conduct its Annual Medical and Dental Mission for all permanent and casual city employees. Registration is now open through the HRIS Employee Portal.",
    author: "City Health Office",
  },
];

const STATS = [
  { value: "2,400+", label: "City Employees" },
  { value: "38",     label: "Departments" },
  { value: "99.8%",  label: "Data Accuracy" },
  { value: "24/7",   label: "Portal Access" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HRISLandingPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const t = dark ? DARK : LIGHT;
  const accent = "#1976D2";
    // Navigation Handler
  const handleLoginRedirect = () => {
  router.push("/login");
  };
     

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, transition: "background-color .3s, color .3s", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm"
        style={{ backgroundColor: t.navBg, borderBottom: `1px solid ${t.navBorder}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/image6.png" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
            <div className="leading-tight">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>City Government</p>
              <p className="text-sm font-bold" style={{ color: t.text }}>HRIS Portal</p>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {["Home", "Announcements", "Features", "About"].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: t.muted }}>
                {link}
              </a>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* ☀/🌙 Toggle */}
            <button
              onClick={() => setDark(v => !v)}
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="outline" size="sm"
              className="h-8 text-xs"
              onClick={handleLoginRedirect}
              style={{ borderColor: accent, color: accent, backgroundColor: "transparent" } }>
              Employee Login
              
            </Button>
           
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => setDark(v => !v)}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: t.toggleBg, color: t.toggleColor }}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-2" style={{ color: t.text }} onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-4 space-y-3"
            style={{ backgroundColor: t.menuBg, borderTop: `1px solid ${t.sep}` }}>
            {["Home", "Announcements", "Features", "About"].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="block text-sm font-medium py-1"
                style={{ color: t.muted }}
                onClick={() => setMenuOpen(false)}>
                {link}
              </a>
            ))}
            <div style={{ height: 1, backgroundColor: t.sep }} />
            <div className="flex gap-2 pt-1">
              <Button onClick={handleLoginRedirect} variant="outline" size="sm" className="flex-1 text-xs" style={{ borderColor: accent, color: accent }}>Login</Button>
              <Button size="sm" className="flex-1 text-xs text-white" style={{ backgroundColor: accent }}>Sign Up</Button>
            </div>
          </div>
        )}
      </nav>

      {/* ── PAGE 1: HERO ── */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
        style={{ background: t.heroBg }}>

        <div className="absolute top-20 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #1976D2, transparent)", transform: "translate(30%, -20%)" }} />
        <div className="absolute bottom-10 left-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #1565C0, transparent)", transform: "translate(-30%, 20%)" }} />
        <div className="absolute top-1/3 left-1/2 w-px h-40 opacity-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #1976D2, transparent)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col lg:flex-row items-center gap-16">

          {/* Left text */}
          <div className={`flex-1 space-y-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                City Government HRIS
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight" style={{ color: t.text }}>
              One Portal.<br />
              <span style={{ color: accent }}>All Your HR</span><br />
              Needs.
            </h1>
            <p className="text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: t.muted }}>
              The official Human Resource Information System for City Government employees.
              Access your records, manage requests, and stay updated — all in one secure place.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="h-11 px-6 text-sm font-semibold text-white gap-2"
                style={{ backgroundColor: accent }}>
                Access Employee Portal <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline"
                className="h-11 px-6 text-sm font-semibold gap-2"
                style={{ borderColor: accent, color: accent, backgroundColor: "transparent" }}>
                View Announcements <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black" style={{ color: accent }}>{s.value}</p>
                  <p className="text-xs font-medium" style={{ color: t.muted }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right preview card */}
          <div className={`flex-1 flex justify-center transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative w-full max-w-sm">
              <div className="rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: t.muted }}>Welcome to</p>
                      <p className="text-base font-black" style={{ color: t.text }}>City HRIS Portal</p>
                    </div>
                  </div>
                  <div style={{ height: 1, backgroundColor: t.sep }} />
                  {[
                    { icon: FileText,  label: "Personal Data Sheet", sub: "CS Form 212 — Updated" },
                    { icon: Calendar,  label: "Leave Application",   sub: "3 pending requests" },
                    { icon: Bell,      label: "Announcements",       sub: "4 new city advisories" },
                    { icon: Clock,     label: "Service Record",      sub: "Complete history" },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                      style={{ backgroundColor: t.cardRowBase }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = t.cardRowHover)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = t.cardRowBase)}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: accent }}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: t.text }}>{label}</p>
                        <p className="text-xs truncate" style={{ color: t.muted }}>{sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: t.muted }} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 shadow-lg rounded-2xl overflow-hidden">
                <div className="px-4 py-3 text-white text-center" style={{ backgroundColor: accent }}>
                  <p className="text-xs font-bold uppercase tracking-wide">Secured</p>
                  <p className="text-lg font-black">✓ CSC</p>
                  <p className="text-xs">Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <p className="text-xs" style={{ color: t.muted }}>Scroll down</p>
          <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: t.muted }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-4 sm:px-6" style={{ backgroundColor: t.bg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Features</span>
              <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ color: t.text }}>Everything You Need</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base" style={{ color: t.muted }}>
              A complete HR ecosystem built for city government employees and administrators.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-6 space-y-4 group hover:shadow-lg transition-shadow"
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110"
                  style={{ backgroundColor: accent }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold" style={{ color: t.text }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAGE 2: ANNOUNCEMENTS ── */}
      <section id="announcements" className="py-20 px-4 sm:px-6" style={{ backgroundColor: t.announceBg }}>
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5" style={{ backgroundColor: accent }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Page 2</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ color: t.text }}>City Announcements</h2>
              <p className="mt-2 text-sm sm:text-base" style={{ color: t.muted }}>
                Official advisories, memoranda, and HR updates from the City Government.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src="/image6.png" alt="Logo" className="w-10 h-10 object-contain rounded-xl shadow-md" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Official</p>
                <p className="text-sm font-bold" style={{ color: t.text }}>City Government</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {ANNOUNCEMENTS.map((ann, i) => (
              <div key={ann.id}
                className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${i === 0 ? "lg:col-span-2" : ""}`}
                style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                <div className={`flex flex-col ${i === 0 ? "sm:flex-row" : ""}`}>
                  <div className={`flex-shrink-0 ${i === 0 ? "sm:w-2 h-2 sm:h-auto" : "h-2 w-full"}`}
                    style={{ backgroundColor: ann.badgeColor }} />
                  <div className="p-6 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: ann.badgeColor }}>
                          {ann.badge}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: t.muted }}>{ann.category}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: t.muted }}>
                        <Calendar className="w-3 h-3" />{ann.date}
                      </div>
                    </div>
                    <h3 className={`font-bold leading-snug ${i === 0 ? "text-lg sm:text-xl" : "text-base"}`}
                      style={{ color: t.text }}>{ann.title}</h3>
                    <p className={`text-sm leading-relaxed ${i !== 0 ? "line-clamp-3" : ""}`}
                      style={{ color: t.muted }}>{ann.body}</p>
                    <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: t.muted }}>
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{ann.author}</span>
                      </div>
                      <button className="text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                        style={{ color: accent }}>
                        Read more <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="h-11 px-8 text-sm font-semibold rounded-lg border flex items-center gap-2 mx-auto hover:opacity-80 transition-opacity"
              style={{ borderColor: accent, color: accent, backgroundColor: "transparent" }}>
              <Megaphone className="w-4 h-4" /> View All City Announcements
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="about" className="py-20 px-4 sm:px-6 text-white relative overflow-hidden"
        style={{ backgroundColor: "#1565C0" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <img src="/image6.png" alt="Logo" className="w-14 h-14 object-contain rounded-2xl mx-auto shadow-xl" />
          <h2 className="text-3xl sm:text-4xl font-black">Ready to Get Started?</h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Join the City Government's digital HR transformation. Access your employee profile,
            submit requests, and stay informed — all from one secure portal.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="lg" className="h-11 px-8 text-sm font-semibold bg-white hover:bg-blue-50 gap-2"
              style={{ color: "#1565C0" }}>
              Create Account <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline"
              className="h-11 px-8 text-sm font-semibold border-white text-white hover:bg-white/10 gap-2">
              <MapPin className="w-4 h-4" /> City Hall, Ground Floor
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 sm:px-6" style={{ backgroundColor: t.bg, borderTop: `1px solid ${t.sep}` }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/image6.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            <div>
              <p className="text-xs font-bold" style={{ color: t.text }}>City Government HRIS Portal</p>
              <p className="text-xs" style={{ color: t.muted }}>Human Resource Information System</p>
            </div>
          </div>
          <p className="text-xs text-center" style={{ color: t.muted }}>
            © {new Date().getFullYear()} City Government. All rights reserved. Powered by HRMO.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms", "Contact HRMO"].map(l => (
              <a key={l} href="#" className="text-xs hover:opacity-80 transition-opacity"
                style={{ color: t.muted }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}