import { Todo } from '../types/Todo';

const STORAGE_KEY = 'todos';

/**
 * Obtém todas as tarefas armazenadas no localStorage
 * @returns Lista de tarefas
 */
export const getTodos = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (!storedTodos) {
      return [];
    }
    
    const parsedTodos = JSON.parse(storedTodos);
    
    // Validar se o resultado é um array
    if (!Array.isArray(parsedTodos)) {
      console.error("Dados armazenados inválidos:", parsedTodos);
      return [];
    }
    
    // Garantir que todas as tarefas tenham a propriedade subtasks
    return parsedTodos.map(todo => ({
      ...todo,
      subtasks: todo.subtasks || []
    }));
  } catch (error) {
    console.error('Erro ao carregar tarefas do localStorage:', error);
    // Em caso de erro, limpar localStorage para evitar problemas futuros
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

/**
 * Salva a lista de tarefas no localStorage
 * @param todos Lista de tarefas a ser salva
 */
export const saveTodos = (todos: Todo[]): void => {
  try {
    // Garantir que estamos salvando um array válido
    if (!Array.isArray(todos)) {
      console.error("Tentativa de salvar dados não-array:", todos);
      return;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Erro ao salvar tarefas no localStorage:', error);
  }
};

/**
 * Adiciona uma nova tarefa ao localStorage
 * @param todo Tarefa a ser adicionada
 * @returns Lista atualizada de tarefas
 */
export const addTodo = (todo: Todo): Todo[] => {
  const todos = getTodos();
  const updatedTodos = [...todos, todo];
  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * Atualiza uma tarefa existente no localStorage
 * @param updatedTodo Tarefa atualizada
 * @returns Lista atualizada de tarefas
 */
export const updateTodo = (updatedTodo: Todo): Todo[] => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => 
    todo.id === updatedTodo.id ? updatedTodo : todo
  );
  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * Remove uma tarefa do localStorage
 * @param id ID da tarefa a ser removida
 * @returns Lista atualizada de tarefas
 */
export const deleteTodo = (id: string): Todo[] => {
  const todos = getTodos();
  const updatedTodos = todos.filter(todo => todo.id !== id);
  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * Alterna o status de conclusão de uma tarefa
 * @param id ID da tarefa a ser alternada
 * @returns Lista atualizada de tarefas
 */
export const toggleTodoCompletion = (id: string): Todo[] => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(updatedTodos);
  return updatedTodos;
};

/**
 * Obtém um item genérico do localStorage
 * @param key Chave do item
 * @returns Item parseado ou null se não existir
 */
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error);
    return null;
  }
};

/**
 * Salva um item genérico no localStorage
 * @param key Chave do item
 * @param value Valor a ser salvo
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
  }
}; 