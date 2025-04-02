import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import categoryService from '../services/categoryService';
import { asyncHandler, sendSuccess, sendError } from '../utils/apiHandlers';

// Obter todas as categorias
export const getAllCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const categories = await categoryService.getAllCategories(userId);
  
  return sendSuccess(res, { categories });
});

// Obter categoria por ID
export const getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const categoryId = req.params.id;
  
  const category = await categoryService.getCategoryById(categoryId, userId);
  
  return sendSuccess(res, { category });
});

// Criar categoria
export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, color } = req.body;
  
  if (!name) {
    return sendError(res, 'O nome da categoria é obrigatório', 400);
  }
  
  const category = await categoryService.createCategory(userId, {
    name,
    color
  });
  
  return sendSuccess(res, { category }, 201);
});

// Atualizar categoria
export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const categoryId = req.params.id;
  const { name, color } = req.body;
  
  if (!name && color === undefined) {
    return sendError(res, 'Pelo menos um campo para atualização deve ser fornecido', 400);
  }
  
  const category = await categoryService.updateCategory(categoryId, userId, {
    name,
    color
  });
  
  return sendSuccess(res, { category });
});

// Excluir categoria
export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const categoryId = req.params.id;
  
  await categoryService.deleteCategory(categoryId, userId);
  
  return sendSuccess(res, { message: 'Categoria excluída com sucesso' });
});

// Obter tarefas por categoria
export const getTasksByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const categoryId = req.params.id;
  
  const tasks = await categoryService.getTasksByCategory(categoryId, userId);
  
  return sendSuccess(res, { tasks });
});

// Obter estatísticas de categorias
export const getCategoryStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const stats = await categoryService.getCategoryStats(userId);
  
  return sendSuccess(res, { stats });
}); 