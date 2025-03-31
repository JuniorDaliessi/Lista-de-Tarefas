import { Todo } from './Todo';

export interface KanbanColumn {
  id: string;
  title: string;
  wipLimit?: number; // Optional WIP limit for the column
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  columns: KanbanColumn[];
  todoIds: string[]; // References to todos that belong to this project
  createdAt: string;
  updatedAt: string;
}

// Types for the default columns
export type DefaultColumnId = 'backlog' | 'in-progress' | 'review' | 'done';

// Type for Kanban task status
export type KanbanStatus = DefaultColumnId | string; // Can be a default column or a custom one

// For tracking metrics
export interface TaskMetrics {
  todoId: string;
  columnChanges: {
    columnId: string;
    enteredAt: string;
    leftAt?: string; // undefined if still in this column
  }[];
} 