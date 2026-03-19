// lib/security.ts

/**
 * 🔐 Sanitize user input to prevent XSS (Cross-Site Scripting)
 * Use this before displaying user-generated content or sending to API
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers like onclick=
    .trim();
}

/**
 * 🔐 Validate that an ID is safe (alphanumeric + underscore/hyphen only)
 * Prevents path traversal or injection attacks
 */
export function isValidId(id: string | null | undefined): boolean {
  return !!id && /^[a-zA-Z0-9_-]{3,50}$/.test(id);
}

/**
 * 🔐 Validate token format (basic check for JWT-like strings)
 */
export function isValidToken(token: string | null | undefined): boolean {
  return !!token && token.length > 20 && /^[a-zA-Z0-9._-]+$/.test(token);
}

/**
 * 🔐 Escape HTML entities for safe display in the UI
 * Use when you MUST render user content as HTML (rare)
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 🔐 Generate a random nonce for Content-Security-Policy (advanced)
 * Only needed if you use inline scripts (which you should avoid)
 */
export function generateNonce(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).substring(2);
}