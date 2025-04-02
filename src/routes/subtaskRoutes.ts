import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as subtaskController from '../controllers/subtaskController';

const router = Router({ mergeParams: true });

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas de subtarefas (todas as rotas incluem o taskId como parâmetro)
router.get('/', subtaskController.getAllSubtasks);
router.get('/:subtaskId', subtaskController.getSubtaskById);
router.post('/', subtaskController.createSubtask);
router.put('/:subtaskId', subtaskController.updateSubtask);
router.delete('/:subtaskId', subtaskController.deleteSubtask);

export default router; 