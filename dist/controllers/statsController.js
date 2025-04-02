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
exports.getCategoryCompletionTime = exports.getPriorityDistribution = exports.getKanbanMetrics = exports.getCategoryDistribution = exports.getDailyProgress = exports.getDashboardData = exports.getUserStats = void 0;
const statsService_1 = __importDefault(require("../services/statsService"));
const apiHandlers_1 = require("../utils/apiHandlers");
// Obter estatísticas gerais do usuário
exports.getUserStats = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const stats = yield statsService_1.default.getUserStats(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { stats });
}));
// Obter dados para o dashboard
exports.getDashboardData = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const dashboard = yield statsService_1.default.getDashboardData(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { dashboard });
}));
// Obter progresso diário
exports.getDailyProgress = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 30;
    const progress = yield statsService_1.default.getDailyProgress(userId, days);
    return (0, apiHandlers_1.sendSuccess)(res, { progress });
}));
// Obter distribuição de categorias
exports.getCategoryDistribution = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const distribution = yield statsService_1.default.getCategoryDistribution(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { distribution });
}));
// Obter métricas kanban
exports.getKanbanMetrics = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const metrics = yield statsService_1.default.getKanbanMetrics(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { metrics });
}));
// Obter distribuição de prioridades
exports.getPriorityDistribution = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const distribution = yield statsService_1.default.getPriorityDistribution(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { distribution });
}));
// Obter tempo médio de conclusão por categoria
exports.getCategoryCompletionTime = (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const completionTime = yield statsService_1.default.getCategoryCompletionTime(userId);
    return (0, apiHandlers_1.sendSuccess)(res, { completionTime });
}));
