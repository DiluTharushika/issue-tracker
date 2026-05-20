export type AuthUser = {
  id: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user?: AuthUser;
};