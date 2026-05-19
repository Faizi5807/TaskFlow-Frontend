export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  email: string;
  name: string;
  password: string;
  role: number;
}

export interface ILoginResponse {
  token: string;
  email: string;
}

export interface IRegisterResponse {
  id: number;
  email: string;
  name: string;
  registeredAt: string;
}

export interface IAuthUser {
  email: string;
  name?: string;
  role?: number;
  id?: number;
}
