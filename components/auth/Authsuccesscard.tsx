"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ─────────────────────────────────────────────────────────────────────────────
// AuthSuccessCard
// Full-page success state shown after login or password change.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthSuccessCardProps {
  title: string;
  body: string;
  onBack: () => void;
}

export default function AuthSuccessCard({ title, body, onBack }: AuthSuccessCardProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#EEF3FA" }}
    >
      <Card
        className="w-full max-w-md border-0 shadow-xl rounded-2xl overflow-hidden"
        style={{ animation: "hris-pop 0.4s ease both" }}
      >
        <CardContent className="px-8 py-10 flex flex-col items-center text-center gap-5">

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#E3F2FD" }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: "#1976D2" }} />
          </div>

          {/* Message */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{title}</h2>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>

          {/* Back button */}
          <Button
            onClick={onBack}
            className="hris-btn w-full h-10 text-white font-semibold border-0"
            style={{ backgroundColor: "#1976D2" }}
          >
            Back to Login
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}