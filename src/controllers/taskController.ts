import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import taskService from '../services/taskService';
import { asyncHandler, sendSuccess, sendError } from '../utils/apiHandlers';

// Obter todas as tarefas
export const getAllTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const tasks = await taskService.getAllTasks(userId);
  
  return sendSuccess(res, { tasks });
});

// Obter tarefas pendentes
export const getPendingTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const tasks = await taskService.getPendingTasks(userId);
  
  return sendSuccess(res, { tasks });
});

// Obter tarefas completadas
export const getCompletedTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const tasks = await taskService.getCompletedTasks(userId);
  
  return sendSuccess(res, { tasks });
});

// Obter tarefa por ID
export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id;
  
  const task = await taskService.getTaskById(taskId, userId);
  
  return sendSuccess(res, { task });
});

// Criar tarefa
export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { title, description, due_date, priority, category_id, project_id, column_id } = req.body;
  
  if (!title) {
    return sendError(res, 'O título da tarefa é obrigatório', 400);
  }
  
  const task = await taskService.createTask(userId, {
    title,
    description,
    due_date,
    priority,
    category_id,
    project_id,
    column_id
  });
  
  return sendSuccess(res, { task }, 201);
});

// Atualizar tarefa
export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id;
  const { 
    title, 
    description, 
    due_date, 
    priority, 
    completed, 
    category_id,
    project_id,
    column_id
  } = req.body;
  
  const task = await taskService.updateTask(taskId, userId, {
    title,
    description,
    due_date,
    priority,
    completed,
    category_id,
    project_id,
    column_id
  });
  
  return sendSuccess(res, { task });
});

// Alternar status de conclusão
export const toggleTaskCompletion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id;
  
  const task = await taskService.toggleTaskCompletion(taskId, userId);
  
  return sendSuccess(res, { task });
});

// Excluir tarefa
export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id;
  
  await taskService.deleteTask(taskId, userId);
  
  return sendSuccess(res, { message: 'Tarefa excluída com sucesso' });
});

// Mover tarefa para outra coluna
export const moveTaskToColumn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id;
  const { project_id, column_id, position } = req.body;
  
  if (!project_id || !column_id || position === undefined) {
    return sendError(res, 'Informações de destino incompletas', 400);
  }
  
  const task = await taskService.moveTaskToColumn(
    taskId, 
    userId, 
    project_id, 
    column_id, 
    position
  );
  
  return sendSuccess(res, { task });
});

// Obter tarefas por projeto
export const getTasksByProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.projectId;
  
  const tasks = await taskService.getTasksByProject(projectId, userId);
  
  return sendSuccess(res, { tasks });
});

// Obter tarefas por categoria
export const getTasksByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const categoryId = req.params.categoryId;
  
  const tasks = await taskService.getTasksByCategory(categoryId, userId);
  
  return sendSuccess(res, { tasks });
});

// Obter tarefas com vencimento próximo
export const getUpcomingTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const days = parseInt(req.query.days as string) || 7;
  
  const tasks = await taskService.getUpcomingTasks(userId, days);
  
  return sendSuccess(res, { tasks });
});

// Obter tarefas atrasadas
export const getOverdueTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const tasks = await taskService.getOverdueTasks(userId);
  
  return sendSuccess(res, { tasks });
});

// Obter tarefas por prioridade
export const getTasksByPriority = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const priority = req.params.priority as 'baixa' | 'média' | 'alta';
  
  if (!['baixa', 'média', 'alta'].includes(priority)) {
    return sendError(res, 'Prioridade inválida. Use: baixa, média ou alta', 400);
  }
  
  const tasks = await taskService.getTasksByPriority(userId, priority);
  
  return sendSuccess(res, { tasks });
});

// Obter estatísticas de tarefas
export const getTaskStatistics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  const statistics = await taskService.getTaskStatistics(userId);
  
  return sendSuccess(res, { statistics });
}); 