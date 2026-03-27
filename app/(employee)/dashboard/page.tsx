// app/test-fetch/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/personal-info/auth";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiFetch(
          "/protected/view_changeinforequest/Ja94d0410-75df-4d6b-ba16-fda0df03b1f6",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-destructive">Error: {error}</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Fetch Result</h1>
      <pre className="p-4 bg-muted rounded-lg overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}