export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  priority: 'baixa' | 'média' | 'alta';
  createdAt: string;
  category: string;
  subtasks: SubTask[];
  
  // New Kanban related properties
  projectId?: string; // Which project this todo belongs to (if any)
  columnId?: string; // Which column this todo is in (if part of a project)
  order?: number; // Order within the column
  
  // Metrics for Kanban analysis
  startedAt?: string; // When work began (entered in-progress)
  completedAt?: string; // When marked as done
} 