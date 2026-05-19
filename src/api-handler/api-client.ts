import { getToken, clearAuth } from "../store/auth-store";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

interface RequestOptions {
  body?: unknown;
  requiresAuth?: boolean;
}

async function request<T>(
  method: HttpMethod,
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, requiresAuth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PATCH")) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  // Handle 204 No Content (e.g. DELETE)
  if (response.status === 204) {
    return { success: true, message: "Success", data: null as T };
  }

  // Handle 401 — clear auth and redirect
  if (response.status === 401) {
    clearAuth();
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage) as Error & {
      status: number;
      data: unknown;
    };
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: <T>(url: string, requiresAuth = true) =>
    request<T>("GET", url, { requiresAuth }),

  post: <T>(url: string, body: unknown, requiresAuth = true) =>
    request<T>("POST", url, { body, requiresAuth }),

  patch: <T>(url: string, body?: unknown, requiresAuth = true) =>
    request<T>("PATCH", url, { body, requiresAuth }),

  delete: <T>(url: string, requiresAuth = true) =>
    request<T>("DELETE", url, { requiresAuth }),
};
