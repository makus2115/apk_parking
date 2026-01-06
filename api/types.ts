export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
};

export type PublicUser = Omit<User, "password">;

export type Session = {
  id: number;
  userId: number;
  token: string;
  createdAt: string;
};

export type LoginResponse = {
  token: string;
  user: PublicUser;
};
