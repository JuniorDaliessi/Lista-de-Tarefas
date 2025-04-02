import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rotas
import taskRoutes from './routes/taskRoutes';
import categoryRoutes from './routes/categoryRoutes';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';
import subtaskRoutes from './routes/subtaskRoutes';
import statsRoutes from './routes/statsRoutes';

// Importar middleware de erro
import { errorHandler } from './utils/apiHandlers';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Definir rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/:taskId/subtasks', subtaskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);

// Rota de teste
app.get('/api/healthcheck', (req, res) => {
  res.json({
    status: 'success',
    message: 'API funcionando corretamente',
    timestamp: new Date()
  });
});

// Handler para erros globais
app.use(errorHandler);

// Handler para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint não encontrado'
  });
});

export default app; 