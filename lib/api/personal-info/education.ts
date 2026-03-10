import { Education, CreateEducationPayload, UpdateEducationPayload } from "./education.types";

const BASE_URL = "https://hris-backend.domainhostpro.uk/api/protected";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Something went wrong");
  }
  return res.json();
}

export const educationApi = {
  // GET all education records for an employee
  // GET /get_education/:employeeId
  getAll: async (employeeId: string): Promise<Education[]> => {
    const res = await fetch(`${BASE_URL}/get_education/${employeeId}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<Education[] | { data: Education[] }>(res);
    // Handle both array response or { data: [...] } wrapper
    return Array.isArray(data) ? data : data.data;
  },

  // POST /insert_education/:employeeId
  create: async (employeeId: string, payload: CreateEducationPayload): Promise<Education> => {
    const res = await fetch(`${BASE_URL}/insert_education/${employeeId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<Education>(res);
  },

  // PUT /update_education/:id
  update: async (id: string, payload: Partial<CreateEducationPayload>): Promise<Education> => {
    const res = await fetch(`${BASE_URL}/update_education/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<Education>(res);
  },

  // DELETE /delete_education/:id
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/delete_education/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(res);
  },
};