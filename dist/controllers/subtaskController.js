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
exports.deleteSubtask = exports.updateSubtask = exports.createSubtask = exports.getSubtaskById = exports.getAllSubtasks = void 0;
const subtaskService_1 = __importDefault(require("../services/subtaskService"));
const apiHandlers_1 = require("../utils/apiHandlers");
// Obter todas as subtarefas de uma tarefa
exports.getAllSubtasks = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const subtasks = yield subtaskService_1.default.getAllSubtasks(taskId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, subtasks);
}));
// Obter uma subtarefa pelo ID
exports.getSubtaskById = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subtaskId = req.params.subtaskId;
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const subtask = yield subtaskService_1.default.getSubtaskById(subtaskId, taskId, userId);
    if (!subtask) {
        return (0, apiHandlers_1.sendError)(res, 'Subtarefa não encontrada', 404);
    }
    return (0, apiHandlers_1.sendSuccess)(res, subtask);
}));
// Criar uma nova subtarefa
exports.createSubtask = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const { title, description } = req.body;
    if (!title) {
        return (0, apiHandlers_1.sendError)(res, 'O título da subtarefa é obrigatório', 400);
    }
    const subtaskData = { title, description };
    const subtask = yield subtaskService_1.default.createSubtask(taskId, userId, subtaskData);
    return (0, apiHandlers_1.sendSuccess)(res, subtask, 201);
}));
// Atualizar uma subtarefa
exports.updateSubtask = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subtaskId = req.params.subtaskId;
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const { title, completed, description } = req.body;
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (completed !== undefined)
        updateData.completed = completed;
    if (description !== undefined)
        updateData.description = description;
    const subtask = yield subtaskService_1.default.updateSubtask(subtaskId, taskId, userId, updateData);
    if (!subtask) {
        return (0, apiHandlers_1.sendError)(res, 'Subtarefa não encontrada', 404);
    }
    return (0, apiHandlers_1.sendSuccess)(res, subtask);
}));
// Excluir uma subtarefa
exports.deleteSubtask = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subtaskId = req.params.subtaskId;
    const taskId = req.params.taskId;
    const userId = req.user.id;
    const result = yield subtaskService_1.default.deleteSubtask(subtaskId, taskId, userId);
    if (!result) {
        return (0, apiHandlers_1.sendError)(res, 'Subtarefa não encontrada', 404);
    }
    return (0, apiHandlers_1.sendSuccess)(res, { message: 'Subtarefa excluída com sucesso' });
}));
