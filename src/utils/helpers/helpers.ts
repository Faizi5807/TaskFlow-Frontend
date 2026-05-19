import type { ITask } from "../../config/interfaces/create-task";
import type { TaskStatus } from "../../config/types/lists";

/**
 * Derives the task status from its boolean flags
 */
export function getTaskStatus(task: ITask): TaskStatus {
  if (task.isCompleted) return "completed";
  if (task.hasStarted) return "in-progress";
  return "todo";
}

/**
 * Returns a human-readable label for task status
 */
export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
  }
}

/**
 * Formats an ISO date string to a readable format
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Returns relative time like "2 hours ago"
 */
export function timeAgo(dateString: string | null): string {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateString);
}

/**
 * Generates user initials from name or email
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
