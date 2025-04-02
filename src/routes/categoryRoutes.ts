import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticate);

// Rotas de categorias
router.get('/', categoryController.getAllCategories);
router.get('/stats', categoryController.getCategoryStats);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/tasks', categoryController.getTasksByCategory);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router; 