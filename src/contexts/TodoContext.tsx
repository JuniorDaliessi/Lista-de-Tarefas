import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../types/Todo';
import * as LocalStorageService from '../services/localStorage';

interface TodoContextProps {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: string;
  sortBy: string;
  searchQuery: string;
  categories: string[];
  activeCategory: string;
  setFilter: (filter: string) => void;
  setSortBy: (sortBy: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
}

const TodoContext = createContext<TodoContextProps | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('data');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');
  const [categories, setCategories] = useState<string[]>([]);

  // Carregar tarefas e categorias do localStorage na inicialização
  useEffect(() => {
    const storedTodos = LocalStorageService.getTodos();
    setTodos(storedTodos);
    
    // Extrair categorias únicas das tarefas usando Array.reduce em vez de Set
    const uniqueCategories = storedTodos
      .map(todo => todo.category)
      .filter(Boolean)
      .reduce<string[]>((acc, category) => 
        acc.includes(category) ? acc : [...acc, category], 
      []);
    setCategories(uniqueCategories);
  }, []);

  // Filtrar e ordenar tarefas com base nos critérios selecionados
  const filteredTodos = React.useMemo(() => {
    let result = [...todos];
    
    // Aplicar filtro de categoria
    if (activeCategory !== 'todas') {
      result = result.filter(todo => todo.category === activeCategory);
    }
    
    // Aplicar filtro de status
    if (filter === 'pendentes') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'concluídas') {
      result = result.filter(todo => todo.completed);
    }
    
    // Aplicar busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        todo => 
          todo.title.toLowerCase().includes(query) || 
          todo.description.toLowerCase().includes(query)
      );
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
  }, [todos, filter, sortBy, searchQuery, activeCategory]);

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedTodos = LocalStorageService.addTodo(newTodo);
    setTodos(updatedTodos);
    
    // Atualizar categorias se necessário
    if (newTodo.category && !categories.includes(newTodo.category)) {
      setCategories(prev => [...prev, newTodo.category]);
    }
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    const updatedTodos = LocalStorageService.updateTodo(updatedTodo);
    setTodos(updatedTodos);
    
    // Atualizar categorias se necessário
    if (updatedTodo.category && !categories.includes(updatedTodo.category)) {
      setCategories(prev => [...prev, updatedTodo.category]);
    }
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = LocalStorageService.deleteTodo(id);
    setTodos(updatedTodos);
    
    // Recalcular categorias únicas usando Array.reduce em vez de Set
    const uniqueCategories = updatedTodos
      .map(todo => todo.category)
      .filter(Boolean)
      .reduce<string[]>((acc, category) => 
        acc.includes(category) ? acc : [...acc, category], 
      []);
    setCategories(uniqueCategories);
  };

  const handleToggleTodoCompletion = (id: string) => {
    const updatedTodos = LocalStorageService.toggleTodoCompletion(id);
    setTodos(updatedTodos);
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const handleDeleteCategory = (category: string) => {
    // Atualizar todas as tarefas que usam esta categoria
    const updatedTodos = todos.map(todo => 
      todo.category === category ? { ...todo, category: '' } : todo
    );
    
    LocalStorageService.saveTodos(updatedTodos);
    setTodos(updatedTodos);
    
    // Remover a categoria da lista
    setCategories(prev => prev.filter(cat => cat !== category));
    
    // Resetar para 'todas' se a categoria ativa foi excluída
    if (activeCategory === category) {
      setActiveCategory('todas');
    }
  };

  const value = {
    todos,
    filteredTodos,
    filter,
    sortBy,
    searchQuery,
    categories,
    activeCategory,
    setFilter,
    setSortBy,
    setSearchQuery,
    setActiveCategory,
    addTodo: handleAddTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    toggleTodoCompletion: handleToggleTodoCompletion,
    addCategory: handleAddCategory,
    deleteCategory: handleDeleteCategory,
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