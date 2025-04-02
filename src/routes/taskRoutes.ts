import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as taskController from '../controllers/taskController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas principais de tarefas
router.get('/', taskController.getAllTasks);
router.get('/pending', taskController.getPendingTasks);
router.get('/completed', taskController.getCompletedTasks);
router.get('/upcoming', taskController.getUpcomingTasks);
router.get('/overdue', taskController.getOverdueTasks);
router.get('/statistics', taskController.getTaskStatistics);

// Rotas com parâmetros
router.get('/priority/:priority', taskController.getTasksByPriority);
router.get('/project/:projectId', taskController.getTasksByProject);
router.get('/category/:categoryId', taskController.getTasksByCategory);
router.get('/:id', taskController.getTaskById);

// Rotas de manipulação
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/toggle', taskController.toggleTaskCompletion);
router.patch('/:id/move', taskController.moveTaskToColumn);
router.delete('/:id', taskController.deleteTask);

export default router; 