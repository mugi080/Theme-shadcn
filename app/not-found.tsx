"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/api/personal-info/auth";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthed(auth);

    const timer = setTimeout(() => {
      if (pathname.startsWith("/admin")) {
        router.replace("/login");
        return;
      }

      if (!auth) {
        router.replace("/login");
      } else {
        router.replace("/dashboard");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [router, pathname]);

  let message = "Redirecting...";

  if (pathname.startsWith("/admin")) {
    message = "This section is not accessible. Redirecting...";
  } else if (authed === true) {
    message =
      "The page you're looking for doesn't exist. Redirecting to dashboard...";
  } else if (authed === false) {
    message =
      "You need to be logged in to access this page. Redirecting to login...";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
      <div className="text-8xl font-bold text-gray-300 mb-4">404</div>

      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Page not found
      </h1>

      <p className="text-gray-500 mb-6 max-w-md">{message}</p>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>Redirecting...</span>
      </div>
    </div>
  );
}