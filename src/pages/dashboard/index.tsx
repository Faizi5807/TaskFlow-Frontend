import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import TaskCard from "../../components/taskCard";
import Button from "../../components/button";
import Modal from "../../components/modal";
import InputField from "../../components/inputField";
import { useToast } from "../../components/toast";
import { useAuth } from "../../store/auth-context";
import { apiClient } from "../../api-handler/api-client";
import { API_URLS } from "../../api-handler/api-urls";
import { UserRole } from "../../config/constants/auth";
import type { ITask } from "../../config/interfaces/create-task";
import type { TaskStatus } from "../../config/types/lists";
import { getTaskStatus } from "../../utils/helpers/helpers";
import styles from "./styles.module.css";

type FilterType = "all" | TaskStatus;

export default function DashboardPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create task form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Edit task modal
  const [editTask, setEditTask] = useState<ITask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  const isAdmin = user?.role === UserRole.Administrator || user?.role === 3;

  const fetchTasks = useCallback(async () => {
    try {
      const response = await apiClient.get<ITask[]>(API_URLS.TASKS);
      setTasks(response.data || []);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to load tasks",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter & search
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" || getTaskStatus(task) === filter;
    const matchesSearch =
      !search.trim() ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const totalTasks = tasks.length;
  const todoCount = tasks.filter((t) => getTaskStatus(t) === "todo").length;
  const progressCount = tasks.filter((t) => getTaskStatus(t) === "in-progress").length;
  const completedCount = tasks.filter((t) => getTaskStatus(t) === "completed").length;

  // Create task
  const handleCreateTask = async () => {
    if (!newTitle.trim()) {
      showToast("Please enter a task title.", "warning");
      return;
    }
    setCreateLoading(true);
    try {
      await apiClient.post(API_URLS.TASKS, {
        title: newTitle,
        description: newDescription,
        assignedToId: newAssignedTo ? Number(newAssignedTo) : null,
      });
      showToast("Task created successfully! 🎉", "success");
      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      setNewAssignedTo("");
      fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to create task",
        "error"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // Start task
  const handleStartTask = async (id: number) => {
    setActionLoading(true);
    try {
      await apiClient.patch(API_URLS.MARK_STARTED(id));
      showToast("Task started! 🚀", "success");
      fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to start task",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Complete task
  const handleCompleteTask = async (id: number) => {
    setActionLoading(true);
    try {
      await apiClient.patch(API_URLS.MARK_COMPLETED(id));
      showToast("Task completed! ✅", "success");
      fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to complete task",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setActionLoading(true);
    try {
      await apiClient.delete(API_URLS.TASK_BY_ID(id));
      showToast("Task deleted.", "success");
      fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete task",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal
  const handleTaskClick = (task: ITask) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // Update task
  const handleUpdateTask = async () => {
    if (!editTask) return;
    if (!editTitle.trim()) {
      showToast("Title cannot be empty.", "warning");
      return;
    }
    setEditLoading(true);
    try {
      await apiClient.patch(API_URLS.TASK_BY_ID(editTask.id), {
        title: editTitle,
        description: editDescription,
      });
      showToast("Task updated successfully!", "success");
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update task",
        "error"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const filterTabs: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All Tasks", count: totalTasks },
    { key: "todo", label: "To Do", count: todoCount },
    { key: "in-progress", label: "In Progress", count: progressCount },
    { key: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.content}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1>Dashboard</h1>
            <p>Manage and track your team's tasks</p>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              size="md"
              onClick={fetchTasks}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              }
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowCreateModal(true)}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              }
            >
              New Task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconTotal}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalTasks}</span>
              <span className={styles.statLabel}>Total Tasks</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconTodo}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{todoCount}</span>
              <span className={styles.statLabel}>To Do</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconProgress}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{progressCount}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statIconDone}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{completedCount}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className={styles.filterSection}>
          <div className={styles.filterTabs}>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.filterTab} ${filter === tab.key ? styles.filterTabActive : ""}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
                <span className={styles.filterCount}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="page-loader">
            <div className="spinner spinner--dark" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <h3>{search ? "No matching tasks" : "No tasks yet"}</h3>
            <p>
              {search
                ? "Try adjusting your search or filter criteria"
                : "Create your first task to get started"}
            </p>
            {!search && (
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.taskGrid}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={handleStartTask}
                onComplete={handleCompleteTask}
                onDelete={isAdmin ? handleDeleteTask : undefined}
                onClick={handleTaskClick}
                loading={actionLoading}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={createLoading} onClick={handleCreateTask}>
              Create Task
            </Button>
          </>
        }
      >
        <InputField
          label="Task Title"
          type="text"
          placeholder="Enter task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <InputField
          label="Description"
          isTextarea
          placeholder="Describe the task..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <div className={styles.formRow}>
          <label className={styles.formLabel}>Assign to (User ID)</label>
          <input
            className={styles.assignInput}
            type="number"
            placeholder="Enter user ID to assign"
            value={newAssignedTo}
            onChange={(e) => setNewAssignedTo(e.target.value)}
            min={1}
          />
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        title="Edit Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTask(null)}>
              Cancel
            </Button>
            <Button variant="primary" loading={editLoading} onClick={handleUpdateTask}>
              Save Changes
            </Button>
          </>
        }
      >
        <InputField
          label="Task Title"
          type="text"
          placeholder="Enter task title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <InputField
          label="Description"
          isTextarea
          placeholder="Describe the task..."
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </Modal>
    </div>
  );
}
