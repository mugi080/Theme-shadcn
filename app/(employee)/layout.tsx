// app/(employee)/layout.tsx
"use client";

import { ReactNode, useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { SessionWarning } from "@/components/layout/session-warning";
import { Header } from "@/components/layout/employee-header";
// ✅ Dynamic import for sidebar (avoids SSR issues with browser APIs)
const AppSidebar = dynamic(
  () => import("@/components/layout/app-sidebar").then((mod) => mod.AppSidebar),
  { ssr: false }
);

interface EmployeeLayoutProps {
  children: ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // 🔐 Ref to manually reset idle timer when user clicks "Stay Logged In"
  const idleTimerResetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔐 Callback: called when user clicks "Stay Logged In"
  const handleStayAlive = useCallback(() => {
    // Reset the idle timer manually via stored reference
    idleTimerResetRef.current?.();
    console.log("User stayed active - idle timer reset");
  }, []);

  // 🔐 Initialize idle timer with warning support
  const { reset: resetIdleTimer } = useIdleTimer({
    
    timeout: 15 * 60 * 1000,      // ✅ 15 minutes total (enterprise standard)
    promptTimeout: 2 * 60 * 1000, // ✅ Warning at 13 minutes (2 min warning)
    promptBeforeIdle: true,
    enabled: isAuthenticated && !authLoading,
    onIdle: () => {
      // Optional: custom logic before logout (default handled by useIdleTimer)
      console.log("User idle timeout - logging out");
    },
  });

  // 🔐 Store reset function so SessionWarning can access it
  useEffect(() => {
    
    idleTimerResetRef.current = resetIdleTimer;
  }, [resetIdleTimer]);

  // 🔐 Show loading while verifying session
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  // 🔐 Redirect if not authenticated (useAuth already redirects, but extra safety)
  if (!isAuthenticated) {
    return null;
  }

  // 🔐 Wait for client mount before rendering browser-dependent UI
  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar Navigation */}
        <AppSidebar />

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col flex-1">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6">{children}</main>

          {/* 🔐 Session Warning Popup (auto-logout warning) */}
          <SessionWarning
            warningTime={2 * 60 * 1000} // Show warning 2 minutes before logout
            onStayAlive={handleStayAlive} // Reset timer when user stays active
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}