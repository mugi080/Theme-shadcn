"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getEmployeeId, getToken, logout, apiFetch } from "@/lib/api/personal-info-employee/auth";


// ─── Types ────────────────────────────────────────────────────────────────────

interface Spouse {
  surname: string;
  firstname: string;
  middlename: string;
  name_ext: string;
  occupation: string;
  telephone_no: string;
  employer_business_name: string;
  business_address: string;
  relationship_status: string;
}

interface Parent {
  surname: string;
  firstname: string;
  middlename: string;
  name_ext: string;
  marital_status: string;
}

interface Child {
  children_id: number;
  child_name: string;
  child_birthdate: string;
  status: string;
  family_id: number;
}

interface FamilyBackground {
  family_id: number;
  employee_id: number;
  spouse: Spouse | null;
  father: Parent | null;
  mother: Parent | null;
  children: Child[];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FamilyBackgroundSection() {
  const employeeId = getEmployeeId();
  const token = getToken();

  const [data,    setData]    = useState<FamilyBackground | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId || !token) {
        logout();
        return;
      }

      setLoading(true);

      try {
        const res = await apiFetch(`/protected/family_background/${employeeId}`);
        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || "Failed to load family background.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading family background.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={30} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-sm text-red-500">
        {error}
      </div>
    );
  }

  
}