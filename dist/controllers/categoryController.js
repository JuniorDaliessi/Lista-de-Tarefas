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
exports.getCategoryStats = exports.getTasksByCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const categoryService_1 = __importDefault(require("../services/categoryService"));
const apiHandlers_1 = require("../utils/apiHandlers");
// Obter todas as categorias
exports.getAllCategories = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const categories = yield categoryService_1.default.getAllCategories(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { categories });
}));
// Obter categoria por ID
exports.getCategoryById = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const category = yield categoryService_1.default.getCategoryById(categoryId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { category });
}));
// Criar categoria
exports.createCategory = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { name, color } = req.body;
    if (!name) {
        return (0, apiHandlers_1.sendError)(res, 'O nome da categoria é obrigatório', 400);
    }
    const category = yield categoryService_1.default.createCategory(userId, {
        name,
        color
    });
    return (0, apiHandlers_1.sendSuccess)(res, { category }, 201);
}));
// Atualizar categoria
exports.updateCategory = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const { name, color } = req.body;
    if (!name && color === undefined) {
        return (0, apiHandlers_1.sendError)(res, 'Pelo menos um campo para atualização deve ser fornecido', 400);
    }
    const category = yield categoryService_1.default.updateCategory(categoryId, userId, {
        name,
        color
    });
    return (0, apiHandlers_1.sendSuccess)(res, { category });
}));
// Excluir categoria
exports.deleteCategory = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const categoryId = req.params.id;
    yield categoryService_1.default.deleteCategory(categoryId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { message: 'Categoria excluída com sucesso' });
}));
// Obter tarefas por categoria
exports.getTasksByCategory = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const tasks = yield categoryService_1.default.getTasksByCategory(categoryId, userId);
    return (0, apiHandlers_1.sendSuccess)(res, { tasks });
}));
// Obter estatísticas de categorias
exports.getCategoryStats = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const stats = yield categoryService_1.default.getCategoryStats(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { stats });
}));
