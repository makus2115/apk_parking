import { API_BASE } from "../../api/config";

const DEFAULT_API_URL = API_BASE;
const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

type DbUser = {
  id: number;
  email: string;
  password: string;
  name: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
};

export type RegisterResponse = {
  user: {
    id: number;
    email: string;
    name: string;
  };
};

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function findUserByCredentials(
  email: string,
  password: string
): Promise<DbUser | null> {
  const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  const res = await fetch(`${API_URL}/users?${query}`);
  const users = await handle<DbUser[]>(res);
  return users[0] ?? null;
}

async function findUserByEmail(email: string): Promise<DbUser | null> {
  const query = `email=${encodeURIComponent(email)}`;
  const res = await fetch(`${API_URL}/users?${query}`);
  const users = await handle<DbUser[]>(res);
  return users[0] ?? null;
}

async function createUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<DbUser> {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<DbUser>(res);
}

async function createSession(userId: number, token: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token, createdAt: new Date().toISOString() }),
    });
    await handle(res);
  } catch {
    // ignore session persistence errors
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const user = await findUserByCredentials(email, password);
  if (!user) {
    throw new Error("Niepoprawny e-mail lub haslo.");
  }

  const token = `session-${user.id}-${Date.now()}`;
  await createSession(user.id, token);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("Uzytkownik z tym e-mailem juz istnieje.");
  }

  const user = await createUser({ name, email, password });
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}
