import pool from '../config/database';

// Interface para um projeto
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

// Interface para uma coluna kanban
export interface KanbanColumn {
  id: string;
  project_id: string;
  title: string;
  order_position: number;
  wip_limit: number | null;
  created_at: Date;
  updated_at: Date;
}

// Interface para criação de projeto
export interface ProjectCreation {
  name: string;
  description?: string;
}

// Interface para atualização de projeto
export interface ProjectUpdate {
  name?: string;
  description?: string | null;
}

// Interface para criação de coluna
export interface ColumnCreation {
  title: string;
  wip_limit?: number | null;
}

// Interface para atualização de coluna
export interface ColumnUpdate {
  title?: string;
  order_position?: number;
  wip_limit?: number | null;
}

// Classe de serviço para gerenciamento de projetos e kanban
class ProjectService {
  // Obter todos os projetos de um usuário
  async getAllProjects(userId: string): Promise<Project[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    }
  }
  
  // Obter projeto por ID
  async getProjectById(projectId: string, userId: string): Promise<Project> {
    try {
      const result = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      throw error;
    }
  }
  
  // Criar um novo projeto
  async createProject(userId: string, projectData: ProjectCreation): Promise<Project> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se já existe um projeto com esse nome para o usuário
      const existingProject = await client.query(
        'SELECT * FROM projects WHERE user_id = $1 AND name = $2',
        [userId, projectData.name]
      );
      
      if (existingProject.rows.length > 0) {
        throw new Error('Já existe um projeto com esse nome');
      }
      
      // Criar o projeto
      const result = await client.query(
        `INSERT INTO projects (user_id, name, description) 
        VALUES ($1, $2, $3) 
        RETURNING *`,
        [userId, projectData.name, projectData.description || null]
      );
      
      const project = result.rows[0];
      
      // Criar colunas padrão para o projeto (To Do, In Progress, Done)
      await client.query(
        `INSERT INTO kanban_columns (project_id, title, order_position) 
        VALUES 
          ($1, 'A Fazer', 0),
          ($1, 'Em Progresso', 1),
          ($1, 'Concluído', 2)`,
        [project.id]
      );
      
      await client.query('COMMIT');
      return project;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao criar projeto:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Atualizar um projeto
  async updateProject(
    projectId: string, 
    userId: string, 
    projectData: ProjectUpdate
  ): Promise<Project> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se o projeto existe e pertence ao usuário
      const projectCheck = await client.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectCheck.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      // Verificar se o novo nome não conflita com outro projeto
      if (projectData.name) {
        const nameCheck = await client.query(
          'SELECT * FROM projects WHERE user_id = $1 AND name = $2 AND id != $3',
          [userId, projectData.name, projectId]
        );
        
        if (nameCheck.rows.length > 0) {
          throw new Error('Já existe um projeto com esse nome');
        }
      }
      
      // Construir query dinamicamente com base nos campos fornecidos
      let query = 'UPDATE projects SET updated_at = NOW()';
      const values: any[] = [];
      let paramCounter = 1;
      
      if (projectData.name !== undefined) {
        query += `, name = $${paramCounter}`;
        values.push(projectData.name);
        paramCounter++;
      }
      
      if (projectData.description !== undefined) {
        query += `, description = $${paramCounter}`;
        values.push(projectData.description);
        paramCounter++;
      }
      
      query += ` WHERE id = $${paramCounter} AND user_id = $${paramCounter + 1} RETURNING *`;
      values.push(projectId, userId);
      
      const result = await client.query(query, values);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Excluir um projeto
  async deleteProject(projectId: string, userId: string): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se o projeto existe e pertence ao usuário
      const projectCheck = await client.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectCheck.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      // Atualizar tarefas para remover referência ao projeto
      await client.query(
        'UPDATE tasks SET project_id = NULL, column_id = NULL, column_order = NULL WHERE project_id = $1',
        [projectId]
      );
      
      // Excluir todas as colunas do projeto
      await client.query(
        'DELETE FROM kanban_columns WHERE project_id = $1',
        [projectId]
      );
      
      // Excluir o projeto
      await client.query(
        'DELETE FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao excluir projeto:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Obter colunas de um projeto
  async getProjectColumns(projectId: string, userId: string): Promise<KanbanColumn[]> {
    try {
      // Verificar se o projeto existe e pertence ao usuário
      const projectCheck = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectCheck.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      const result = await pool.query(
        'SELECT * FROM kanban_columns WHERE project_id = $1 ORDER BY order_position ASC',
        [projectId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar colunas do projeto:', error);
      throw error;
    }
  }
  
  // Adicionar coluna a um projeto
  async addColumn(
    projectId: string, 
    userId: string, 
    columnData: ColumnCreation
  ): Promise<KanbanColumn> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se o projeto existe e pertence ao usuário
      const projectCheck = await client.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectCheck.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      // Verificar se já existe uma coluna com esse título no projeto
      const columnCheck = await client.query(
        'SELECT * FROM kanban_columns WHERE project_id = $1 AND title = $2',
        [projectId, columnData.title]
      );
      
      if (columnCheck.rows.length > 0) {
        throw new Error('Já existe uma coluna com esse título no projeto');
      }
      
      // Determinar a próxima posição de ordem
      const orderResult = await client.query(
        'SELECT COALESCE(MAX(order_position), -1) + 1 AS next_position FROM kanban_columns WHERE project_id = $1',
        [projectId]
      );
      
      const nextPosition = orderResult.rows[0].next_position;
      
      // Criar a coluna
      const result = await client.query(
        `INSERT INTO kanban_columns (project_id, title, order_position, wip_limit) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [projectId, columnData.title, nextPosition, columnData.wip_limit || null]
      );
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao adicionar coluna ao projeto:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Atualizar uma coluna
  async updateColumn(
    columnId: string, 
    projectId: string, 
    userId: string, 
    columnData: ColumnUpdate
  ): Promise<KanbanColumn> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se o projeto existe e pertence ao usuário
      const projectCheck = await client.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectCheck.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      // Verificar se a coluna existe e pertence ao projeto
      const columnCheck = await client.query(
        'SELECT * FROM kanban_columns WHERE id = $1 AND project_id = $2',
        [columnId, projectId]
      );
      
      if (columnCheck.rows.length === 0) {
        throw new Error('Coluna não encontrada no projeto');
      }
      
      // Verificar se há conflito de título com outra coluna
      if (columnData.title) {
        const titleCheck = await client.query(
          'SELECT * FROM kanban_columns WHERE project_id = $1 AND title = $2 AND id != $3',
          [projectId, columnData.title, columnId]
        );
        
        if (titleCheck.rows.length > 0) {
          throw new Error('Já existe uma coluna com esse título no projeto');
        }
      }
      
      // Se houver alteração de posição, reorganizar as outras colunas
      if (columnData.order_position !== undefined) {
        const currentColumn = columnCheck.rows[0];
        const currentPosition = currentColumn.order_position;
        const newPosition = columnData.order_position;
        
        // Verificar limites de posição
        const countResult = await client.query(
          'SELECT COUNT(*) AS column_count FROM kanban_columns WHERE project_id = $1',
          [projectId]
        );
        
        const columnCount = parseInt(countResult.rows[0].column_count);
        
        if (newPosition < 0 || newPosition >= columnCount) {
          throw new Error(`Posição deve estar entre 0 e ${columnCount - 1}`);
        }
        
        // Reorganizar posições
        if (newPosition > currentPosition) {
          // Mover para cima: diminuir posição das colunas entre a posição atual e a nova
          await client.query(
            `UPDATE kanban_columns 
            SET order_position = order_position - 1 
            WHERE project_id = $1 
              AND order_position > $2 
              AND order_position <= $3`,
            [projectId, currentPosition, newPosition]
          );
        } else if (newPosition < currentPosition) {
          // Mover para baixo: aumentar posição das colunas entre a nova posição e a atual
          await client.query(
            `UPDATE kanban_columns 
            SET order_position = order_position + 1 
            WHERE project_id = $1 
              AND order_position >= $2 
              AND order_position < $3`,
            [projectId, newPosition, currentPosition]
          );
        }
      }
      
      // Construir query dinamicamente com base nos campos fornecidos
      let query = 'UPDATE kanban_columns SET updated_at = NOW()';
      const values: any[] = [];
      let paramCounter = 1;
      
      if (columnData.title !== undefined) {
        query += `, title = $${paramCounter}`;
        values.push(columnData.title);
        paramCounter++;
      }
      
      if (columnData.order_position !== undefined) {
        query += `, order_position = $${paramCounter}`;
        values.push(columnData.order_position);
        paramCounter++;
      }
      
      if (columnData.wip_limit !== undefined) {
        query += `, wip_limit = $${paramCounter}`;
        values.push(columnData.wip_limit);
        paramCounter++;
      }
      
      query += ` WHERE id = $${paramCounter} AND project_id = $${paramCounter + 1} RETURNING *`;
      values.push(columnId, projectId);
      
      const result = await client.query(query, values);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar coluna:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Excluir uma coluna
  async deleteColumn(columnId: string, projectId: string, userId: string): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se o projeto existe e pertence ao usuário
      const projectCheck = await client.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectCheck.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      // Verificar se a coluna existe e pertence ao projeto
      const columnCheck = await client.query(
        'SELECT * FROM kanban_columns WHERE id = $1 AND project_id = $2',
        [columnId, projectId]
      );
      
      if (columnCheck.rows.length === 0) {
        throw new Error('Coluna não encontrada no projeto');
      }
      
      // Verificar se é a última coluna (não permitir excluir a última coluna)
      const countResult = await client.query(
        'SELECT COUNT(*) AS column_count FROM kanban_columns WHERE project_id = $1',
        [projectId]
      );
      
      const columnCount = parseInt(countResult.rows[0].column_count);
      
      if (columnCount <= 1) {
        throw new Error('Não é possível excluir a última coluna do projeto');
      }
      
      const deletedColumn = columnCheck.rows[0];
      
      // Mover tarefas para a primeira coluna disponível
      const firstColumnResult = await client.query(
        `SELECT * FROM kanban_columns 
        WHERE project_id = $1 AND id != $2 
        ORDER BY order_position ASC 
        LIMIT 1`,
        [projectId, columnId]
      );
      
      const firstColumn = firstColumnResult.rows[0];
      
      // Atualizar tarefas da coluna removida
      await client.query(
        `UPDATE tasks 
        SET column_id = $1, 
            column_order = (
              SELECT COALESCE(MAX(column_order), -1) + 1 
              FROM tasks 
              WHERE project_id = $2 AND column_id = $3
            ),
            updated_at = NOW()
        WHERE project_id = $2 AND column_id = $4`,
        [firstColumn.title, projectId, firstColumn.title, deletedColumn.title]
      );
      
      // Excluir a coluna
      await client.query(
        'DELETE FROM kanban_columns WHERE id = $1',
        [columnId]
      );
      
      // Reorganizar as posições das outras colunas
      await client.query(
        `UPDATE kanban_columns 
        SET order_position = order_position - 1,
            updated_at = NOW() 
        WHERE project_id = $1 AND order_position > $2`,
        [projectId, deletedColumn.order_position]
      );
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao excluir coluna:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Obter quadro kanban (projeto com colunas e tarefas)
  async getKanbanBoard(projectId: string, userId: string): Promise<any> {
    try {
      // Verificar se o projeto existe e pertence ao usuário
      const projectResult = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectResult.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      const project = projectResult.rows[0];
      
      // Obter todas as colunas do projeto
      const columnsResult = await pool.query(
        'SELECT * FROM kanban_columns WHERE project_id = $1 ORDER BY order_position ASC',
        [projectId]
      );
      
      const columns = columnsResult.rows;
      
      // Obter todas as tarefas do projeto
      const tasksResult = await pool.query(
        `SELECT * FROM tasks 
        WHERE project_id = $1 AND user_id = $2 
        ORDER BY column_order ASC`,
        [projectId, userId]
      );
      
      const tasks = tasksResult.rows;
      
      // Organizar tarefas por coluna
      const columnMap = columns.map(column => {
        const columnTasks = tasks.filter(task => task.column_id === column.title);
        return {
          ...column,
          tasks: columnTasks
        };
      });
      
      // Retornar o quadro completo
      return {
        project,
        columns: columnMap
      };
    } catch (error) {
      console.error('Erro ao buscar quadro kanban:', error);
      throw error;
    }
  }
  
  // Obter métricas do projeto
  async getProjectMetrics(projectId: string, userId: string): Promise<any> {
    try {
      // Verificar se o projeto existe e pertence ao usuário
      const projectCheck = await pool.query(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );
      
      if (projectCheck.rows.length === 0) {
        throw new Error('Projeto não encontrado');
      }
      
      // Estatísticas gerais do projeto
      const statsResult = await pool.query(
        `SELECT
          COUNT(*) AS total_tasks,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_tasks,
          SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) AS pending_tasks,
          COUNT(DISTINCT category_id) AS categories_used,
          ROUND(
            CASE 
              WHEN COUNT(*) > 0 
              THEN (SUM(CASE WHEN completed = true THEN 1 ELSE 0 END)::float / COUNT(*)) * 100
              ELSE 0
            END, 
            2
          ) AS completion_percentage
        FROM tasks
        WHERE project_id = $1 AND user_id = $2`,
        [projectId, userId]
      );
      
      // Tempo médio por coluna
      const columnTimeResult = await pool.query(
        `SELECT 
          kc.title AS column_name,
          AVG(EXTRACT(EPOCH FROM (COALESCE(tm.left_at, NOW()) - tm.entered_at))/3600) AS avg_hours_in_column,
          COUNT(DISTINCT t.id) AS task_count
        FROM 
          kanban_columns kc
        LEFT JOIN 
          task_metrics tm ON kc.id = tm.column_id
        LEFT JOIN 
          tasks t ON t.project_id = $1 AND t.column_id = kc.title
        WHERE 
          kc.project_id = $1
        GROUP BY 
          kc.title
        ORDER BY 
          kc.order_position`,
        [projectId]
      );
      
      // Tarefas por prioridade
      const priorityResult = await pool.query(
        `SELECT 
          COALESCE(priority, 'sem prioridade') AS priority,
          COUNT(*) AS task_count
        FROM 
          tasks
        WHERE 
          project_id = $1 AND user_id = $2
        GROUP BY 
          priority
        ORDER BY 
          CASE 
            WHEN priority = 'alta' THEN 1
            WHEN priority = 'média' THEN 2
            WHEN priority = 'baixa' THEN 3
            ELSE 4
          END`,
        [projectId, userId]
      );
      
      // Tarefas por categoria
      const categoryResult = await pool.query(
        `SELECT 
          COALESCE(c.name, 'Sem categoria') AS category,
          COUNT(*) AS task_count
        FROM 
          tasks t
        LEFT JOIN 
          categories c ON t.category_id = c.id
        WHERE 
          t.project_id = $1 AND t.user_id = $2
        GROUP BY 
          c.name
        ORDER BY 
          task_count DESC`,
        [projectId, userId]
      );
      
      // Atividade recente (últimos 30 dias)
      const activityResult = await pool.query(
        `SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS tasks_created,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS tasks_completed
        FROM 
          tasks
        WHERE 
          project_id = $1 AND user_id = $2
          AND created_at > NOW() - INTERVAL '30 days'
        GROUP BY 
          DATE(created_at)
        ORDER BY 
          date DESC`,
        [projectId, userId]
      );
      
      return {
        stats: statsResult.rows[0],
        column_time: columnTimeResult.rows,
        priority_distribution: priorityResult.rows,
        category_distribution: categoryResult.rows,
        recent_activity: activityResult.rows
      };
    } catch (error) {
      console.error('Erro ao buscar métricas do projeto:', error);
      throw error;
    }
  }
}

export default new ProjectService(); 