import type { ITask } from "../../config/interfaces/create-task";

/**
 * Parses raw API task data into a typed ITask object
 */
export function parseTask(raw: Record<string, unknown>): ITask {
  return {
    id: raw.id as number,
    title: raw.title as string,
    description: raw.description as string,
    hasStarted: raw.hasStarted as boolean,
    isCompleted: raw.isCompleted as boolean,
    createdById: raw.createdById as number,
    createdBy: (raw.createdBy as string) ?? null,
    assignedToId: raw.assignedToId as number,
    assignedTo: (raw.assignedTo as string) ?? null,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
    startedAt: (raw.startedAt as string) ?? null,
    completedAt: (raw.completedAt as string) ?? null,
  };
}

/**
 * Parses an array of raw task objects
 */
export function parseTaskList(rawList: Record<string, unknown>[]): ITask[] {
  return rawList.map(parseTask);
}
