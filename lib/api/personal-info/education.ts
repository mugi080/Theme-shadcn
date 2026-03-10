import { Education, CreateEducationPayload } from "./education.types";
import { API_BASE } from "@/lib/base";

/* ---------------------------------------
   Auth Headers
--------------------------------------- */

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/* ---------------------------------------
   Response Handler
--------------------------------------- */

async function handleResponse<T>(res: Response): Promise<T> {
  let data: any = null;

  try {
    data = await res.json();
  } catch {
    // backend returned empty body
  }

  if (!res.ok) {
    console.error("API ERROR:", {
      status: res.status,
      data,
    });

    throw new Error(data?.message || res.statusText || "API request failed");
  }

  return data;
}

/* ---------------------------------------
   Education API
--------------------------------------- */

export const educationApi = {
  /* ---------------------------------------
     GET all education by employee
     GET /get_education/:employeeId
  --------------------------------------- */
  async getAll(employeeId: string): Promise<Education[]> {
    const res = await fetch(`${API_BASE}/get_education/${employeeId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<Education[] | { data: Education[] }>(res);

    return Array.isArray(data) ? data : data?.data ?? [];
  },

  /* ---------------------------------------
     CREATE education
     POST /insert_education/:employeeId
  --------------------------------------- */
  async create(
    employeeId: string,
    payload: CreateEducationPayload
  ): Promise<Education> {
    const res = await fetch(`${API_BASE}/insert_education/${employeeId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse<Education>(res);
  },

  /* ---------------------------------------
     UPDATE education
     PUT /update_education/:education_id
  --------------------------------------- */
  async update(
    education_id: string,
    payload: Partial<CreateEducationPayload>
  ): Promise<Education> {
    const res = await fetch(`${API_BASE}/update_education/${education_id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse<Education>(res);
  },

  /* ---------------------------------------
     DELETE education
     DELETE /delete_education/:education_id
  --------------------------------------- */
  async delete(education_id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/delete_education/${education_id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    await handleResponse(res);
  },
};