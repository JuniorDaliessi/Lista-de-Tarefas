"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
// Classe de serviço para gerenciamento de projetos e kanban
class ProjectService {
    // Obter todos os projetos de um usuário
    getAllProjects(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar projetos:', error);
                throw error;
            }
        });
    }
    // Obter projeto por ID
    getProjectById(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (result.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao buscar projeto:', error);
                throw error;
            }
        });
    }
    // Criar um novo projeto
    createProject(userId, projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se já existe um projeto com esse nome para o usuário
                const existingProject = yield client.query('SELECT * FROM projects WHERE user_id = $1 AND name = $2', [userId, projectData.name]);
                if (existingProject.rows.length > 0) {
                    throw new Error('Já existe um projeto com esse nome');
                }
                // Criar o projeto
                const result = yield client.query(`INSERT INTO projects (user_id, name, description) 
        VALUES ($1, $2, $3) 
        RETURNING *`, [userId, projectData.name, projectData.description || null]);
                const project = result.rows[0];
                // Criar colunas padrão para o projeto (To Do, In Progress, Done)
                yield client.query(`INSERT INTO kanban_columns (project_id, title, order_position) 
        VALUES 
          ($1, 'A Fazer', 0),
          ($1, 'Em Progresso', 1),
          ($1, 'Concluído', 2)`, [project.id]);
                yield client.query('COMMIT');
                return project;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao criar projeto:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Atualizar um projeto
    updateProject(projectId, userId, projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                // Verificar se o novo nome não conflita com outro projeto
                if (projectData.name) {
                    const nameCheck = yield client.query('SELECT * FROM projects WHERE user_id = $1 AND name = $2 AND id != $3', [userId, projectData.name, projectId]);
                    if (nameCheck.rows.length > 0) {
                        throw new Error('Já existe um projeto com esse nome');
                    }
                }
                // Construir query dinamicamente com base nos campos fornecidos
                let query = 'UPDATE projects SET updated_at = NOW()';
                const values = [];
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
                const result = yield client.query(query, values);
                yield client.query('COMMIT');
                return result.rows[0];
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao atualizar projeto:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Excluir um projeto
    deleteProject(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                // Atualizar tarefas para remover referência ao projeto
                yield client.query('UPDATE tasks SET project_id = NULL, column_id = NULL, column_order = NULL WHERE project_id = $1', [projectId]);
                // Excluir todas as colunas do projeto
                yield client.query('DELETE FROM kanban_columns WHERE project_id = $1', [projectId]);
                // Excluir o projeto
                yield client.query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                yield client.query('COMMIT');
                return true;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao excluir projeto:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Obter colunas de um projeto
    getProjectColumns(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield database_1.default.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                const result = yield database_1.default.query('SELECT * FROM kanban_columns WHERE project_id = $1 ORDER BY order_position ASC', [projectId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar colunas do projeto:', error);
                throw error;
            }
        });
    }
    // Adicionar coluna a um projeto
    addColumn(projectId, userId, columnData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                // Verificar se já existe uma coluna com esse título no projeto
                const columnCheck = yield client.query('SELECT * FROM kanban_columns WHERE project_id = $1 AND title = $2', [projectId, columnData.title]);
                if (columnCheck.rows.length > 0) {
                    throw new Error('Já existe uma coluna com esse título no projeto');
                }
                // Determinar a próxima posição de ordem
                const orderResult = yield client.query('SELECT COALESCE(MAX(order_position), -1) + 1 AS next_position FROM kanban_columns WHERE project_id = $1', [projectId]);
                const nextPosition = orderResult.rows[0].next_position;
                // Criar a coluna
                const result = yield client.query(`INSERT INTO kanban_columns (project_id, title, order_position, wip_limit) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`, [projectId, columnData.title, nextPosition, columnData.wip_limit || null]);
                yield client.query('COMMIT');
                return result.rows[0];
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao adicionar coluna ao projeto:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Atualizar uma coluna
    updateColumn(columnId, projectId, userId, columnData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                // Verificar se a coluna existe e pertence ao projeto
                const columnCheck = yield client.query('SELECT * FROM kanban_columns WHERE id = $1 AND project_id = $2', [columnId, projectId]);
                if (columnCheck.rows.length === 0) {
                    throw new Error('Coluna não encontrada no projeto');
                }
                // Verificar se há conflito de título com outra coluna
                if (columnData.title) {
                    const titleCheck = yield client.query('SELECT * FROM kanban_columns WHERE project_id = $1 AND title = $2 AND id != $3', [projectId, columnData.title, columnId]);
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
                    const countResult = yield client.query('SELECT COUNT(*) AS column_count FROM kanban_columns WHERE project_id = $1', [projectId]);
                    const columnCount = parseInt(countResult.rows[0].column_count);
                    if (newPosition < 0 || newPosition >= columnCount) {
                        throw new Error(`Posição deve estar entre 0 e ${columnCount - 1}`);
                    }
                    // Reorganizar posições
                    if (newPosition > currentPosition) {
                        // Mover para cima: diminuir posição das colunas entre a posição atual e a nova
                        yield client.query(`UPDATE kanban_columns 
            SET order_position = order_position - 1 
            WHERE project_id = $1 
              AND order_position > $2 
              AND order_position <= $3`, [projectId, currentPosition, newPosition]);
                    }
                    else if (newPosition < currentPosition) {
                        // Mover para baixo: aumentar posição das colunas entre a nova posição e a atual
                        yield client.query(`UPDATE kanban_columns 
            SET order_position = order_position + 1 
            WHERE project_id = $1 
              AND order_position >= $2 
              AND order_position < $3`, [projectId, newPosition, currentPosition]);
                    }
                }
                // Construir query dinamicamente com base nos campos fornecidos
                let query = 'UPDATE kanban_columns SET updated_at = NOW()';
                const values = [];
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
                const result = yield client.query(query, values);
                yield client.query('COMMIT');
                return result.rows[0];
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao atualizar coluna:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Excluir uma coluna
    deleteColumn(columnId, projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                // Verificar se a coluna existe e pertence ao projeto
                const columnCheck = yield client.query('SELECT * FROM kanban_columns WHERE id = $1 AND project_id = $2', [columnId, projectId]);
                if (columnCheck.rows.length === 0) {
                    throw new Error('Coluna não encontrada no projeto');
                }
                // Verificar se é a última coluna (não permitir excluir a última coluna)
                const countResult = yield client.query('SELECT COUNT(*) AS column_count FROM kanban_columns WHERE project_id = $1', [projectId]);
                const columnCount = parseInt(countResult.rows[0].column_count);
                if (columnCount <= 1) {
                    throw new Error('Não é possível excluir a última coluna do projeto');
                }
                const deletedColumn = columnCheck.rows[0];
                // Mover tarefas para a primeira coluna disponível
                const firstColumnResult = yield client.query(`SELECT * FROM kanban_columns 
        WHERE project_id = $1 AND id != $2 
        ORDER BY order_position ASC 
        LIMIT 1`, [projectId, columnId]);
                const firstColumn = firstColumnResult.rows[0];
                // Atualizar tarefas da coluna removida
                yield client.query(`UPDATE tasks 
        SET column_id = $1, 
            column_order = (
              SELECT COALESCE(MAX(column_order), -1) + 1 
              FROM tasks 
              WHERE project_id = $2 AND column_id = $3
            ),
            updated_at = NOW()
        WHERE project_id = $2 AND column_id = $4`, [firstColumn.title, projectId, firstColumn.title, deletedColumn.title]);
                // Excluir a coluna
                yield client.query('DELETE FROM kanban_columns WHERE id = $1', [columnId]);
                // Reorganizar as posições das outras colunas
                yield client.query(`UPDATE kanban_columns 
        SET order_position = order_position - 1,
            updated_at = NOW() 
        WHERE project_id = $1 AND order_position > $2`, [projectId, deletedColumn.order_position]);
                yield client.query('COMMIT');
                return true;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao excluir coluna:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Obter quadro kanban (projeto com colunas e tarefas)
    getKanbanBoard(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se o projeto existe e pertence ao usuário
                const projectResult = yield database_1.default.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectResult.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                const project = projectResult.rows[0];
                // Obter todas as colunas do projeto
                const columnsResult = yield database_1.default.query('SELECT * FROM kanban_columns WHERE project_id = $1 ORDER BY order_position ASC', [projectId]);
                const columns = columnsResult.rows;
                // Obter todas as tarefas do projeto
                const tasksResult = yield database_1.default.query(`SELECT * FROM tasks 
        WHERE project_id = $1 AND user_id = $2 
        ORDER BY column_order ASC`, [projectId, userId]);
                const tasks = tasksResult.rows;
                // Organizar tarefas por coluna
                const columnMap = columns.map(column => {
                    const columnTasks = tasks.filter(task => task.column_id === column.title);
                    return Object.assign(Object.assign({}, column), { tasks: columnTasks });
                });
                // Retornar o quadro completo
                return {
                    project,
                    columns: columnMap
                };
            }
            catch (error) {
                console.error('Erro ao buscar quadro kanban:', error);
                throw error;
            }
        });
    }
    // Obter métricas do projeto
    getProjectMetrics(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield database_1.default.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                // Estatísticas gerais do projeto
                const statsResult = yield database_1.default.query(`SELECT
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
        WHERE project_id = $1 AND user_id = $2`, [projectId, userId]);
                // Tempo médio por coluna
                const columnTimeResult = yield database_1.default.query(`SELECT 
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
          kc.order_position`, [projectId]);
                // Tarefas por prioridade
                const priorityResult = yield database_1.default.query(`SELECT 
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
          END`, [projectId, userId]);
                // Tarefas por categoria
                const categoryResult = yield database_1.default.query(`SELECT 
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
          task_count DESC`, [projectId, userId]);
                // Atividade recente (últimos 30 dias)
                const activityResult = yield database_1.default.query(`SELECT 
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
          date DESC`, [projectId, userId]);
                return {
                    stats: statsResult.rows[0],
                    column_time: columnTimeResult.rows,
                    priority_distribution: priorityResult.rows,
                    category_distribution: categoryResult.rows,
                    recent_activity: activityResult.rows
                };
            }
            catch (error) {
                console.error('Erro ao buscar métricas do projeto:', error);
                throw error;
            }
        });
    }
}
exports.default = new ProjectService();
