export type TaskStatus = "todo" | "in-progress" | "completed";

export type ToastType = "success" | "error" | "warning" | "info";

export interface IToast {
  id: string;
  message: string;
  type: ToastType;
}
