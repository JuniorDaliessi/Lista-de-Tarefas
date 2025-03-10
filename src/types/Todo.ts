export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  priority: 'baixa' | 'média' | 'alta';
  createdAt: string;
  category: string;
} 