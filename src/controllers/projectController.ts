import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import projectService from '../services/projectService';
import { asyncHandler, sendSuccess, sendError } from '../utils/apiHandlers';

// Obter todos os projetos do usuário
export const getAllProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projects = await projectService.getAllProjects(userId);
  
  return sendSuccess(res, { projects });
});

// Obter um projeto específico
export const getProjectById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.id;
  
  const project = await projectService.getProjectById(projectId, userId);
  
  return sendSuccess(res, { project });
});

// Criar um novo projeto
export const createProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, description } = req.body;
  
  if (!name) {
    return sendError(res, 'O nome do projeto é obrigatório', 400);
  }
  
  const project = await projectService.createProject(userId, { name, description });
  
  return sendSuccess(res, { project }, 201);
});

// Atualizar um projeto
export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.id;
  const { name, description } = req.body;
  
  if (!name && description === undefined) {
    return sendError(res, 'Pelo menos um campo para atualização deve ser fornecido', 400);
  }
  
  const project = await projectService.updateProject(projectId, userId, { 
    name, 
    description 
  });
  
  return sendSuccess(res, { project });
});

// Excluir um projeto
export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.id;
  
  await projectService.deleteProject(projectId, userId);
  
  return sendSuccess(res, { message: 'Projeto excluído com sucesso' });
});

// Obter colunas de um projeto
export const getProjectColumns = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.id;
  
  const columns = await projectService.getProjectColumns(projectId, userId);
  
  return sendSuccess(res, { columns });
});

// Adicionar coluna a um projeto
export const addColumn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.id;
  const { title, wip_limit } = req.body;
  
  if (!title) {
    return sendError(res, 'O título da coluna é obrigatório', 400);
  }
  
  const column = await projectService.addColumn(projectId, userId, { 
    title, 
    wip_limit 
  });
  
  return sendSuccess(res, { column }, 201);
});

// Atualizar uma coluna
export const updateColumn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.projectId;
  const columnId = req.params.columnId;
  const { title, order_position, wip_limit } = req.body;
  
  if (!title && order_position === undefined && wip_limit === undefined) {
    return sendError(res, 'Pelo menos um campo para atualização deve ser fornecido', 400);
  }
  
  const column = await projectService.updateColumn(columnId, projectId, userId, { 
    title, 
    order_position, 
    wip_limit 
  });
  
  return sendSuccess(res, { column });
});

// Excluir uma coluna
export const deleteColumn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.projectId;
  const columnId = req.params.columnId;
  
  await projectService.deleteColumn(columnId, projectId, userId);
  
  return sendSuccess(res, { message: 'Coluna excluída com sucesso' });
});

// Obter quadro kanban (projeto com colunas e tarefas)
export const getKanbanBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.id;
  
  const board = await projectService.getKanbanBoard(projectId, userId);
  
  return sendSuccess(res, { board });
});

// Obter métricas de um projeto
export const getProjectMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const projectId = req.params.id;
  
  const metrics = await projectService.getProjectMetrics(projectId, userId);
  
  return sendSuccess(res, { metrics });
}); 