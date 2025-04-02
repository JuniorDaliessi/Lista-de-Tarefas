import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Middleware para verificar se o usuário está autenticado
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Acesso não autorizado. Token não fornecido.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar o token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret'
    ) as DecodedToken;

    // Verificar se o usuário existe no banco
    const result = await pool.query(
      'SELECT user_id, email FROM users WHERE user_id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não encontrado.'
      });
    }

    // Adicionar informações do usuário à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido.'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expirado.'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Erro ao autenticar usuário.'
    });
  }
}; 