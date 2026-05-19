import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../config/constants/auth";
import type { IAuthUser } from "../config/interfaces/auth";

/**
 * Saves JWT token to localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Retrieves JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Saves user info to localStorage
 */
export function setUser(user: IAuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/**
 * Retrieves user info from localStorage
 */
export function getUser(): IAuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IAuthUser;
  } catch {
    return null;
  }
}

/**
 * Checks if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Clears all auth data (logout)
 */
export function clearAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Decodes JWT payload without verification (for reading claims client-side)
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
