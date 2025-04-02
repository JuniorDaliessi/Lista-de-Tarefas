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
// Classe de serviço de tarefas
class TaskService {
    // Obter todas as tarefas de um usuário
    getAllTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas:', error);
                throw error;
            }
        });
    }
    // Obter tarefas pendentes
    getPendingTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM tasks WHERE user_id = $1 AND completed = false ORDER BY created_at DESC', [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas pendentes:', error);
                throw error;
            }
        });
    }
    // Obter tarefas completadas
    getCompletedTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM tasks WHERE user_id = $1 AND completed = true ORDER BY updated_at DESC', [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas completadas:', error);
                throw error;
            }
        });
    }
    // Obter tarefa por ID
    getTaskById(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
                if (result.rows.length === 0) {
                    throw new Error('Tarefa não encontrada');
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao buscar tarefa:', error);
                throw error;
            }
        });
    }
    // Criar tarefa
    createTask(userId, taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se a categoria existe (se fornecida)
                if (taskData.category_id) {
                    const categoryCheck = yield client.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [taskData.category_id, userId]);
                    if (categoryCheck.rows.length === 0) {
                        throw new Error('Categoria não encontrada');
                    }
                }
                // Verificar se o projeto existe (se fornecido)
                if (taskData.project_id) {
                    const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [taskData.project_id, userId]);
                    if (projectCheck.rows.length === 0) {
                        throw new Error('Projeto não encontrado');
                    }
                    // Verificar se a coluna existe no projeto (se fornecida)
                    if (taskData.column_id) {
                        const columnCheck = yield client.query('SELECT * FROM kanban_columns WHERE project_id = $1 AND title = $2', [taskData.project_id, taskData.column_id]);
                        if (columnCheck.rows.length === 0) {
                            throw new Error('Coluna não encontrada no projeto');
                        }
                        // Obter a próxima ordem para a coluna
                        const orderResult = yield client.query('SELECT COALESCE(MAX(column_order), -1) + 1 AS next_order FROM tasks WHERE project_id = $1 AND column_id = $2', [taskData.project_id, taskData.column_id]);
                        const nextOrder = orderResult.rows[0].next_order;
                        // Criar a tarefa com a coluna e ordem
                        const result = yield client.query(`INSERT INTO tasks (
              user_id, title, description, due_date, priority, 
              completed, category_id, project_id, column_id, column_order
            ) VALUES ($1, $2, $3, $4, $5, false, $6, $7, $8, $9) 
            RETURNING *`, [
                            userId,
                            taskData.title,
                            taskData.description || null,
                            taskData.due_date || null,
                            taskData.priority || null,
                            taskData.category_id || null,
                            taskData.project_id,
                            taskData.column_id,
                            nextOrder
                        ]);
                        yield client.query('COMMIT');
                        return result.rows[0];
                    }
                }
                // Criar tarefa sem coluna ou com projeto, mas sem coluna específica
                const result = yield client.query(`INSERT INTO tasks (
          user_id, title, description, due_date, priority, 
          completed, category_id, project_id
        ) VALUES ($1, $2, $3, $4, $5, false, $6, $7) 
        RETURNING *`, [
                    userId,
                    taskData.title,
                    taskData.description || null,
                    taskData.due_date || null,
                    taskData.priority || null,
                    taskData.category_id || null,
                    taskData.project_id || null
                ]);
                yield client.query('COMMIT');
                return result.rows[0];
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao criar tarefa:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Atualizar tarefa
    updateTask(taskId, userId, taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se a tarefa existe e pertence ao usuário
                const taskCheck = yield client.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
                if (taskCheck.rows.length === 0) {
                    throw new Error('Tarefa não encontrada');
                }
                const currentTask = taskCheck.rows[0];
                // Verificar a categoria (se fornecida)
                if (taskData.category_id) {
                    const categoryCheck = yield client.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [taskData.category_id, userId]);
                    if (categoryCheck.rows.length === 0) {
                        throw new Error('Categoria não encontrada');
                    }
                }
                // Verificar o projeto (se fornecido ou alterado)
                if (taskData.project_id !== undefined &&
                    taskData.project_id !== currentTask.project_id) {
                    // Se o projeto é nulo, limpar coluna e ordem
                    if (taskData.project_id === null) {
                        taskData.column_id = null;
                        taskData.column_order = null;
                    }
                    else {
                        // Verificar se o projeto existe
                        const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [taskData.project_id, userId]);
                        if (projectCheck.rows.length === 0) {
                            throw new Error('Projeto não encontrado');
                        }
                        // Se o projeto for alterado e nenhuma coluna for especificada, 
                        // inserir na primeira coluna do novo projeto
                        if (taskData.column_id === undefined) {
                            const firstColumnResult = yield client.query('SELECT title FROM kanban_columns WHERE project_id = $1 ORDER BY order_position ASC LIMIT 1', [taskData.project_id]);
                            if (firstColumnResult.rows.length > 0) {
                                taskData.column_id = firstColumnResult.rows[0].title;
                                // Obter a próxima ordem para a coluna
                                const orderResult = yield client.query('SELECT COALESCE(MAX(column_order), -1) + 1 AS next_order FROM tasks WHERE project_id = $1 AND column_id = $2', [taskData.project_id, taskData.column_id]);
                                taskData.column_order = orderResult.rows[0].next_order;
                            }
                        }
                    }
                }
                // Verificar a coluna (se fornecida ou alterada)
                if (taskData.column_id !== undefined &&
                    taskData.column_id !== currentTask.column_id) {
                    // Se a coluna for nula, projeto deve ser nulo
                    if (taskData.column_id === null) {
                        if (taskData.project_id === undefined) {
                            taskData.project_id = null;
                        }
                    }
                    else {
                        // Verificar se a coluna existe no projeto atual ou no novo projeto
                        const projectId = taskData.project_id !== undefined ?
                            taskData.project_id : currentTask.project_id;
                        if (projectId) {
                            const columnCheck = yield client.query('SELECT * FROM kanban_columns WHERE project_id = $1 AND title = $2', [projectId, taskData.column_id]);
                            if (columnCheck.rows.length === 0) {
                                throw new Error('Coluna não encontrada no projeto');
                            }
                            // Obter a próxima ordem para a coluna
                            const orderResult = yield client.query('SELECT COALESCE(MAX(column_order), -1) + 1 AS next_order FROM tasks WHERE project_id = $1 AND column_id = $2', [projectId, taskData.column_id]);
                            taskData.column_order = orderResult.rows[0].next_order;
                        }
                    }
                }
                // Construir query dinamicamente com base nos campos fornecidos
                let query = 'UPDATE tasks SET updated_at = NOW()';
                const values = [];
                let paramCounter = 1;
                if (taskData.title !== undefined) {
                    query += `, title = $${paramCounter}`;
                    values.push(taskData.title);
                    paramCounter++;
                }
                if (taskData.description !== undefined) {
                    query += `, description = $${paramCounter}`;
                    values.push(taskData.description);
                    paramCounter++;
                }
                if (taskData.due_date !== undefined) {
                    query += `, due_date = $${paramCounter}`;
                    values.push(taskData.due_date);
                    paramCounter++;
                }
                if (taskData.priority !== undefined) {
                    query += `, priority = $${paramCounter}`;
                    values.push(taskData.priority);
                    paramCounter++;
                }
                if (taskData.completed !== undefined) {
                    query += `, completed = $${paramCounter}`;
                    values.push(taskData.completed);
                    paramCounter++;
                }
                if (taskData.category_id !== undefined) {
                    query += `, category_id = $${paramCounter}`;
                    values.push(taskData.category_id);
                    paramCounter++;
                }
                if (taskData.project_id !== undefined) {
                    query += `, project_id = $${paramCounter}`;
                    values.push(taskData.project_id);
                    paramCounter++;
                }
                if (taskData.column_id !== undefined) {
                    query += `, column_id = $${paramCounter}`;
                    values.push(taskData.column_id);
                    paramCounter++;
                }
                if (taskData.column_order !== undefined) {
                    query += `, column_order = $${paramCounter}`;
                    values.push(taskData.column_order);
                    paramCounter++;
                }
                query += ` WHERE id = $${paramCounter} AND user_id = $${paramCounter + 1} RETURNING *`;
                values.push(taskId, userId);
                const result = yield client.query(query, values);
                yield client.query('COMMIT');
                return result.rows[0];
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao atualizar tarefa:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Alternar status de conclusão da tarefa
    toggleTaskCompletion(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`UPDATE tasks 
        SET completed = NOT completed, updated_at = NOW() 
        WHERE id = $1 AND user_id = $2 
        RETURNING *`, [taskId, userId]);
                if (result.rows.length === 0) {
                    throw new Error('Tarefa não encontrada');
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao alternar status da tarefa:', error);
                throw error;
            }
        });
    }
    // Excluir tarefa
    deleteTask(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se a tarefa existe e pertence ao usuário
                const taskCheck = yield database_1.default.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
                if (taskCheck.rows.length === 0) {
                    throw new Error('Tarefa não encontrada');
                }
                yield database_1.default.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
                return true;
            }
            catch (error) {
                console.error('Erro ao excluir tarefa:', error);
                throw error;
            }
        });
    }
    // Mover tarefa para outra coluna
    moveTaskToColumn(taskId, userId, projectId, columnId, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se a tarefa existe e pertence ao usuário
                const taskCheck = yield client.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
                if (taskCheck.rows.length === 0) {
                    throw new Error('Tarefa não encontrada');
                }
                const currentTask = taskCheck.rows[0];
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                // Verificar se a coluna existe no projeto
                const columnCheck = yield client.query('SELECT * FROM kanban_columns WHERE project_id = $1 AND title = $2', [projectId, columnId]);
                if (columnCheck.rows.length === 0) {
                    throw new Error('Coluna não encontrada no projeto');
                }
                // Se estiver movendo entre colunas, reorganizar as tarefas na coluna anterior
                if (currentTask.column_id !== columnId || currentTask.project_id !== projectId) {
                    // Reorganizar as tarefas na coluna anterior (se aplicável)
                    if (currentTask.column_id && currentTask.project_id) {
                        yield client.query(`UPDATE tasks 
            SET column_order = column_order - 1 
            WHERE project_id = $1 
              AND column_id = $2 
              AND column_order > $3`, [currentTask.project_id, currentTask.column_id, currentTask.column_order]);
                    }
                }
                // Reorganizar as tarefas na nova coluna para abrir espaço para a tarefa
                yield client.query(`UPDATE tasks 
        SET column_order = column_order + 1 
        WHERE project_id = $1 
          AND column_id = $2 
          AND column_order >= $3`, [projectId, columnId, position]);
                // Atualizar a tarefa com a nova coluna e posição
                const result = yield client.query(`UPDATE tasks 
        SET project_id = $1, column_id = $2, column_order = $3, updated_at = NOW() 
        WHERE id = $4 AND user_id = $5 
        RETURNING *`, [projectId, columnId, position, taskId, userId]);
                yield client.query('COMMIT');
                return result.rows[0];
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao mover tarefa:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Buscar tarefas por projeto
    getTasksByProject(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se o projeto existe e pertence ao usuário
                const projectCheck = yield database_1.default.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);
                if (projectCheck.rows.length === 0) {
                    throw new Error('Projeto não encontrado');
                }
                const result = yield database_1.default.query(`SELECT * FROM tasks 
        WHERE project_id = $1 AND user_id = $2 
        ORDER BY column_id, column_order ASC`, [projectId, userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas do projeto:', error);
                throw error;
            }
        });
    }
    // Buscar tarefas por categoria
    getTasksByCategory(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se a categoria existe e pertence ao usuário
                const categoryCheck = yield database_1.default.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
                if (categoryCheck.rows.length === 0) {
                    throw new Error('Categoria não encontrada');
                }
                const result = yield database_1.default.query('SELECT * FROM tasks WHERE category_id = $1 AND user_id = $2 ORDER BY created_at DESC', [categoryId, userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas da categoria:', error);
                throw error;
            }
        });
    }
    // Buscar tarefas com vencimento próximo
    getUpcomingTasks(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, daysAhead = 7) {
            try {
                const result = yield database_1.default.query(`SELECT * FROM tasks 
        WHERE user_id = $1 
          AND completed = false 
          AND due_date IS NOT NULL 
          AND due_date BETWEEN NOW() AND NOW() + INTERVAL '${daysAhead} days' 
        ORDER BY due_date ASC`, [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas próximas:', error);
                throw error;
            }
        });
    }
    // Buscar tarefas atrasadas
    getOverdueTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`SELECT * FROM tasks 
        WHERE user_id = $1 
          AND completed = false 
          AND due_date IS NOT NULL 
          AND due_date < CURRENT_DATE 
        ORDER BY due_date ASC`, [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas atrasadas:', error);
                throw error;
            }
        });
    }
    // Buscar tarefas por prioridade
    getTasksByPriority(userId, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM tasks WHERE user_id = $1 AND priority = $2 ORDER BY created_at DESC', [userId, priority]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas por prioridade:', error);
                throw error;
            }
        });
    }
    // Buscar estatísticas de tarefas
    getTaskStatistics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`SELECT
          COUNT(*) AS total_tasks,
          SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_tasks,
          SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) AS pending_tasks,
          SUM(CASE WHEN completed = false AND due_date < CURRENT_DATE THEN 1 ELSE 0 END) AS overdue_tasks,
          SUM(CASE WHEN priority = 'alta' THEN 1 ELSE 0 END) AS high_priority_tasks,
          SUM(CASE WHEN priority = 'média' THEN 1 ELSE 0 END) AS medium_priority_tasks,
          SUM(CASE WHEN priority = 'baixa' THEN 1 ELSE 0 END) AS low_priority_tasks
        FROM tasks
        WHERE user_id = $1`, [userId]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao buscar estatísticas de tarefas:', error);
                throw error;
            }
        });
    }
}
exports.default = new TaskService();
