"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTodo = exports.TodoProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const uuid_1 = require("uuid");
const LocalStorageService = __importStar(require("../services/localStorage"));
const TodoContext = (0, react_1.createContext)(undefined);
const TodoProvider = ({ children }) => {
    const [todos, setTodos] = (0, react_1.useState)([]);
    const [filter, setFilter] = (0, react_1.useState)('todas');
    const [sortBy, setSortBy] = (0, react_1.useState)('data');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [searchType, setSearchType] = (0, react_1.useState)('all');
    const [activeCategory, setActiveCategory] = (0, react_1.useState)('todas');
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // Carregar tarefas e categorias do localStorage na inicialização
    (0, react_1.useEffect)(() => {
        try {
            setIsLoading(true);
            const storedTodos = LocalStorageService.getTodos();
            // Garantir que todos os todos tenham a propriedade subtasks
            const updatedTodos = storedTodos.map(todo => (Object.assign(Object.assign({}, todo), { subtasks: Array.isArray(todo.subtasks) ? todo.subtasks : [] })));
            setTodos(updatedTodos);
            // Extrair categorias únicas das tarefas
            const uniqueCategories = updatedTodos
                .map(todo => todo.category)
                .filter(Boolean)
                .reduce((acc, category) => acc.includes(category) ? acc : [...acc, category], []);
            setCategories(uniqueCategories);
            setError(null);
        }
        catch (err) {
            console.error("Erro ao carregar dados:", err);
            setError("Ocorreu um erro ao carregar suas tarefas. Tente recarregar a página.");
            // Inicializar com valores vazios para evitar erros de renderização
            setTodos([]);
            setCategories([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Salvar tarefas no localStorage sempre que forem modificadas
    (0, react_1.useEffect)(() => {
        try {
            if (!isLoading) {
                LocalStorageService.saveTodos(todos);
            }
        }
        catch (err) {
            console.error("Erro ao salvar dados:", err);
        }
    }, [todos, isLoading]);
    // Função auxiliar para ordenar tarefas
    const sortTodos = (todosToSort, sortType) => {
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
    const filteredTodos = (0, react_1.useMemo)(() => {
        let filtered = [...todos];
        // Aplicar filtro por categoria
        if (activeCategory !== 'todas') {
            filtered = filtered.filter(todo => todo.category === activeCategory);
        }
        // Aplicar filtro por status
        if (filter === 'pendentes') {
            filtered = filtered.filter(todo => !todo.completed);
        }
        else if (filter === 'concluídas') {
            filtered = filtered.filter(todo => todo.completed);
        }
        // Aplicar filtro por termo de pesquisa
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(todo => {
                if (searchType === 'title' || searchType === 'all') {
                    if (todo.title.toLowerCase().includes(query))
                        return true;
                }
                if (searchType === 'description' || searchType === 'all') {
                    if (todo.description.toLowerCase().includes(query))
                        return true;
                }
                if (searchType === 'category' || searchType === 'all') {
                    if (todo.category.toLowerCase().includes(query))
                        return true;
                }
                return false;
            });
        }
        // Aplicar ordenação
        return sortTodos(filtered, sortBy);
    }, [todos, filter, sortBy, searchQuery, searchType, activeCategory]);
    // Função para adicionar uma nova tarefa
    const addTodo = (0, react_1.useCallback)((todo) => {
        const newTodo = Object.assign(Object.assign({}, todo), { id: (0, uuid_1.v4)(), createdAt: new Date().toISOString(), subtasks: todo.subtasks || [] });
        setTodos(prev => [...prev, newTodo]);
        // Adicionar categoria se for nova
        if (todo.category && !categories.includes(todo.category)) {
            setCategories(prev => [...prev, todo.category]);
        }
    }, [categories]);
    // Função para atualizar uma tarefa existente
    const updateTodo = (0, react_1.useCallback)((updatedTodo) => {
        setTodos(prev => prev.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
        // Adicionar categoria se for nova
        if (updatedTodo.category && !categories.includes(updatedTodo.category)) {
            setCategories(prev => [...prev, updatedTodo.category]);
        }
    }, [categories]);
    // Função para excluir uma tarefa
    const deleteTodo = (0, react_1.useCallback)((id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    }, []);
    // Função para alternar a conclusão de uma tarefa
    const toggleTodoCompletion = (0, react_1.useCallback)((id) => {
        setTodos(prev => prev.map(todo => todo.id === id ? Object.assign(Object.assign({}, todo), { completed: !todo.completed }) : todo));
    }, []);
    // Função para adicionar uma categoria
    const addCategory = (0, react_1.useCallback)((category) => {
        if (category && !categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    }, [categories]);
    // Função para excluir uma categoria
    const deleteCategory = (0, react_1.useCallback)((category) => {
        setCategories(prev => prev.filter(c => c !== category));
        // Atualizar tarefas que usavam esta categoria
        setTodos(prev => prev.map(todo => todo.category === category ? Object.assign(Object.assign({}, todo), { category: '' }) : todo));
        // Resetar categoria ativa se for a excluída
        if (activeCategory === category) {
            setActiveCategory('todas');
        }
    }, [activeCategory]);
    // Novas funções para gerenciar subtarefas
    const addSubtask = (0, react_1.useCallback)((todoId, title) => {
        if (!title.trim())
            return;
        const newSubtask = {
            id: (0, uuid_1.v4)(),
            title: title.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        setTodos(prev => prev.map(todo => todo.id === todoId
            ? Object.assign(Object.assign({}, todo), { subtasks: [...todo.subtasks, newSubtask] }) : todo));
    }, []);
    const updateSubtask = (0, react_1.useCallback)((todoId, updatedSubtask) => {
        setTodos(prev => prev.map(todo => todo.id === todoId
            ? Object.assign(Object.assign({}, todo), { subtasks: todo.subtasks.map(subtask => subtask.id === updatedSubtask.id ? updatedSubtask : subtask) }) : todo));
    }, []);
    const deleteSubtask = (0, react_1.useCallback)((todoId, subtaskId) => {
        setTodos(prev => prev.map(todo => todo.id === todoId
            ? Object.assign(Object.assign({}, todo), { subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId) }) : todo));
    }, []);
    const toggleSubtaskCompletion = (0, react_1.useCallback)((todoId, subtaskId) => {
        setTodos(prev => prev.map(todo => todo.id === todoId
            ? Object.assign(Object.assign({}, todo), { subtasks: todo.subtasks.map(subtask => subtask.id === subtaskId
                    ? Object.assign(Object.assign({}, subtask), { completed: !subtask.completed }) : subtask) }) : todo));
    }, []);
    // Função para obter estatísticas de tarefas
    const getTodoStats = (0, react_1.useCallback)(() => {
        const completed = todos.filter(todo => todo.completed).length;
        const total = todos.length;
        const pending = total - completed;
        // Estatísticas por prioridade
        const byPriority = todos.reduce((acc, todo) => {
            const priority = todo.priority || 'não definida';
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {});
        // Estatísticas por categoria
        const byCategory = todos.reduce((acc, todo) => {
            const category = todo.category || 'sem categoria';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
        return { total, completed, pending, byPriority, byCategory };
    }, [todos]);
    return ((0, jsx_runtime_1.jsx)(TodoContext.Provider, { value: {
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
        }, children: error ? ((0, jsx_runtime_1.jsxs)("div", { style: {
                padding: '20px',
                margin: '20px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '5px',
                textAlign: 'center'
            }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Erro ao carregar dados" }), (0, jsx_runtime_1.jsx)("p", { children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), style: {
                        padding: '8px 16px',
                        backgroundColor: '#0275d8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }, children: "Tentar novamente" })] })) : (children) }));
};
exports.TodoProvider = TodoProvider;
const useTodo = () => {
    const context = (0, react_1.useContext)(TodoContext);
    if (!context) {
        throw new Error('useTodo deve ser usado dentro de um TodoProvider');
    }
    return context;
};
exports.useTodo = useTodo;
