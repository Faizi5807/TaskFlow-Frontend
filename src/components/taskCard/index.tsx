import type { ITask } from "../../config/interfaces/create-task";
import { getTaskStatus, getStatusLabel, timeAgo } from "../../utils/helpers/helpers";
import styles from "./styles.module.css";

interface TaskCardProps {
  task: ITask;
  onStart?: (id: number) => void;
  onComplete?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (task: ITask) => void;
  loading?: boolean;
  isAdmin?: boolean;
}

export default function TaskCard({
  task,
  onStart,
  onComplete,
  onDelete,
  onClick,
  loading = false,
  isAdmin = false,
}: TaskCardProps) {
  const status = getTaskStatus(task);
  const statusLabel = getStatusLabel(status);

  const statusClass =
    status === "todo"
      ? styles.todo
      : status === "in-progress"
      ? styles.inProgress
      : styles.completed;

  const badgeClass =
    status === "todo"
      ? styles.badgeTodo
      : status === "in-progress"
      ? styles.badgeInProgress
      : styles.badgeCompleted;

  return (
    <div
      className={`${styles.card} ${statusClass}`}
      onClick={() => onClick?.(task)}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={`${styles.badge} ${badgeClass}`}>
          {status === "in-progress" && (
            <svg width="8" height="8" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4" fill="currentColor" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          )}
          {statusLabel}
        </span>
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {timeAgo(task.updatedAt || task.createdAt)}
        </div>
        <div className={styles.metaItem}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          ID: {task.assignedToId}
        </div>
      </div>

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        {status === "todo" && onStart && (
          <button
            className={`${styles.actionBtn} ${styles.startBtn}`}
            onClick={() => onStart(task.id)}
            disabled={loading}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start
          </button>
        )}
        {status === "in-progress" && onComplete && (
          <button
            className={`${styles.actionBtn} ${styles.completeBtn}`}
            onClick={() => onComplete(task.id)}
            disabled={loading}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Complete
          </button>
        )}
        {isAdmin && onDelete && (
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(task.id)}
            disabled={loading}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
