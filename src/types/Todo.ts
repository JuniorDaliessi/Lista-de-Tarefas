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
} 