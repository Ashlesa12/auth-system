export const API_BASE = "http://127.0.0.1:8000";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "An error occurred";
    try {
      const data = await response.json();
      errorMsg = data.detail || errorMsg;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMsg);
  }

  return response;
}
