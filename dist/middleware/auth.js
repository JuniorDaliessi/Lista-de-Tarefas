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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
// Middleware para verificar se o usuário está autenticado
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        // Verificar se o usuário existe no banco
        const result = yield database_1.default.query('SELECT user_id, email FROM users WHERE user_id = $1', [decoded.id]);
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
    }
    catch (error) {
        console.error('Erro de autenticação:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido.'
            });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
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
});
exports.authenticate = authenticate;
