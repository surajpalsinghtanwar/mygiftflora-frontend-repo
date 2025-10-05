export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: null | { [key: string]: any };
  token: string | null;
  loading: boolean;
  error: string | null;
}
