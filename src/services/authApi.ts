const DEFAULT_API_URL = "http://localhost:3001";
const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = "Logowanie nie powiodło się";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") {
        message = data.message;
      }
    } catch {
      // ignore parsing errors
    }
    throw new Error(message);
  }

  const data = (await res.json()) as LoginResponse;
  if (!data?.token) {
    throw new Error("Brak tokenu w odpowiedzi serwera");
  }

  return data;
}
