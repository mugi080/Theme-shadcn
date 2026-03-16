// hooks/useIdleTimer.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { logout } from "@/lib/api/personal-info/auth";

interface UseIdleTimerOptions {
  timeout?: number; // milliseconds (default: 15 minutes)
  onIdle?: () => void;
  onActive?: () => void;
  enabled?: boolean;
  promptBeforeIdle?: boolean; // Show warning before logout
  promptTimeout?: number; // Time to show warning before idle (default: 2 minutes)
}

export function useIdleTimer(options: UseIdleTimerOptions = {}) {
  const {
    timeout = 15 * 60 * 1000, // 15 minutes default
    onIdle,
    onActive,
    enabled = true,
    promptBeforeIdle = true,
    promptTimeout = 2 * 60 * 1000, // 2 minutes warning
  } = options;

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const promptTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isIdleRef = useRef(false);
  const isWarningShownRef = useRef(false); // 🔐 Track if warning was already shown

  // 🔐 Safe logout wrapper
  const handleIdle = useCallback(() => {
    if (isIdleRef.current) return;
    isIdleRef.current = true;
    
    if (onIdle) {
      onIdle();
    } else {
      // Default: logout and redirect
      logout();
    }
  }, [onIdle]);

  // 🔐 Show warning (dispatches event for SessionWarning component)
  const showWarning = useCallback(() => {
    if (isWarningShownRef.current) return; // Prevent duplicate warnings
    isWarningShownRef.current = true;
    
    if (typeof window !== "undefined") {
      // Dispatch custom event that SessionWarning listens to
      window.dispatchEvent(new CustomEvent("session:warning"));
    }
  }, []);

  // Reset idle timer (called on user activity)
  const resetTimer = useCallback(() => {
    if (!enabled) return;
    
    // Clear prompt timer if user becomes active again
    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current);
      promptTimerRef.current = undefined;
    }
    
    // Reset warning flag if user was warned but became active again
    if (isWarningShownRef.current) {
      isWarningShownRef.current = false;
      if (typeof window !== "undefined") {
        // Tell SessionWarning to hide itself
        window.dispatchEvent(new CustomEvent("session:warning:hide"));
      }
    }
    
    // Reset idle state
    if (isIdleRef.current) {
      isIdleRef.current = false;
      onActive?.();
    }

    // Clear main timer
    clearTimeout(timerRef.current);
    
    // Set prompt warning if enabled
    if (promptBeforeIdle && timeout > promptTimeout) {
      promptTimerRef.current = setTimeout(() => {
        showWarning();
      }, timeout - promptTimeout);
    }
    
    // Set actual idle timeout
    timerRef.current = setTimeout(handleIdle, timeout);
  }, [enabled, timeout, promptTimeout, promptBeforeIdle, handleIdle, onActive, showWarning]);

  // Manual reset function (exposed to caller)
  const manualReset = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) return;

    // Events that count as "user activity"
    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "mousemove",
      "keypress",
      "click",
      "focus",
    ];

    // Attach listeners with passive: true for performance
    const listenerOptions = { passive: true };
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, listenerOptions);
    });

    // Initialize timer on mount
    resetTimer();

    // Cleanup on unmount
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(promptTimerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [enabled, resetTimer]);

  // 🔐 Expose reset function and idle state
  return {
    reset: manualReset,
    isIdle: isIdleRef.current,
  };
}