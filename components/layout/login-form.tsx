"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login, isAuthenticated } from "@/lib/api/personal-info/auth";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Redirect if already logged in (prevents confusion)
  useEffect(() => {
    if (isAuthenticated()) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath && redirectPath !== "/login" && redirectPath !== "/") {
        sessionStorage.removeItem("redirectAfterLogin");
        router.replace(redirectPath);
      } else {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  // 🔐 Sanitize input to prevent basic XSS (defense in depth)
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .trim();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic client-side validation
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Sanitize before sending to API
      const sanitizedUsername = sanitizeInput(username);
      const sanitizedPassword = password; // Don't sanitize password content, just validate length

      const data = await login(sanitizedUsername, sanitizedPassword);

      // Save token and employee_id
      if (data.token) localStorage.setItem("access_token", data.token);
      if (data.account?.employee?.employee_id) {
        localStorage.setItem("employee_id", data.account.employee.employee_id);
      }

      // 🔐 Redirect to intended page or dashboard
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath && redirectPath !== "/login" && redirectPath !== "/") {
        sessionStorage.removeItem("redirectAfterLogin");
        router.replace(redirectPath);
      } else {
        router.replace("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // 🔐 Don't expose internal error details to user
      const message = err.message || "Invalid username or password";
      const safeMessage = message.replace(/[<>]/g, ""); // Basic sanitization
      alert(safeMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your username and password
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            // 🔐 Prevent autofill attacks
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={4} // Enforce minimum password length
          />
        </Field>

        <Field>
          <Button type="submit" disabled={loading || !username || !password}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* 🔐 Only show third-party login if backend supports it */}
        <Field>
          <Button variant="outline" type="button" disabled>
            Login with Google
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}