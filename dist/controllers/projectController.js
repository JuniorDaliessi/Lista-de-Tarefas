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
exports.getProjectMetrics = exports.getKanbanBoard = exports.deleteColumn = exports.updateColumn = exports.addColumn = exports.getProjectColumns = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const projectService_1 = __importDefault(require("../services/projectService"));
const apiHandlers_1 = require("../utils/apiHandlers");
// Obter todos os projetos do usuário
exports.getAllProjects = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projects = yield projectService_1.default.getAllProjects(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { projects });
}));
// Obter um projeto específico
exports.getProjectById = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.id;
    const project = yield projectService_1.default.getProjectById(projectId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { project });
}));
// Criar um novo projeto
exports.createProject = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { name, description } = req.body;
    if (!name) {
        return (0, apiHandlers_1.sendError)(res, 'O nome do projeto é obrigatório', 400);
    }
    const project = yield projectService_1.default.createProject(userId, { name, description });
    return (0, apiHandlers_1.sendSuccess)(res, { project }, 201);
}));
// Atualizar um projeto
exports.updateProject = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { name, description } = req.body;
    if (!name && description === undefined) {
        return (0, apiHandlers_1.sendError)(res, 'Pelo menos um campo para atualização deve ser fornecido', 400);
    }
    const project = yield projectService_1.default.updateProject(projectId, userId, {
        name,
        description
    });
    return (0, apiHandlers_1.sendSuccess)(res, { project });
}));
// Excluir um projeto
exports.deleteProject = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.id;
    yield projectService_1.default.deleteProject(projectId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { message: 'Projeto excluído com sucesso' });
}));
// Obter colunas de um projeto
exports.getProjectColumns = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.id;
    const columns = yield projectService_1.default.getProjectColumns(projectId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { columns });
}));
// Adicionar coluna a um projeto
exports.addColumn = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { title, wip_limit } = req.body;
    if (!title) {
        return (0, apiHandlers_1.sendError)(res, 'O título da coluna é obrigatório', 400);
    }
    const column = yield projectService_1.default.addColumn(projectId, userId, {
        title,
        wip_limit
    });
    return (0, apiHandlers_1.sendSuccess)(res, { column }, 201);
}));
// Atualizar uma coluna
exports.updateColumn = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const columnId = req.params.columnId;
    const { title, order_position, wip_limit } = req.body;
    if (!title && order_position === undefined && wip_limit === undefined) {
        return (0, apiHandlers_1.sendError)(res, 'Pelo menos um campo para atualização deve ser fornecido', 400);
    }
    const column = yield projectService_1.default.updateColumn(columnId, projectId, userId, {
        title,
        order_position,
        wip_limit
    });
    return (0, apiHandlers_1.sendSuccess)(res, { column });
}));
// Excluir uma coluna
exports.deleteColumn = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const columnId = req.params.columnId;
    yield projectService_1.default.deleteColumn(columnId, projectId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { message: 'Coluna excluída com sucesso' });
}));
// Obter quadro kanban (projeto com colunas e tarefas)
exports.getKanbanBoard = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.id;
    const board = yield projectService_1.default.getKanbanBoard(projectId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { board });
}));
// Obter métricas de um projeto
exports.getProjectMetrics = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const projectId = req.params.id;
    const metrics = yield projectService_1.default.getProjectMetrics(projectId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { metrics });
}));
