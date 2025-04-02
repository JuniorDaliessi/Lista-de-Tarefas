import { Request, Response } from 'express';
import subtaskService from '../services/subtaskService';
import { asyncHandler, sendSuccess, sendError } from '../utils/apiHandlers';

// Interface estendida para incluir user
interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

// Obter todas as subtarefas de uma tarefa
export const getAllSubtasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.taskId;
  const userId = req.user.id;

  const subtasks = await subtaskService.getAllSubtasks(taskId, userId);
  return sendSuccess(res, subtasks);
});

// Obter uma subtarefa pelo ID
export const getSubtaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subtaskId = req.params.subtaskId;
  const taskId = req.params.taskId;
  const userId = req.user.id;
  
  const subtask = await subtaskService.getSubtaskById(subtaskId, taskId, userId);
  
  if (!subtask) {
    return sendError(res, 'Subtarefa não encontrada', 404);
  }
  
  return sendSuccess(res, subtask);
});

// Criar uma nova subtarefa
export const createSubtask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const taskId = req.params.taskId;
  const userId = req.user.id;
  const { title, description } = req.body;
  
  if (!title) {
    return sendError(res, 'O título da subtarefa é obrigatório', 400);
  }
  
  const subtaskData = { title, description };
  const subtask = await subtaskService.createSubtask(taskId, userId, subtaskData);
  
  return sendSuccess(res, subtask, 201);
});

// Atualizar uma subtarefa
export const updateSubtask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subtaskId = req.params.subtaskId;
  const taskId = req.params.taskId;
  const userId = req.user.id;
  const { title, completed, description } = req.body;
  
  const updateData: { title?: string; completed?: boolean; description?: string } = {};
  
  if (title !== undefined) updateData.title = title;
  if (completed !== undefined) updateData.completed = completed;
  if (description !== undefined) updateData.description = description;
  
  const subtask = await subtaskService.updateSubtask(subtaskId, taskId, userId, updateData);
  
  if (!subtask) {
    return sendError(res, 'Subtarefa não encontrada', 404);
  }
  
  return sendSuccess(res, subtask);
});

// Excluir uma subtarefa
export const deleteSubtask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subtaskId = req.params.subtaskId;
  const taskId = req.params.taskId;
  const userId = req.user.id;
  
  const result = await subtaskService.deleteSubtask(subtaskId, taskId, userId);
  
  if (!result) {
    return sendError(res, 'Subtarefa não encontrada', 404);
  }
  
  return sendSuccess(res, { message: 'Subtarefa excluída com sucesso' });
}); 