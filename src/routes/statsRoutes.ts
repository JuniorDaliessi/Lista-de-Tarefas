import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as statsController from '../controllers/statsController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas de estatísticas
router.get('/', statsController.getUserStats);
router.get('/dashboard', statsController.getDashboardData);
router.get('/daily-progress', statsController.getDailyProgress);
router.get('/category-distribution', statsController.getCategoryDistribution);
router.get('/kanban-metrics', statsController.getKanbanMetrics);
router.get('/priority-distribution', statsController.getPriorityDistribution);
router.get('/category-completion-time', statsController.getCategoryCompletionTime);

export default router; 