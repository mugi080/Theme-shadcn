// components/ui/session-warning.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/personal-info/auth";

interface SessionWarningProps {
  warningTime?: number; // Show warning this many ms before logout (default: 2 minutes)
  onStayAlive?: () => void; // Called when user clicks "Stay Logged In"
}

export function SessionWarning({ 
  warningTime = 2 * 60 * 1000, // 2 minutes default
  onStayAlive 
}: SessionWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(warningTime / 1000));

  // 🔐 Listen for warning events from useIdleTimer
  useEffect(() => {
    const handleShowWarning = () => {
      setShowWarning(true);
      setSecondsLeft(Math.floor(warningTime / 1000)); // Reset countdown
    };
    
    const handleHideWarning = () => {
      setShowWarning(false);
    };
    
    window.addEventListener("session:warning", handleShowWarning);
    window.addEventListener("session:warning:hide", handleHideWarning);
    
    return () => {
      window.removeEventListener("session:warning", handleShowWarning);
      window.removeEventListener("session:warning:hide", handleHideWarning);
    };
  }, [warningTime]);

  // Countdown timer when warning is shown
  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          logout(); // Auto-logout when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  // Handle "Stay Logged In" click
  const handleStayAlive = () => {
    setShowWarning(false);
    onStayAlive?.(); // Notify parent to reset idle timer
    // Trigger a fake user event as fallback to reset idle timer
    window.dispatchEvent(new MouseEvent("mousemove"));
  };

  // Don't render anything if warning isn't active
  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h3 className="font-semibold text-gray-800 mb-2">⚠️ Session Expiring Soon</h3>
      <p className="text-sm text-gray-600 mb-4">
        You will be logged out in{" "}
        <span className="font-bold text-red-500">{secondsLeft}s</span>{" "}
        due to inactivity.
      </p>
      <div className="flex gap-2">
        <Button onClick={handleStayAlive} size="sm" className="bg-blue-500 hover:bg-blue-600">
          Stay Logged In
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setShowWarning(false);
            logout();
          }}
        >
          Logout Now
        </Button>
      </div>
    </div>
  );
}