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
// Classe de serviço de categorias
class CategoryService {
    // Obter todas as categorias de um usuário
    getAllCategories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC', [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar categorias:', error);
                throw error;
            }
        });
    }
    // Obter categoria por ID
    getCategoryById(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
                if (result.rows.length === 0) {
                    throw new Error('Categoria não encontrada');
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao buscar categoria:', error);
                throw error;
            }
        });
    }
    // Criar uma nova categoria
    createCategory(userId, categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se já existe uma categoria com o mesmo nome para o usuário
                const existingCategory = yield database_1.default.query('SELECT * FROM categories WHERE user_id = $1 AND name = $2', [userId, categoryData.name]);
                if (existingCategory.rows.length > 0) {
                    throw new Error('Já existe uma categoria com este nome');
                }
                const result = yield database_1.default.query(`INSERT INTO categories (user_id, name, color, icon)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, [
                    userId,
                    categoryData.name,
                    categoryData.color || null,
                    categoryData.icon || null
                ]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao criar categoria:', error);
                throw error;
            }
        });
    }
    // Atualizar categoria
    updateCategory(categoryId, userId, categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se a categoria existe e pertence ao usuário
                const existingCategory = yield client.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
                if (existingCategory.rows.length === 0) {
                    throw new Error('Categoria não encontrada');
                }
                // Verificar se já existe outra categoria com o mesmo nome
                if (categoryData.name) {
                    const duplicateCheck = yield client.query('SELECT * FROM categories WHERE user_id = $1 AND name = $2 AND id != $3', [userId, categoryData.name, categoryId]);
                    if (duplicateCheck.rows.length > 0) {
                        throw new Error('Já existe outra categoria com este nome');
                    }
                }
                // Construir query dinamicamente com base nos campos fornecidos
                let query = 'UPDATE categories SET updated_at = NOW()';
                const values = [];
                let paramCounter = 1;
                if (categoryData.name !== undefined) {
                    query += `, name = $${paramCounter}`;
                    values.push(categoryData.name);
                    paramCounter++;
                }
                if (categoryData.color !== undefined) {
                    query += `, color = $${paramCounter}`;
                    values.push(categoryData.color);
                    paramCounter++;
                }
                if (categoryData.icon !== undefined) {
                    query += `, icon = $${paramCounter}`;
                    values.push(categoryData.icon);
                    paramCounter++;
                }
                query += ` WHERE id = $${paramCounter} AND user_id = $${paramCounter + 1} RETURNING *`;
                values.push(categoryId, userId);
                const result = yield client.query(query, values);
                yield client.query('COMMIT');
                return result.rows[0];
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao atualizar categoria:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Excluir categoria
    deleteCategory(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Verificar se a categoria existe e pertence ao usuário
                const existingCategory = yield client.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
                if (existingCategory.rows.length === 0) {
                    throw new Error('Categoria não encontrada');
                }
                // Remover a referência a esta categoria de todas as tarefas
                yield client.query('UPDATE tasks SET category_id = NULL WHERE category_id = $1', [categoryId]);
                // Excluir a categoria
                yield client.query('DELETE FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
                yield client.query('COMMIT');
                return true;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Erro ao excluir categoria:', error);
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    // Obter tarefas por categoria
    getTasksByCategory(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se a categoria existe e pertence ao usuário
                const existingCategory = yield database_1.default.query('SELECT * FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
                if (existingCategory.rows.length === 0) {
                    throw new Error('Categoria não encontrada');
                }
                // Buscar tarefas desta categoria
                const result = yield database_1.default.query('SELECT * FROM tasks WHERE category_id = $1 AND user_id = $2 ORDER BY created_at DESC', [categoryId, userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar tarefas por categoria:', error);
                throw error;
            }
        });
    }
    // Obter estatísticas de categorias
    getCategoryStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query(`SELECT 
          c.id,
          c.name,
          c.color,
          c.icon,
          COUNT(t.id) AS total_tasks,
          SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END) AS completed_tasks,
          SUM(CASE WHEN t.completed = false THEN 1 ELSE 0 END) AS pending_tasks
        FROM 
          categories c
        LEFT JOIN 
          tasks t ON c.id = t.category_id
        WHERE 
          c.user_id = $1
        GROUP BY 
          c.id, c.name
        ORDER BY 
          c.name ASC`, [userId]);
                return result.rows;
            }
            catch (error) {
                console.error('Erro ao buscar estatísticas de categorias:', error);
                throw error;
            }
        });
    }
}
exports.default = new CategoryService();
