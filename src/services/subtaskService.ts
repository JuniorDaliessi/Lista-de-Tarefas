import pool from '../config/database';
import { ApiException } from '../utils/apiHandlers';

// Interface para representar uma subtarefa
export interface Subtask {
  subtask_id: string;
  task_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

// Interface para criação de subtarefa
export interface SubtaskCreation {
  title: string;
  description?: string;
}

// Interface para atualização de subtarefa
export interface SubtaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Classe de serviço de subtarefas
class SubtaskService {
  // Obter todas as subtarefas de uma tarefa
  async getAllSubtasks(taskId: string, userId: string): Promise<Subtask[]> {
    // Verificar se a tarefa existe e pertence ao usuário
    const taskCheck = await pool.query(
      'SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
      throw new ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
    }

    // Obter todas as subtarefas
    const result = await pool.query(
      `SELECT * FROM subtasks 
       WHERE task_id = $1 
       ORDER BY created_at`,
      [taskId]
    );

    return result.rows;
  }
  
  // Obter uma subtarefa específica
  async getSubtaskById(subtaskId: string, taskId: string, userId: string): Promise<Subtask | null> {
    // Verificar se a tarefa existe e pertence ao usuário
    const taskCheck = await pool.query(
      'SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
      throw new ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
    }

    // Obter a subtarefa
    const result = await pool.query(
      'SELECT * FROM subtasks WHERE subtask_id = $1 AND task_id = $2',
      [subtaskId, taskId]
    );

    return result.rowCount && result.rowCount > 0 ? result.rows[0] : null;
  }
  
  // Criar uma nova subtarefa
  async createSubtask(taskId: string, userId: string, subtaskData: SubtaskCreation): Promise<Subtask> {
    // Verificar se a tarefa existe e pertence ao usuário
    const taskCheck = await pool.query(
      'SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
      throw new ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
    }

    // Criar a subtarefa
    const result = await pool.query(
      `INSERT INTO subtasks(task_id, title, description)
       VALUES($1, $2, $3)
       RETURNING *`,
      [taskId, subtaskData.title, subtaskData.description || null]
    );

    return result.rows[0];
  }
  
  // Atualizar uma subtarefa
  async updateSubtask(subtaskId: string, taskId: string, userId: string, subtaskData: SubtaskUpdate): Promise<Subtask | null> {
    // Verificar se a tarefa existe e pertence ao usuário
    const taskCheck = await pool.query(
      'SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
      throw new ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
    }

    // Verificar se a subtarefa existe
    const subtaskCheck = await pool.query(
      'SELECT subtask_id FROM subtasks WHERE subtask_id = $1 AND task_id = $2',
      [subtaskId, taskId]
    );

    if (!subtaskCheck.rowCount || subtaskCheck.rowCount === 0) {
      return null;
    }

    // Construir a query de atualização
    const updateFields = [];
    const queryParams = [];
    let paramCounter = 1;

    if (subtaskData.title !== undefined) {
      updateFields.push(`title = $${paramCounter}`);
      queryParams.push(subtaskData.title);
      paramCounter++;
    }

    if (subtaskData.description !== undefined) {
      updateFields.push(`description = $${paramCounter}`);
      queryParams.push(subtaskData.description);
      paramCounter++;
    }

    if (subtaskData.completed !== undefined) {
      updateFields.push(`completed = $${paramCounter}`);
      queryParams.push(subtaskData.completed);
      paramCounter++;
    }

    if (updateFields.length === 0) {
      // Nada para atualizar
      const current = await this.getSubtaskById(subtaskId, taskId, userId);
      return current;
    }

    // Adicionar updated_at
    updateFields.push(`updated_at = NOW()`);

    // Adicionar parâmetros da where clause
    queryParams.push(subtaskId);
    queryParams.push(taskId);

    // Executar a query
    const query = `
      UPDATE subtasks 
      SET ${updateFields.join(', ')} 
      WHERE subtask_id = $${paramCounter} AND task_id = $${paramCounter + 1}
      RETURNING *
    `;

    const result = await pool.query(query, queryParams);
    return result.rowCount && result.rowCount > 0 ? result.rows[0] : null;
  }
  
  // Excluir uma subtarefa
  async deleteSubtask(subtaskId: string, taskId: string, userId: string): Promise<boolean> {
    // Verificar se a tarefa existe e pertence ao usuário
    const taskCheck = await pool.query(
      'SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
      throw new ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
    }

    // Excluir a subtarefa
    const result = await pool.query(
      'DELETE FROM subtasks WHERE subtask_id = $1 AND task_id = $2 RETURNING subtask_id',
      [subtaskId, taskId]
    );

    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export default new SubtaskService(); 