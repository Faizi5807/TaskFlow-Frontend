export interface ICreateTaskPayload {
  title: string;
  description: string;
  assignedToId: number | null;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  hasStarted: boolean;
  isCompleted: boolean;
  createdById: number;
  createdBy: string | null;
  assignedToId: number;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}
