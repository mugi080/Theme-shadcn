const API_URL = "https://hris-backend.domainhostpro.uk/api/web_login"

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  if (!res.ok) {
    throw new Error("Invalid login")
  }

  return res.json()
}
