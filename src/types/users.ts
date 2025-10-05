export interface User {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
  // password?: string;
  avatar_url?: string;
  role: 'user' | 'consultant';
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O';
  profession?: string;
  location?: string;
  is_active?: boolean;
}

export interface CreateUserPayload {
  name: string;
  phone_number: string;
  email?: string;
  // password: string;
  avatar_url?: string;
  role: 'user' | 'consultant';
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O';
  profession?: string;
  location?: string;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}
