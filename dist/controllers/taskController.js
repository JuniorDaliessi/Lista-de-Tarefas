"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStatistics = exports.getTasksByPriority = exports.getOverdueTasks = exports.getUpcomingTasks = exports.getTasksByCategory = exports.getTasksByProject = exports.moveTaskToColumn = exports.deleteTask = exports.toggleTaskCompletion = exports.updateTask = exports.createTask = exports.getTaskById = exports.getCompletedTasks = exports.getPendingTasks = exports.getAllTasks = void 0;
const taskService_1 = __importDefault(require("../services/taskService"));
const apiHandlers_1 = require("../utils/apiHandlers");
// Obter todas as tarefas
exports.getAllTasks = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const tasks = yield taskService_1.default.getAllTasks(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter tarefas pendentes
exports.getPendingTasks = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const tasks = yield taskService_1.default.getPendingTasks(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter tarefas completadas
exports.getCompletedTasks = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const tasks = yield taskService_1.default.getCompletedTasks(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter tarefa por ID
exports.getTaskById = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = yield taskService_1.default.getTaskById(taskId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { task });
}));
// Criar tarefa
exports.createTask = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { title, description, due_date, priority, category_id, project_id, column_id } = req.body;
    if (!title) {
        return (0, apiHandlers_1.sendError)(res, 'O título da tarefa é obrigatório', 400);
    }
    const task = yield taskService_1.default.createTask(userId, {
        title,
        description,
        due_date,
        priority,
        category_id,
        project_id,
        column_id
    });
    return (0, apiHandlers_1.sendSuccess)(res, { task }, 201);
}));
// Atualizar tarefa
exports.updateTask = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, due_date, priority, completed, category_id, project_id, column_id } = req.body;
    const task = yield taskService_1.default.updateTask(taskId, userId, {
        title,
        description,
        due_date,
        priority,
        completed,
        category_id,
        project_id,
        column_id
    });
    return (0, apiHandlers_1.sendSuccess)(res, { task });
}));
// Alternar status de conclusão
exports.toggleTaskCompletion = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const taskId = req.params.id;
    const task = yield taskService_1.default.toggleTaskCompletion(taskId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { task });
}));
// Excluir tarefa
exports.deleteTask = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const taskId = req.params.id;
    yield taskService_1.default.deleteTask(taskId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { message: 'Tarefa excluída com sucesso' });
}));
// Mover tarefa para outra coluna
exports.moveTaskToColumn = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { project_id, column_id, position } = req.body;
    if (!project_id || !column_id || position === undefined) {
        return (0, apiHandlers_1.sendError)(res, 'Informações de destino incompletas', 400);
    }
    const task = yield taskService_1.default.moveTaskToColumn(taskId, userId, project_id, column_id, position);
    return (0, apiHandlers_1.sendSuccess)(res, { task });
}));
// Obter tarefas por projeto
exports.getTasksByProject = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const tasks = yield taskService_1.default.getTasksByProject(projectId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter tarefas por categoria
exports.getTasksByCategory = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const categoryId = req.params.categoryId;
    const tasks = yield taskService_1.default.getTasksByCategory(categoryId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter tarefas com vencimento próximo
exports.getUpcomingTasks = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 7;
    const tasks = yield taskService_1.default.getUpcomingTasks(userId, days);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter tarefas atrasadas
exports.getOverdueTasks = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const tasks = yield taskService_1.default.getOverdueTasks(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter tarefas por prioridade
exports.getTasksByPriority = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const priority = req.params.priority;
    if (!['baixa', 'média', 'alta'].includes(priority)) {
        return (0, apiHandlers_1.sendError)(res, 'Prioridade inválida. Use: baixa, média ou alta', 400);
    }
    const tasks = yield taskService_1.default.getTasksByPriority(userId, priority);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter estatísticas de tarefas
exports.getTaskStatistics = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const statistics = yield taskService_1.default.getTaskStatistics(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { statistics });
}));
