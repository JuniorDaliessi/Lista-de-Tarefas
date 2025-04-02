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
exports.useProject = exports.ProjectProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const uuid_1 = require("uuid");
const TodoContext_1 = require("./TodoContext");
const LocalStorageService = __importStar(require("../services/localStorage"));
// Default columns for new projects
const DEFAULT_COLUMNS = [
    { id: 'backlog', title: 'A Fazer', order: 0, wipLimit: undefined },
    { id: 'in-progress', title: 'Em Andamento', order: 1, wipLimit: 5 },
    { id: 'review', title: 'Em Revisão', order: 2, wipLimit: 3 },
    { id: 'done', title: 'Concluído', order: 3, wipLimit: undefined }
];
const ProjectContext = (0, react_1.createContext)(undefined);
const ProjectProvider = ({ children }) => {
    const { todos, updateTodo } = (0, TodoContext_1.useTodo)();
    const [projects, setProjects] = (0, react_1.useState)([]);
    const [activeProjectId, setActiveProjectId] = (0, react_1.useState)(null);
    const [taskMetrics, setTaskMetrics] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // Load projects from localStorage
    (0, react_1.useEffect)(() => {
        try {
            setIsLoading(true);
            // Load projects
            const storedProjects = LocalStorageService.getItem('projects') || [];
            setProjects(storedProjects);
            // Load task metrics
            const storedMetrics = LocalStorageService.getItem('taskMetrics') || [];
            setTaskMetrics(storedMetrics);
            // Load active project
            const storedActiveProjectId = LocalStorageService.getItem('activeProjectId');
            setActiveProjectId(storedActiveProjectId);
            setError(null);
        }
        catch (err) {
            console.error("Error loading project data:", err);
            setError("Failed to load project data");
            setProjects([]);
            setTaskMetrics([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Save projects to localStorage when they change
    (0, react_1.useEffect)(() => {
        if (!isLoading) {
            LocalStorageService.setItem('projects', projects);
        }
    }, [projects, isLoading]);
    // Save task metrics to localStorage when they change
    (0, react_1.useEffect)(() => {
        if (!isLoading) {
            LocalStorageService.setItem('taskMetrics', taskMetrics);
        }
    }, [taskMetrics, isLoading]);
    // Save active project to localStorage when it changes
    (0, react_1.useEffect)(() => {
        if (!isLoading) {
            LocalStorageService.setItem('activeProjectId', activeProjectId);
        }
    }, [activeProjectId, isLoading]);
    // Project CRUD operations
    const createProject = (0, react_1.useCallback)((name, description) => {
        const newProject = {
            id: (0, uuid_1.v4)(),
            name,
            description,
            columns: [...DEFAULT_COLUMNS], // Copy default columns
            todoIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setProjects(prev => [...prev, newProject]);
        return newProject;
    }, []);
    const updateProject = (0, react_1.useCallback)((updatedProject) => {
        setProjects(prev => prev.map(project => project.id === updatedProject.id
            ? Object.assign(Object.assign({}, updatedProject), { updatedAt: new Date().toISOString() }) : project));
    }, []);
    const deleteProject = (0, react_1.useCallback)((id) => {
        // First remove project assignment from all todos
        todos.forEach(todo => {
            if (todo.projectId === id) {
                updateTodo(Object.assign(Object.assign({}, todo), { projectId: undefined, columnId: undefined, order: undefined }));
            }
        });
        // Then remove the project
        setProjects(prev => prev.filter(project => project.id !== id));
        // If active project is deleted, set active to null
        if (activeProjectId === id) {
            setActiveProjectId(null);
        }
    }, [todos, updateTodo, activeProjectId]);
    // Column management
    const addColumn = (0, react_1.useCallback)((projectId, title, wipLimit) => {
        setProjects(prev => prev.map(project => {
            if (project.id !== projectId)
                return project;
            // Create new column with order at the end
            const newColumn = {
                id: (0, uuid_1.v4)(),
                title,
                wipLimit,
                order: project.columns.length
            };
            return Object.assign(Object.assign({}, project), { columns: [...project.columns, newColumn], updatedAt: new Date().toISOString() });
        }));
    }, []);
    const updateColumn = (0, react_1.useCallback)((projectId, updatedColumn) => {
        setProjects(prev => prev.map(project => {
            if (project.id !== projectId)
                return project;
            return Object.assign(Object.assign({}, project), { columns: project.columns.map(column => column.id === updatedColumn.id ? updatedColumn : column), updatedAt: new Date().toISOString() });
        }));
    }, []);
    const deleteColumn = (0, react_1.useCallback)((projectId, columnId) => {
        setProjects(prev => prev.map(project => {
            var _a;
            if (project.id !== projectId)
                return project;
            // Move all tasks from this column to the first column
            const firstColumnId = (_a = project.columns.sort((a, b) => a.order - b.order)[0]) === null || _a === void 0 ? void 0 : _a.id;
            if (firstColumnId && firstColumnId !== columnId) {
                // Update todos that were in this column
                todos.forEach(todo => {
                    if (todo.projectId === projectId && todo.columnId === columnId) {
                        updateTodo(Object.assign(Object.assign({}, todo), { columnId: firstColumnId }));
                        // Update metrics
                        updateTaskColumnMetrics(todo.id, firstColumnId);
                    }
                });
            }
            // Remove the column
            const filteredColumns = project.columns.filter(column => column.id !== columnId);
            // Reorder remaining columns
            const reorderedColumns = filteredColumns.map((column, index) => (Object.assign(Object.assign({}, column), { order: index })));
            return Object.assign(Object.assign({}, project), { columns: reorderedColumns, updatedAt: new Date().toISOString() });
        }));
    }, [todos, updateTodo]);
    // Task management in Kanban
    const addTodoToProject = (0, react_1.useCallback)((projectId, todoId, columnId) => {
        // Find max order in the target column for proper positioning
        const project = projects.find(p => p.id === projectId);
        if (!project)
            return;
        const columnTodos = todos.filter(t => t.projectId === projectId && t.columnId === columnId);
        const maxOrder = columnTodos.length > 0
            ? Math.max(...columnTodos.map(t => t.order || 0))
            : -1;
        // Update the todo
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
            updateTodo(Object.assign(Object.assign({}, todo), { projectId,
                columnId, order: maxOrder + 1 }));
            // Initialize or update metrics
            updateTaskColumnMetrics(todoId, columnId);
            // Add to project if not already there
            if (!project.todoIds.includes(todoId)) {
                setProjects(prev => prev.map(p => {
                    if (p.id !== projectId)
                        return p;
                    return Object.assign(Object.assign({}, p), { todoIds: [...p.todoIds, todoId], updatedAt: new Date().toISOString() });
                }));
            }
        }
    }, [projects, todos, updateTodo]);
    const removeTodoFromProject = (0, react_1.useCallback)((projectId, todoId) => {
        // Update the todo
        const todo = todos.find(t => t.id === todoId);
        if (todo) {
            updateTodo(Object.assign(Object.assign({}, todo), { projectId: undefined, columnId: undefined, order: undefined }));
        }
        // Remove from project
        setProjects(prev => prev.map(project => {
            if (project.id !== projectId)
                return project;
            return Object.assign(Object.assign({}, project), { todoIds: project.todoIds.filter(id => id !== todoId), updatedAt: new Date().toISOString() });
        }));
    }, [todos, updateTodo]);
    const moveTodoToColumn = (0, react_1.useCallback)((todoId, targetColumnId, newOrder) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo || !todo.projectId)
            return;
        const sourceColumnId = todo.columnId;
        // Find max order in the target column if newOrder not provided
        if (newOrder === undefined) {
            const columnTodos = todos.filter(t => t.projectId === todo.projectId && t.columnId === targetColumnId);
            const maxOrder = columnTodos.length > 0
                ? Math.max(...columnTodos.map(t => t.order || 0))
                : -1;
            newOrder = maxOrder + 1;
        }
        // Special handling for when a task enters the "in-progress" or "done" columns
        const now = new Date().toISOString();
        let additionalUpdates = {};
        if (targetColumnId === 'in-progress' && !todo.startedAt) {
            additionalUpdates = { startedAt: now };
        }
        else if (targetColumnId === 'done' && !todo.completedAt) {
            additionalUpdates = { completedAt: now, completed: true };
        }
        // Update the todo
        updateTodo(Object.assign(Object.assign(Object.assign({}, todo), { columnId: targetColumnId, order: newOrder }), additionalUpdates));
        // Reorganize tasks in the source column
        if (sourceColumnId) {
            const sourceTodos = todos.filter(t => t.id !== todoId && t.projectId === todo.projectId && t.columnId === sourceColumnId);
            // Reorder todos in the source column to fill the gap
            const sourceTodosToUpdate = [];
            sourceTodos.forEach(t => {
                const currentOrder = t.order || 0;
                if (currentOrder > (todo.order || 0)) {
                    sourceTodosToUpdate.push(Object.assign(Object.assign({}, t), { order: currentOrder - 1 }));
                }
            });
            // Update source column todos
            sourceTodosToUpdate.forEach(t => updateTodo(t));
        }
        // Reorganize tasks in the target column
        const targetTodos = todos.filter(t => t.id !== todoId && t.projectId === todo.projectId && t.columnId === targetColumnId);
        // Shift todos in the target column to make space
        const targetTodosToUpdate = [];
        targetTodos.forEach(t => {
            const currentOrder = t.order || 0;
            if (newOrder !== undefined && currentOrder >= newOrder) {
                targetTodosToUpdate.push(Object.assign(Object.assign({}, t), { order: currentOrder + 1 }));
            }
        });
        // Update target column todos
        targetTodosToUpdate.forEach(t => updateTodo(t));
        // Update metrics
        updateTaskColumnMetrics(todoId, targetColumnId);
    }, [todos, updateTodo]);
    const reorderTodoInColumn = (0, react_1.useCallback)((todoId, newOrder) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo || !todo.projectId || !todo.columnId)
            return;
        // Get all todos in the same column
        const columnTodos = todos.filter(t => t.projectId === todo.projectId && t.columnId === todo.columnId);
        // Remove the current todo from the array for reordering
        const otherTodos = columnTodos.filter(t => t.id !== todoId);
        // Set the new order for the current todo
        updateTodo(Object.assign(Object.assign({}, todo), { order: newOrder }));
        // Reorder other todos to maintain consistent ordering
        const todosToUpdate = [];
        otherTodos.forEach(t => {
            let newPosition = t.order || 0;
            if (todo.order !== undefined && newOrder > todo.order) {
                // Moving down - shift todos between old and new position up by 1
                if (newPosition > todo.order && newPosition <= newOrder) {
                    newPosition--;
                }
            }
            else if (todo.order !== undefined && newOrder < todo.order) {
                // Moving up - shift todos between new and old position down by 1
                if (newPosition >= newOrder && newPosition < todo.order) {
                    newPosition++;
                }
            }
            // Only update if the order changed
            if (newPosition !== t.order) {
                todosToUpdate.push(Object.assign(Object.assign({}, t), { order: newPosition }));
            }
        });
        // Update all modified todos
        todosToUpdate.forEach(updatedTodo => {
            updateTodo(updatedTodo);
        });
    }, [todos, updateTodo]);
    // Helper for tracking task metrics
    const updateTaskColumnMetrics = (0, react_1.useCallback)((todoId, columnId) => {
        const now = new Date().toISOString();
        setTaskMetrics(prev => {
            // Find existing metrics for this todo
            const existingMetricsIndex = prev.findIndex(m => m.todoId === todoId);
            if (existingMetricsIndex >= 0) {
                // Update existing metrics
                const metrics = Object.assign({}, prev[existingMetricsIndex]);
                // Find the last column change (that doesn't have a leftAt time)
                const lastChangeIndex = metrics.columnChanges.findIndex(change => !change.leftAt);
                if (lastChangeIndex >= 0) {
                    // If the column hasn't changed, do nothing
                    if (metrics.columnChanges[lastChangeIndex].columnId === columnId) {
                        return prev;
                    }
                    // Mark the previous column as left
                    metrics.columnChanges[lastChangeIndex].leftAt = now;
                }
                // Add new column entry
                metrics.columnChanges.push({
                    columnId,
                    enteredAt: now
                });
                const newMetrics = [...prev];
                newMetrics[existingMetricsIndex] = metrics;
                return newMetrics;
            }
            else {
                // Create new metrics
                return [...prev, {
                        todoId,
                        columnChanges: [{
                                columnId,
                                enteredAt: now
                            }]
                    }];
            }
        });
    }, []);
    // Calculate lead time (total time from first column entry to last column)
    const getLeadTime = (0, react_1.useCallback)((todoId) => {
        var _a;
        const metrics = taskMetrics.find(m => m.todoId === todoId);
        if (!metrics || metrics.columnChanges.length === 0)
            return null;
        const firstEntry = new Date(metrics.columnChanges[0].enteredAt).getTime();
        // If task is in the last column, use either the time it entered or current time
        const todo = todos.find(t => t.id === todoId);
        if (!todo)
            return null;
        const project = projects.find(p => p.id === todo.projectId);
        if (!project)
            return null;
        const isInLastColumn = todo.columnId === ((_a = project.columns
            .sort((a, b) => b.order - a.order)[0]) === null || _a === void 0 ? void 0 : _a.id);
        if (isInLastColumn) {
            if (todo.completedAt) {
                return new Date(todo.completedAt).getTime() - firstEntry;
            }
            else {
                return Date.now() - firstEntry;
            }
        }
        // For ongoing tasks, use current time
        return Date.now() - firstEntry;
    }, [taskMetrics, todos, projects]);
    // Calculate cycle time (time in active work - typically "in progress" column)
    const getCycleTime = (0, react_1.useCallback)((todoId) => {
        const metrics = taskMetrics.find(m => m.todoId === todoId);
        if (!metrics)
            return null;
        // Find time spent in "in-progress" column
        const inProgressChanges = metrics.columnChanges.filter(change => change.columnId === 'in-progress');
        if (inProgressChanges.length === 0)
            return 0; // Never in progress
        let totalTime = 0;
        for (const change of inProgressChanges) {
            const startTime = new Date(change.enteredAt).getTime();
            const endTime = change.leftAt
                ? new Date(change.leftAt).getTime()
                : Date.now(); // Still in progress
            totalTime += endTime - startTime;
        }
        return totalTime;
    }, [taskMetrics]);
    // Add the advanceTaskStatus function after the moveTodoToColumn function
    const advanceTaskStatus = (0, react_1.useCallback)((todoId) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo || !todo.projectId || !todo.columnId) {
            return { success: false, message: 'Tarefa não está associada a um projeto ou coluna' };
        }
        const project = projects.find(p => p.id === todo.projectId);
        if (!project) {
            return { success: false, message: 'Projeto não encontrado' };
        }
        // Ordenar colunas por ordem
        const orderedColumns = [...project.columns].sort((a, b) => a.order - b.order);
        // Encontrar a coluna atual
        const currentColumnIndex = orderedColumns.findIndex(col => col.id === todo.columnId);
        if (currentColumnIndex === -1) {
            return { success: false, message: 'Coluna atual não encontrada' };
        }
        // Verificar se é a última coluna
        if (currentColumnIndex === orderedColumns.length - 1) {
            return { success: false, message: 'Tarefa já está na última coluna' };
        }
        // Identificar a próxima coluna
        const nextColumn = orderedColumns[currentColumnIndex + 1];
        // Verificar WIP limit
        if (nextColumn.wipLimit !== undefined) {
            const tasksInNextColumn = todos.filter(t => t.projectId === todo.projectId && t.columnId === nextColumn.id).length;
            if (tasksInNextColumn >= nextColumn.wipLimit) {
                return {
                    success: false,
                    message: `Limite de tarefas (${nextColumn.wipLimit}) atingido na coluna "${nextColumn.title}"`
                };
            }
            // Verificar se está próximo do limite (80% ou mais)
            const limitPercentage = (tasksInNextColumn + 1) / nextColumn.wipLimit * 100;
            if (limitPercentage >= 80) {
                const message = tasksInNextColumn + 1 === nextColumn.wipLimit
                    ? `Atenção: Esta ação atingirá o limite de tarefas (${nextColumn.wipLimit}) na coluna "${nextColumn.title}"`
                    : `Atenção: Chegando ao limite de tarefas (${tasksInNextColumn + 1}/${nextColumn.wipLimit}) na coluna "${nextColumn.title}"`;
                // Mover a tarefa para a próxima coluna
                moveTodoToColumn(todoId, nextColumn.id);
                // Retornar sucesso, mas com uma mensagem de atenção
                return { success: true, message: message };
            }
        }
        // Mover a tarefa para a próxima coluna
        moveTodoToColumn(todoId, nextColumn.id);
        return { success: true };
    }, [todos, projects, moveTodoToColumn]);
    // Adicionar a função regressTaskStatus após advanceTaskStatus
    const regressTaskStatus = (0, react_1.useCallback)((todoId) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo || !todo.projectId || !todo.columnId) {
            return { success: false, message: 'Tarefa não está associada a um projeto ou coluna' };
        }
        const project = projects.find(p => p.id === todo.projectId);
        if (!project) {
            return { success: false, message: 'Projeto não encontrado' };
        }
        // Ordenar colunas por ordem
        const orderedColumns = [...project.columns].sort((a, b) => a.order - b.order);
        // Encontrar a coluna atual
        const currentColumnIndex = orderedColumns.findIndex(col => col.id === todo.columnId);
        if (currentColumnIndex === -1) {
            return { success: false, message: 'Coluna atual não encontrada' };
        }
        // Verificar se é a primeira coluna
        if (currentColumnIndex === 0) {
            return { success: false, message: 'Tarefa já está na primeira coluna' };
        }
        // Identificar a coluna anterior
        const previousColumn = orderedColumns[currentColumnIndex - 1];
        // Mover a tarefa para a coluna anterior
        moveTodoToColumn(todoId, previousColumn.id);
        // Se movendo de "done" para qualquer outra coluna, remover o status de concluído
        if (todo.columnId === 'done' && todo.completed) {
            updateTodo(Object.assign(Object.assign({}, todo), { columnId: previousColumn.id, completed: false, completedAt: undefined }));
        }
        return { success: true, message: `Tarefa movida para ${previousColumn.title}` };
    }, [todos, projects, moveTodoToColumn, updateTodo]);
    const value = (0, react_1.useMemo)(() => ({
        projects,
        activeProjectId,
        taskMetrics,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,
        addColumn,
        updateColumn,
        deleteColumn,
        addTodoToProject,
        removeTodoFromProject,
        moveTodoToColumn,
        reorderTodoInColumn,
        advanceTaskStatus,
        regressTaskStatus,
        getLeadTime,
        getCycleTime,
        isLoading,
        error
    }), [
        projects,
        activeProjectId,
        taskMetrics,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,
        addColumn,
        updateColumn,
        deleteColumn,
        addTodoToProject,
        removeTodoFromProject,
        moveTodoToColumn,
        reorderTodoInColumn,
        advanceTaskStatus,
        regressTaskStatus,
        getLeadTime,
        getCycleTime,
        isLoading,
        error
    ]);
    return ((0, jsx_runtime_1.jsx)(ProjectContext.Provider, { value: value, children: children }));
};
exports.ProjectProvider = ProjectProvider;
const useProject = () => {
    const context = (0, react_1.useContext)(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
exports.useProject = useProject;
