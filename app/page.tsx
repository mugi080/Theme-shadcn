<<<<<<< HEAD
=======
"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Users, FileText, BarChart3, Shield, Bell, ChevronRight,
  Calendar, Megaphone, ArrowRight, Menu, X, Building2,
  ClipboardList, Award, Clock, MapPin, ChevronDown, Sun, Moon
} from "lucide-react";
import { ModeToggle } from "@/components/layout/toggle-mode";
import { GLOBAL_STYLES } from "@/lib/styles";

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
  {
    icon: Users,
    title: "Employee Records",
    desc: "Manage complete employee profiles, personal data sheets, and employment history in one secure place.",
    image: "/employeerecord.jpg",
    tag: "Employee Records",
    backTitle: "Your Complete Profile",
    backColor: "#1565C0",
    details: [
      "View & update your Personal Data Sheet (CS Form 212)",
      "Access your full employment history and appointments",
      "Manage government IDs, eligibilities, and education records",
      "Update family background and character references",
    ],
  },
  {
    icon: ClipboardList,
    title: "Leave Forms",
    desc: "File and track leave requests, approvals, and balances with automated workflows.",
    image: "/leave.jpg",
    tag: "Leave Management",
    backTitle: "Hassle-Free Leave Filing",
    backColor: "#1565C0",
    details: [
      "File vacation, sick, maternity, and other leave types online",
      "Track real-time approval status of your requests",
      "View remaining leave balance per leave type",
      "Receive notifications on approvals or rejections instantly",
    ],
  },
  {
    icon: BarChart3,
    title: "Real-Time Attendance",
    desc: "Monitor daily attendance, tardiness, and absences with live dashboard updates.",
    image: "/Attendance.jpg",
    tag: "Attendance Tracking",
    backTitle: "Always Know Your Status",
    backColor: "#1565C0",
    details: [
      "View your daily time-in and time-out records",
      "Monitor tardiness, absences, and undertime at a glance",
      "Access monthly attendance summary and DTR reports",
      "Biometric integration for accurate real-time tracking",
    ],
  },
  {
    icon: Award,
    title: "Payroll",
    desc: "Automated payroll computation with deductions, allowances, and payslip generation.",
    image: "/payroll.jpg",
    tag: "Payroll System",
    backTitle: "Transparent Pay Management",
    backColor: "#1565C0",
    details: [
      "View detailed payslips with all deductions and allowances",
      "Track GSIS, PhilHealth, and Pag-IBIG contributions",
      "Access historical payroll records anytime",
      "Automated 13th month pay and year-end benefit computation",
    ],
  },
  {
    icon: FileText,
    title: "Loans & Benefits",
    desc: "Track employee loans, GSIS, Pag-IBIG, and government benefit applications in one place.",
    image: "/loan.jpg",
    tag: "Loans & Benefits",
    backTitle: "Benefits at Your Fingertips",
    backColor: "#1565C0",
    details: [
      "Monitor outstanding GSIS and Pag-IBIG loan balances",
      "Apply for government loans directly through the portal",
      "Track monthly amortization and remaining loan terms",
      "View all benefit entitlements and availment history",
    ],
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    desc: "Built with government data privacy standards and CSC compliance requirements in mind.",
    image: "/securecomp.jpg",
    tag: "Secure & Compliant",
    backTitle: "Your Data Is Protected",
    backColor: "#1565C0",
    details: [
      "Fully compliant with the Data Privacy Act of 2012 (RA 10173)",
      "Role-based access control for all HR data",
      "Encrypted data transmission and secure cloud storage",
      "Regular security audits aligned with CSC standards",
    ],
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1, category: "HR Advisory", badge: "New", badgeColor: "#1565C0", date: "June 10, 2026",
    title: "Submission of Updated Personal Data Sheet (CS Form 212)",
    body: "All city government employees are hereby directed to submit an updated CS Form 212 to the Human Resource Management Office on or before June 30, 2025. Failure to comply may affect the processing of your benefits and salary adjustments.",
    author: "City Human Resource Management Office",
  },
  {
    id: 2, category: "Memorandum", badge: "Urgent", badgeColor: "#1565C0", date: "June 5, 2026",
    title: "Mandatory Anti-Sexual Harassment Seminar for All City Employees",
    body: "Pursuant to Republic Act No. 7877, all city government employees are required to attend the scheduled Anti-Sexual Harassment Seminar. Schedule and venue will be announced per department through the HRIS portal.",
    author: "Office of the City Mayor",
  },
  {
    id: 3, category: "General Announcement", badge: "Open", badgeColor: "#1565C0", date: "May 28, 2026",
    title: "Job Vacancy: Administrative Officer II (Human Resource)",
    body: "The City Government is accepting applications for the position of Administrative Officer II in the HRMO. Interested and qualified applicants must submit complete documentary requirements to the HRMO not later than June 20, 2025.",
    author: "City Human Resource Management Office",
  },
  {
    id: 4, category: "Wellness Program", badge: "Upcoming", badgeColor: "#1565C0", date: "May 20, 2027",
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
>>>>>>> 1f9506587acb985fcbf95ce8b370684165afdc95


import AnnouncementSlideshow from "@/components/layout/landing-page/AnnouncementsSlideshow";
import CTASection from '@/components/layout/landing-page/CTASection';
import FeaturesSection from '@/components/layout/landing-page/FeaturesSection';
import Footer from '@/components/layout/landing-page/Footer';
import HeroSection from '@/components/layout/landing-page/HeroSection';

import Navbar from '@/components/layout/landing-page/Navbar';


const page = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AnnouncementSlideshow />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default page