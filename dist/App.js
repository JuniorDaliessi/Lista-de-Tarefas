"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Importar rotas
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const subtaskRoutes_1 = __importDefault(require("./routes/subtaskRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
// Importar middleware de erro
const apiHandlers_1 = require("./utils/apiHandlers");
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Criar aplicação Express
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Definir rotas
app.use('/api/auth', authRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/tasks/:taskId/subtasks', subtaskRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
// Rota de teste
app.get('/api/healthcheck', (req, res) => {
    res.json({
        status: 'success',
        message: 'API funcionando corretamente',
        timestamp: new Date()
    });
});
// Handler para erros globais
app.use(apiHandlers_1.errorHandler);
// Handler para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint não encontrado'
    });
});
exports.default = app;
