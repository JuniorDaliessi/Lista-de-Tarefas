import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as projectController from '../controllers/projectController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas de projetos
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Rotas de quadro kanban
router.get('/:id/board', projectController.getKanbanBoard);
router.get('/:id/metrics', projectController.getProjectMetrics);

// Rotas de colunas
router.get('/:id/columns', projectController.getProjectColumns);
router.post('/:id/columns', projectController.addColumn);
router.put('/:projectId/columns/:columnId', projectController.updateColumn);
router.delete('/:projectId/columns/:columnId', projectController.deleteColumn);

export default router; 