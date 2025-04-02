import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import statsService from '../services/statsService';
import { asyncHandler, sendSuccess } from '../utils/apiHandlers';

// Obter estatísticas gerais do usuário
export const getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const stats = await statsService.getUserStats(userId);
  
  return sendSuccess(res, { stats });
});

// Obter dados para o dashboard
export const getDashboardData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const dashboard = await statsService.getDashboardData(userId);
  
  return sendSuccess(res, { dashboard });
});

// Obter progresso diário
export const getDailyProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const days = parseInt(req.query.days as string) || 30;
  
  const progress = await statsService.getDailyProgress(userId, days);
  
  return sendSuccess(res, { progress });
});

// Obter distribuição de categorias
export const getCategoryDistribution = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const distribution = await statsService.getCategoryDistribution(userId);
  
  return sendSuccess(res, { distribution });
});

// Obter métricas kanban
export const getKanbanMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const metrics = await statsService.getKanbanMetrics(userId);
  
  return sendSuccess(res, { metrics });
});

// Obter distribuição de prioridades
export const getPriorityDistribution = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const distribution = await statsService.getPriorityDistribution(userId);
  
  return sendSuccess(res, { distribution });
});

// Obter tempo médio de conclusão por categoria
export const getCategoryCompletionTime = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const completionTime = await statsService.getCategoryCompletionTime(userId);
  
  return sendSuccess(res, { completionTime });
}); 