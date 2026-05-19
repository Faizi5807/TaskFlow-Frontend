const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5175";
export const API_URLS = {
  // Auth
  REGISTER: `${BASE_URL}/api/user`,
  LOGIN: `${BASE_URL}/api/auth/login`,

  // Tasks
  TASKS: `${BASE_URL}/api/task`,
  TASK_BY_ID: (id: number) => `${BASE_URL}/api/task/${id}`,
  MARK_STARTED: (id: number) => `${BASE_URL}/api/task/mark-started/${id}`,
  MARK_COMPLETED: (id: number) => `${BASE_URL}/api/task/mark-completed/${id}`,
} as const;
