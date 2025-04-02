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
const apiHandlers_1 = require("../utils/apiHandlers");
// Classe de serviço de subtarefas
class SubtaskService {
    // Obter todas as subtarefas de uma tarefa
    getAllSubtasks(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se a tarefa existe e pertence ao usuário
            const taskCheck = yield database_1.default.query('SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2', [taskId, userId]);
            if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
                throw new apiHandlers_1.ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
            }
            // Obter todas as subtarefas
            const result = yield database_1.default.query(`SELECT * FROM subtasks 
       WHERE task_id = $1 
       ORDER BY created_at`, [taskId]);
            return result.rows;
        });
    }
    // Obter uma subtarefa específica
    getSubtaskById(subtaskId, taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se a tarefa existe e pertence ao usuário
            const taskCheck = yield database_1.default.query('SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2', [taskId, userId]);
            if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
                throw new apiHandlers_1.ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
            }
            // Obter a subtarefa
            const result = yield database_1.default.query('SELECT * FROM subtasks WHERE subtask_id = $1 AND task_id = $2', [subtaskId, taskId]);
            return result.rowCount && result.rowCount > 0 ? result.rows[0] : null;
        });
    }
    // Criar uma nova subtarefa
    createSubtask(taskId, userId, subtaskData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se a tarefa existe e pertence ao usuário
            const taskCheck = yield database_1.default.query('SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2', [taskId, userId]);
            if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
                throw new apiHandlers_1.ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
            }
            // Criar a subtarefa
            const result = yield database_1.default.query(`INSERT INTO subtasks(task_id, title, description)
       VALUES($1, $2, $3)
       RETURNING *`, [taskId, subtaskData.title, subtaskData.description || null]);
            return result.rows[0];
        });
    }
    // Atualizar uma subtarefa
    updateSubtask(subtaskId, taskId, userId, subtaskData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se a tarefa existe e pertence ao usuário
            const taskCheck = yield database_1.default.query('SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2', [taskId, userId]);
            if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
                throw new apiHandlers_1.ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
            }
            // Verificar se a subtarefa existe
            const subtaskCheck = yield database_1.default.query('SELECT subtask_id FROM subtasks WHERE subtask_id = $1 AND task_id = $2', [subtaskId, taskId]);
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
                const current = yield this.getSubtaskById(subtaskId, taskId, userId);
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
            const result = yield database_1.default.query(query, queryParams);
            return result.rowCount && result.rowCount > 0 ? result.rows[0] : null;
        });
    }
    // Excluir uma subtarefa
    deleteSubtask(subtaskId, taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se a tarefa existe e pertence ao usuário
            const taskCheck = yield database_1.default.query('SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2', [taskId, userId]);
            if (!taskCheck.rowCount || taskCheck.rowCount === 0) {
                throw new apiHandlers_1.ApiException('Tarefa não encontrada ou não pertence ao usuário', 404);
            }
            // Excluir a subtarefa
            const result = yield database_1.default.query('DELETE FROM subtasks WHERE subtask_id = $1 AND task_id = $2 RETURNING subtask_id', [subtaskId, taskId]);
            return result.rowCount ? result.rowCount > 0 : false;
        });
    }
}
exports.default = new SubtaskService();
