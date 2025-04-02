import { Request, Response, NextFunction } from 'express';

// Tipos para as respostas da API
export interface ApiSuccess<T> {
  status: 'success';
  data: T;
}

export interface ApiError {
  status: 'error';
  message: string;
  details?: any;
}

// Tipos de respostas genéricas da API
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Tipo para função de handler de controlador que retorna Promise
export type AsyncHandler = (
  req: any,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Decorator para tratar erros assíncronos em controllers
export const asyncHandler = (fn: AsyncHandler) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Classe de erro customizada para API
export class ApiException extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiException';
  }
}

// Middleware para tratamento global de erros
export const errorHandler = (
  err: Error | ApiException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erro na API:', err);

  // Verificar se é um erro de API
  if (err instanceof ApiException) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details
    });
  }

  // Erro genérico do servidor
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Função para enviar resposta de sucesso
export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): Response => {
  return res.status(statusCode).json({
    status: 'success',
    data
  });
};

// Função para enviar resposta de erro
export const sendError = (
  res: Response, 
  message: string, 
  statusCode = 400, 
  details?: any
): Response => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    details
  });
};

// Função para validação básica de parâmetros
export const validateParams = (
  req: Request, 
  requiredParams: string[],
  source: 'body' | 'query' | 'params' = 'body'
): string[] => {
  const missingParams: string[] = [];
  
  for (const param of requiredParams) {
    if (!(req as any)[source] || (req as any)[source][param] === undefined) {
      missingParams.push(param);
    }
  }
  
  return missingParams;
}; 