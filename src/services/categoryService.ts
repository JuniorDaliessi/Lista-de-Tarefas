import pool from '../config/database';

// Interface para representar uma categoria
export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  icon: string | null;
  created_at: Date;
  updated_at: Date;
}

// Interface para criação de categoria
export interface CategoryCreation {
  name: string;
  color?: string;
  icon?: string;
}

// Interface para atualização de categoria
export interface CategoryUpdate {
  name?: string;
  color?: string;
  icon?: string;
}

// Classe de serviço de categorias
class CategoryService {
  // Obter todas as categorias de um usuário
  async getAllCategories(userId: string): Promise<Category[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }
  
  // Obter categoria por ID
  async getCategoryById(categoryId: string, userId: string): Promise<Category> {
    try {
      const result = await pool.query(
        'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
        [categoryId, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Categoria não encontrada');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      throw error;
    }
  }
  
  // Criar uma nova categoria
  async createCategory(userId: string, categoryData: CategoryCreation): Promise<Category> {
    try {
      // Verificar se já existe uma categoria com o mesmo nome para o usuário
      const existingCategory = await pool.query(
        'SELECT * FROM categories WHERE user_id = $1 AND name = $2',
        [userId, categoryData.name]
      );
      
      if (existingCategory.rows.length > 0) {
        throw new Error('Já existe uma categoria com este nome');
      }
      
      const result = await pool.query(
        `INSERT INTO categories (user_id, name, color, icon)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
          userId,
          categoryData.name,
          categoryData.color || null,
          categoryData.icon || null
        ]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }
  
  // Atualizar categoria
  async updateCategory(
    categoryId: string, 
    userId: string, 
    categoryData: CategoryUpdate
  ): Promise<Category> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se a categoria existe e pertence ao usuário
      const existingCategory = await client.query(
        'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
        [categoryId, userId]
      );
      
      if (existingCategory.rows.length === 0) {
        throw new Error('Categoria não encontrada');
      }
      
      // Verificar se já existe outra categoria com o mesmo nome
      if (categoryData.name) {
        const duplicateCheck = await client.query(
          'SELECT * FROM categories WHERE user_id = $1 AND name = $2 AND id != $3',
          [userId, categoryData.name, categoryId]
        );
        
        if (duplicateCheck.rows.length > 0) {
          throw new Error('Já existe outra categoria com este nome');
        }
      }
      
      // Construir query dinamicamente com base nos campos fornecidos
      let query = 'UPDATE categories SET updated_at = NOW()';
      const values: any[] = [];
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
      
      const result = await client.query(query, values);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Excluir categoria
  async deleteCategory(categoryId: string, userId: string): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se a categoria existe e pertence ao usuário
      const existingCategory = await client.query(
        'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
        [categoryId, userId]
      );
      
      if (existingCategory.rows.length === 0) {
        throw new Error('Categoria não encontrada');
      }
      
      // Remover a referência a esta categoria de todas as tarefas
      await client.query(
        'UPDATE tasks SET category_id = NULL WHERE category_id = $1',
        [categoryId]
      );
      
      // Excluir a categoria
      await client.query(
        'DELETE FROM categories WHERE id = $1 AND user_id = $2',
        [categoryId, userId]
      );
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao excluir categoria:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Obter tarefas por categoria
  async getTasksByCategory(categoryId: string, userId: string): Promise<any[]> {
    try {
      // Verificar se a categoria existe e pertence ao usuário
      const existingCategory = await pool.query(
        'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
        [categoryId, userId]
      );
      
      if (existingCategory.rows.length === 0) {
        throw new Error('Categoria não encontrada');
      }
      
      // Buscar tarefas desta categoria
      const result = await pool.query(
        'SELECT * FROM tasks WHERE category_id = $1 AND user_id = $2 ORDER BY created_at DESC',
        [categoryId, userId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar tarefas por categoria:', error);
      throw error;
    }
  }
  
  // Obter estatísticas de categorias
  async getCategoryStats(userId: string): Promise<any[]> {
    try {
      const result = await pool.query(
        `SELECT 
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
          c.name ASC`,
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de categorias:', error);
      throw error;
    }
  }
}

export default new CategoryService(); 