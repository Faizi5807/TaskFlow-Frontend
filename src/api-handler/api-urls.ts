const BASE_URL = "https://jira-fu8g.onrender.com/api";

export const API_URLS = {
  // Auth
  REGISTER: `${BASE_URL}/user`,
  LOGIN: `${BASE_URL}/auth/login`,

  // Tasks
  TASKS: `${BASE_URL}/task`,
  TASK_BY_ID: (id: number) => `${BASE_URL}/task/${id}`,
  MARK_STARTED: (id: number) => `${BASE_URL}/task/mark-started/${id}`,
  MARK_COMPLETED: (id: number) => `${BASE_URL}/task/mark-completed/${id}`,
} as const;
