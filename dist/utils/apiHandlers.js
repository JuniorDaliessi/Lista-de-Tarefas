"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.sendError = exports.sendSuccess = exports.errorHandler = exports.ApiException = exports.asyncHandler = void 0;
// Decorator para tratar erros assíncronos em controllers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
// Classe de erro customizada para API
class ApiException extends Error {
    constructor(message, statusCode = 500, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ApiException';
    }
}
exports.ApiException = ApiException;
// Middleware para tratamento global de erros
const errorHandler = (err, req, res, next) => {
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
exports.errorHandler = errorHandler;
// Função para enviar resposta de sucesso
const sendSuccess = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        data
    });
};
exports.sendSuccess = sendSuccess;
// Função para enviar resposta de erro
const sendError = (res, message, statusCode = 400, details) => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        details
    });
};
exports.sendError = sendError;
// Função para validação básica de parâmetros
const validateParams = (req, requiredParams, source = 'body') => {
    const missingParams = [];
    for (const param of requiredParams) {
        if (!req[source] || req[source][param] === undefined) {
            missingParams.push(param);
        }
    }
    return missingParams;
};
exports.validateParams = validateParams;
