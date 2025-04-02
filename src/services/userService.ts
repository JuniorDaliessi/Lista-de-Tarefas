import pool from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiException } from '../utils/apiHandlers';

// Interface para representar um usuário
export interface User {
  user_id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para resposta de usuário (sem senha)
export interface UserResponse {
  user_id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para o registro de usuário
export interface UserRegistration {
  email: string;
  password: string;
  name: string;
}

// Interface para login
export interface UserLogin {
  email: string;
  password: string;
}

// Interface para atualização de usuário
export interface UserUpdate {
  name?: string;
  theme?: string;
  preferences?: any;
}

// Classe de serviço de usuários
class UserService {
  // Registrar um novo usuário
  async register(userData: UserRegistration): Promise<User> {
    try {
      // Verificar se o email já está em uso
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [userData.email]);
      
      if (existingUser.rows.length > 0) {
        throw new Error('Email já cadastrado');
      }
      
      // Utilizar a função register_user do banco de dados
      const result = await pool.query(
        'SELECT * FROM register_user($1, $2, $3)',
        [userData.email, userData.password, userData.name]
      );
      
      // Buscar o usuário recém-criado
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [result.rows[0].register_user]);
      
      return userResult.rows[0];
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }
  
  // Login de usuário
  async login(credentials: UserLogin): Promise<{ token: string; user: UserResponse }> {
    // Verificar se o usuário existe
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [credentials.email]
    );

    if (userResult.rows.length === 0) {
      throw new ApiException('Email ou senha incorretos', 401);
    }

    const user = userResult.rows[0];

    // Verificar a senha
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValidPassword) {
      throw new ApiException('Email ou senha incorretos', 401);
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.user_id, email: credentials.email },
      process.env.JWT_SECRET || 'secret'
    );

    // Retornar o token e dados do usuário (exceto a senha)
    const { password, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  }
  
  // Obter usuário por ID
  async getUserById(userId: string): Promise<User> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }
  
  // Atualizar usuário
  async updateUser(userId: string, userData: UserUpdate): Promise<User> {
    try {
      // Construir query dinamicamente com base nos campos fornecidos
      let query = 'UPDATE users SET updated_at = NOW()';
      const values: any[] = [];
      let paramCounter = 1;
      
      if (userData.name) {
        query += `, name = $${paramCounter}`;
        values.push(userData.name);
        paramCounter++;
      }
      
      if (userData.theme) {
        query += `, theme = $${paramCounter}`;
        values.push(userData.theme);
        paramCounter++;
      }
      
      if (userData.preferences) {
        query += `, preferences = $${paramCounter}`;
        values.push(JSON.stringify(userData.preferences));
        paramCounter++;
      }
      
      query += ` WHERE id = $${paramCounter} RETURNING *`;
      values.push(userId);
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }
  
  // Alterar senha
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Verificar senha atual
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      
      if (user.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      // Verificar se senha antiga está correta
      const isValid = await bcrypt.compare(oldPassword, user.rows[0].password_hash);
      
      if (!isValid) {
        throw new Error('Senha atual incorreta');
      }
      
      // Atualizar senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await pool.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, userId]
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  }
  
  // Excluir conta de usuário
  async deleteUser(userId: string): Promise<boolean> {
    try {
      // O ON DELETE CASCADE nas relações do banco cuidará de remover todos os dados relacionados
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  }
  
  // Verificar se o email está disponível
  async isEmailAvailable(email: string): Promise<boolean> {
    try {
      const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      return result.rows.length === 0;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade de email:', error);
      throw error;
    }
  }
}

export default new UserService(); 