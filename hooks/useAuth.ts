// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/api/personal-info/auth";

interface UseAuthOptions {
  required?: boolean;
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { required = true, redirectTo = "/login" } = options;
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Skip auth check on login/register to avoid loops
    if (pathname === "/login" || pathname === "/register") {
      setChecking(false);
      return;
    }

    const authStatus = isAuthenticated();
    setAuthed(authStatus);

    if (required && !authStatus) {
      // Save return path
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname || "/");
      }
      router.replace(redirectTo);
    } else {
      setChecking(false);
    }
  }, [required, redirectTo, router, pathname]);

  return {
    isAuthenticated: authed,
    loading: checking,
    logout: () => {
      logout();
      router.replace("/login");
    },
  };
}