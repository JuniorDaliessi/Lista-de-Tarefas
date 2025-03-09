import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../types/Todo';
import * as LocalStorageService from '../services/localStorage';

interface TodoContextProps {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: string;
  sortBy: string;
  setFilter: (filter: string) => void;
  setSortBy: (sortBy: string) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
}

const TodoContext = createContext<TodoContextProps | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('data');

  // Carregar tarefas do localStorage na inicialização
  useEffect(() => {
    const storedTodos = LocalStorageService.getTodos();
    setTodos(storedTodos);
  }, []);

  // Filtrar e ordenar tarefas com base nos critérios selecionados
  const filteredTodos = React.useMemo(() => {
    let result = [...todos];
    
    // Aplicar filtro
    if (filter === 'pendentes') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'concluídas') {
      result = result.filter(todo => todo.completed);
    }
    
    // Aplicar ordenação
    if (sortBy === 'data') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'prioridade') {
      const priorityOrder = { 'alta': 0, 'média': 1, 'baixa': 2 };
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'alfabética') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'criação') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return result;
  }, [todos, filter, sortBy]);

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedTodos = LocalStorageService.addTodo(newTodo);
    setTodos(updatedTodos);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    const updatedTodos = LocalStorageService.updateTodo(updatedTodo);
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = LocalStorageService.deleteTodo(id);
    setTodos(updatedTodos);
  };

  const handleToggleTodoCompletion = (id: string) => {
    const updatedTodos = LocalStorageService.toggleTodoCompletion(id);
    setTodos(updatedTodos);
  };

  const value = {
    todos,
    filteredTodos,
    filter,
    sortBy,
    setFilter,
    setSortBy,
    addTodo: handleAddTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    toggleTodoCompletion: handleToggleTodoCompletion,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = (): TodoContextProps => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo deve ser usado dentro de um TodoProvider');
  }
  return context;
}; 