import { Todo } from '../types/Todo';

const STORAGE_KEY = 'todos';

/**
 * Obtém todas as tarefas armazenadas no localStorage
 * @returns Lista de tarefas
 */
export const getTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem(STORAGE_KEY);
  if (!storedTodos) {
    return [];
  }
  
  try {
    return JSON.parse(storedTodos);
  } catch (error) {
    console.error('Erro ao carregar tarefas do localStorage:', error);
    return [];
  }
};

/**
 * Salva a lista de tarefas no localStorage
 * @param todos Lista de tarefas a ser salva
 */
export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
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