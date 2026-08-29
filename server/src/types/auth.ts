export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  name: string;
}
