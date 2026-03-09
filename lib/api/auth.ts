const API_URL = "https://api.city-hr.gov"

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!res.ok) {
    throw new Error("Invalid login")
  }

  return res.json()
}