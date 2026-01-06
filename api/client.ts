import { API_BASE } from "./config";
import type { LoginResponse, PublicUser, Session, User } from "./types";

const API_URL = API_BASE.replace(/\/$/, "");

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, name: user.name };
}

async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  const res = await fetch(`${API_URL}/users?${query}`);
  const users = await handle<User[]>(res);
  return users[0] ?? null;
}

async function createSession(
  userId: number,
  token: string
): Promise<Session | null> {
  try {
    const res = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token, createdAt: new Date().toISOString() }),
    });
    return await handle<Session>(res);
  } catch {
    return null;
  }
}

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await findUserByCredentials(email, password);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const token = `session-${user.id}-${Date.now()}`;
    await createSession(user.id, token);

    return { token, user: toPublicUser(user) };
  },
};
