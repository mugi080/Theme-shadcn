"use client";

import { useEffect, useState } from "react";
import { apiFetch, getEmployeeId, logout } from "@/lib/api/personal-info/auth";

interface UserInfo {
  firstname: string;
  middlename: string;
  surname: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo>({ firstname: "", middlename: "", surname: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const employeeId = getEmployeeId();

  // Fetch employee info on mount
  useEffect(() => {
    if (!employeeId) {
      logout(); // redirect to login if no employee ID
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await apiFetch(`/protected/view_employee/${employeeId}`);
        if (data.success && data.data) {
          const emp = data.data;
          console.log("Fetched employee data:", data);
          setUser({
            firstname: emp.firstname || "",
            middlename: emp.middlename || "",
            surname: emp.surname || "",
          });
        } else {
          setError("Employee data not found");
        }
      } catch (err: any) {
        // apiFetch already handles 401 + redirect automatically
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [employeeId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save updated user info
  const handleSave = async () => {
    if (!employeeId) return;

    setSaving(true);
    setError(null);
    try {
      const data = await apiFetch(`/protected/update_employee/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(user),
      });

      if (data.success) {
        setEditing(false);
      } else {
        setError(data.message || "Failed to update data");
      }
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4 text-center text-gray-600">Loading employee data...</p>;
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-500 hover:underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-5xl mx-auto">
      {/* Employee info card */}
      <div className="p-4 border rounded-lg bg-white/20 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Employee</h2>

        </div>

        {!editing ? (
          <>
            <p className="text-gray-800">
              {user.firstname || "-"} {user.middlename || "-"} {user.surname || "-"}
            </p>
            <button
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={user.firstname}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="middlename"
                placeholder="Middle Name"
                value={user.middlename}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={user.surname}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Placeholder cards or widgets */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
    </div>
  );
}