import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo, SubTask } from '../types/Todo';
import * as LocalStorageService from '../services/localStorage';

interface TodoContextProps {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: string;
  sortBy: string;
  searchQuery: string;
  searchType: 'title' | 'description' | 'category' | 'all';
  categories: string[];
  activeCategory: string;
  setFilter: (filter: string) => void;
  setSortBy: (sortBy: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchType: (type: 'title' | 'description' | 'category' | 'all') => void;
  setActiveCategory: (category: string) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  addSubtask: (todoId: string, title: string) => void;
  updateSubtask: (todoId: string, subtask: SubTask) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  toggleSubtaskCompletion: (todoId: string, subtaskId: string) => void;
  getTodoStats: () => { total: number, completed: number, pending: number, byPriority: Record<string, number>, byCategory: Record<string, number> };
  isLoading: boolean;
  error: string | null;
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
  const [searchType, setSearchType] = useState<'title' | 'description' | 'category' | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState('todas');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar tarefas e categorias do localStorage na inicialização
  useEffect(() => {
    try {
      setIsLoading(true);
    const storedTodos = LocalStorageService.getTodos();
      
      // Garantir que todos os todos tenham a propriedade subtasks
      const updatedTodos = storedTodos.map(todo => ({
        ...todo,
        subtasks: Array.isArray(todo.subtasks) ? todo.subtasks : []
      }));
      
      setTodos(updatedTodos);
      
      // Extrair categorias únicas das tarefas
      const uniqueCategories = updatedTodos
        .map(todo => todo.category)
        .filter(Boolean)
        .reduce<string[]>((acc, category) => 
          acc.includes(category) ? acc : [...acc, category], 
        []);
      
      setCategories(uniqueCategories);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Ocorreu um erro ao carregar suas tarefas. Tente recarregar a página.");
      // Inicializar com valores vazios para evitar erros de renderização
      setTodos([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar tarefas no localStorage sempre que forem modificadas
  useEffect(() => {
    try {
      if (!isLoading) {
        LocalStorageService.saveTodos(todos);
      }
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
    }
  }, [todos, isLoading]);

  // Função auxiliar para ordenar tarefas
  const sortTodos = (todosToSort: Todo[], sortType: string): Todo[] => {
    const sorted = [...todosToSort];
    
    switch (sortType) {
      case 'data':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'prioridade':
        return sorted.sort((a, b) => {
          const priorityValues = { alta: 0, média: 1, baixa: 2 };
          return priorityValues[a.priority] - priorityValues[b.priority];
        });
      case 'alfabética':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'criação':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return sorted;
    }
  };

  // Filtrar tarefas com base no filtro, categoria ativa e termo de pesquisa
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];
    
    // Aplicar filtro por categoria
    if (activeCategory !== 'todas') {
      filtered = filtered.filter(todo => todo.category === activeCategory);
    }
    
    // Aplicar filtro por status
    if (filter === 'pendentes') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'concluídas') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    // Aplicar filtro por termo de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(todo => {
        if (searchType === 'title' || searchType === 'all') {
          if (todo.title.toLowerCase().includes(query)) return true;
        }
        
        if (searchType === 'description' || searchType === 'all') {
          if (todo.description.toLowerCase().includes(query)) return true;
        }
        
        if (searchType === 'category' || searchType === 'all') {
          if (todo.category.toLowerCase().includes(query)) return true;
        }
        
        return false;
      });
    }
    
    // Aplicar ordenação
    return sortTodos(filtered, sortBy);
  }, [todos, filter, sortBy, searchQuery, searchType, activeCategory]);

  // Função para adicionar uma nova tarefa
  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      subtasks: todo.subtasks || []
    };
    
    setTodos(prev => [...prev, newTodo]);
    
    // Adicionar categoria se for nova
    if (todo.category && !categories.includes(todo.category)) {
      setCategories(prev => [...prev, todo.category]);
    }
  }, [categories]);

  // Função para atualizar uma tarefa existente
  const updateTodo = useCallback((updatedTodo: Todo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
    
    // Adicionar categoria se for nova
    if (updatedTodo.category && !categories.includes(updatedTodo.category)) {
      setCategories(prev => [...prev, updatedTodo.category]);
    }
  }, [categories]);

  // Função para excluir uma tarefa
  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Função para alternar a conclusão de uma tarefa
  const toggleTodoCompletion = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  // Função para adicionar uma categoria
  const addCategory = useCallback((category: string) => {
    if (category && !categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  }, [categories]);

  // Função para excluir uma categoria
  const deleteCategory = useCallback((category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    
    // Atualizar tarefas que usavam esta categoria
    setTodos(prev => prev.map(todo => 
      todo.category === category ? { ...todo, category: '' } : todo
    ));
    
    // Resetar categoria ativa se for a excluída
    if (activeCategory === category) {
      setActiveCategory('todas');
    }
  }, [activeCategory]);

  // Novas funções para gerenciar subtarefas
  const addSubtask = useCallback((todoId: string, title: string) => {
    if (!title.trim()) return;
    
    const newSubtask: SubTask = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { ...todo, subtasks: [...todo.subtasks, newSubtask] } 
        : todo
    ));
  }, []);

  const updateSubtask = useCallback((todoId: string, updatedSubtask: SubTask) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { 
            ...todo, 
            subtasks: todo.subtasks.map(subtask => 
              subtask.id === updatedSubtask.id ? updatedSubtask : subtask
            ) 
          } 
        : todo
    ));
  }, []);

  const deleteSubtask = useCallback((todoId: string, subtaskId: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { 
            ...todo, 
            subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId) 
          } 
        : todo
    ));
  }, []);

  const toggleSubtaskCompletion = useCallback((todoId: string, subtaskId: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { 
            ...todo, 
            subtasks: todo.subtasks.map(subtask => 
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed } 
                : subtask
            ) 
          } 
        : todo
    ));
  }, []);

  // Função para obter estatísticas de tarefas
  const getTodoStats = useCallback(() => {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    const pending = total - completed;
    
    // Estatísticas por prioridade
    const byPriority = todos.reduce((acc, todo) => {
      const priority = todo.priority || 'não definida';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Estatísticas por categoria
    const byCategory = todos.reduce((acc, todo) => {
      const category = todo.category || 'sem categoria';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, completed, pending, byPriority, byCategory };
  }, [todos]);

  return (
    <TodoContext.Provider
      value={{
    todos,
    filteredTodos,
    filter,
    sortBy,
        searchQuery,
        searchType,
        categories,
        activeCategory,
    setFilter,
    setSortBy,
        setSearchQuery,
        setSearchType,
        setActiveCategory,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoCompletion,
        addCategory,
        deleteCategory,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        toggleSubtaskCompletion,
        getTodoStats,
        isLoading,
        error
      }}
    >
      {error ? (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          <h3>Erro ao carregar dados</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0275d8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        children
      )}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextProps => {
  const context = useContext(TodoContext);
  
  if (!context) {
    throw new Error('useTodo deve ser usado dentro de um TodoProvider');
  }
  
  return context;
}; 