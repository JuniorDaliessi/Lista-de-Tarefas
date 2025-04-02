"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setItem = exports.getItem = exports.toggleTodoCompletion = exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.saveTodos = exports.getTodos = exports.isLocalStorageAvailable = void 0;
const STORAGE_KEY = 'todos';
/**
 * Verifica se o localStorage está disponível
 * @returns true se o localStorage estiver disponível, false caso contrário
 */
const isLocalStorageAvailable = () => {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        const result = localStorage.getItem(testKey) === testKey;
        localStorage.removeItem(testKey);
        return result;
    }
    catch (e) {
        return false;
    }
};
exports.isLocalStorageAvailable = isLocalStorageAvailable;
/**
 * Obtém todas as tarefas armazenadas no localStorage
 * @returns Lista de tarefas
 */
const getTodos = () => {
    if (!(0, exports.isLocalStorageAvailable)()) {
        console.warn('LocalStorage não está disponível. Os dados não serão persistidos.');
        return [];
    }
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
        return parsedTodos.map(todo => (Object.assign(Object.assign({}, todo), { subtasks: todo.subtasks || [] })));
    }
    catch (error) {
        console.error('Erro ao carregar tarefas do localStorage:', error);
        // Em caso de erro, limpar localStorage para evitar problemas futuros
        try {
            localStorage.removeItem(STORAGE_KEY);
        }
        catch (e) {
            // Ignorar erros ao tentar remover
        }
        return [];
    }
};
exports.getTodos = getTodos;
/**
 * Salva a lista de tarefas no localStorage
 * @param todos Lista de tarefas a ser salva
 */
const saveTodos = (todos) => {
    if (!(0, exports.isLocalStorageAvailable)()) {
        console.warn('LocalStorage não está disponível. Os dados não serão persistidos.');
        return;
    }
    try {
        // Garantir que estamos salvando um array válido
        if (!Array.isArray(todos)) {
            console.error("Tentativa de salvar dados não-array:", todos);
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
    catch (error) {
        console.error('Erro ao salvar tarefas no localStorage:', error);
    }
};
exports.saveTodos = saveTodos;
/**
 * Adiciona uma nova tarefa ao localStorage
 * @param todo Tarefa a ser adicionada
 * @returns Lista atualizada de tarefas
 */
const addTodo = (todo) => {
    const todos = (0, exports.getTodos)();
    const updatedTodos = [...todos, todo];
    (0, exports.saveTodos)(updatedTodos);
    return updatedTodos;
};
exports.addTodo = addTodo;
/**
 * Atualiza uma tarefa existente no localStorage
 * @param updatedTodo Tarefa atualizada
 * @returns Lista atualizada de tarefas
 */
const updateTodo = (updatedTodo) => {
    const todos = (0, exports.getTodos)();
    const updatedTodos = todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
    (0, exports.saveTodos)(updatedTodos);
    return updatedTodos;
};
exports.updateTodo = updateTodo;
/**
 * Remove uma tarefa do localStorage
 * @param id ID da tarefa a ser removida
 * @returns Lista atualizada de tarefas
 */
const deleteTodo = (id) => {
    const todos = (0, exports.getTodos)();
    const updatedTodos = todos.filter(todo => todo.id !== id);
    (0, exports.saveTodos)(updatedTodos);
    return updatedTodos;
};
exports.deleteTodo = deleteTodo;
/**
 * Alterna o status de conclusão de uma tarefa
 * @param id ID da tarefa a ser alternada
 * @returns Lista atualizada de tarefas
 */
const toggleTodoCompletion = (id) => {
    const todos = (0, exports.getTodos)();
    const updatedTodos = todos.map(todo => todo.id === id ? Object.assign(Object.assign({}, todo), { completed: !todo.completed }) : todo);
    (0, exports.saveTodos)(updatedTodos);
    return updatedTodos;
};
exports.toggleTodoCompletion = toggleTodoCompletion;
/**
 * Obtém um item genérico do localStorage
 * @param key Chave do item
 * @returns Item parseado ou null se não existir
 */
const getItem = (key) => {
    if (!(0, exports.isLocalStorageAvailable)()) {
        console.warn('LocalStorage não está disponível. Os dados não serão persistidos.');
        return null;
    }
    try {
        const item = localStorage.getItem(key);
        if (!item) {
            return null;
        }
        return JSON.parse(item);
    }
    catch (error) {
        console.error(`Erro ao carregar ${key} do localStorage:`, error);
        return null;
    }
};
exports.getItem = getItem;
/**
 * Salva um item genérico no localStorage
 * @param key Chave do item
 * @param value Valor a ser salvo
 */
const setItem = (key, value) => {
    if (!(0, exports.isLocalStorageAvailable)()) {
        console.warn('LocalStorage não está disponível. Os dados não serão persistidos.');
        return;
    }
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
};
exports.setItem = setItem;
