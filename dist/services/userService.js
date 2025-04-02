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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiHandlers_1 = require("../utils/apiHandlers");
// Classe de serviço de usuários
class UserService {
    // Registrar um novo usuário
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar se o email já está em uso
                const existingUser = yield database_1.default.query('SELECT * FROM users WHERE email = $1', [userData.email]);
                if (existingUser.rows.length > 0) {
                    throw new Error('Email já cadastrado');
                }
                // Utilizar a função register_user do banco de dados
                const result = yield database_1.default.query('SELECT * FROM register_user($1, $2, $3)', [userData.email, userData.password, userData.name]);
                // Buscar o usuário recém-criado
                const userResult = yield database_1.default.query('SELECT * FROM users WHERE id = $1', [result.rows[0].register_user]);
                return userResult.rows[0];
            }
            catch (error) {
                console.error('Erro ao registrar usuário:', error);
                throw error;
            }
        });
    }
    // Login de usuário
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se o usuário existe
            const userResult = yield database_1.default.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
            if (userResult.rows.length === 0) {
                throw new apiHandlers_1.ApiException('Email ou senha incorretos', 401);
            }
            const user = userResult.rows[0];
            // Verificar a senha
            const isValidPassword = yield bcrypt_1.default.compare(credentials.password, user.password);
            if (!isValidPassword) {
                throw new apiHandlers_1.ApiException('Email ou senha incorretos', 401);
            }
            // Gerar token JWT
            const token = jsonwebtoken_1.default.sign({ id: user.user_id, email: credentials.email }, process.env.JWT_SECRET || 'secret');
            // Retornar o token e dados do usuário (exceto a senha)
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return {
                token,
                user: userWithoutPassword
            };
        });
    }
    // Obter usuário por ID
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT * FROM users WHERE id = $1', [userId]);
                if (result.rows.length === 0) {
                    throw new Error('Usuário não encontrado');
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao buscar usuário:', error);
                throw error;
            }
        });
    }
    // Atualizar usuário
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Construir query dinamicamente com base nos campos fornecidos
                let query = 'UPDATE users SET updated_at = NOW()';
                const values = [];
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
                const result = yield database_1.default.query(query, values);
                if (result.rows.length === 0) {
                    throw new Error('Usuário não encontrado');
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                throw error;
            }
        });
    }
    // Alterar senha
    changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar senha atual
                const user = yield database_1.default.query('SELECT * FROM users WHERE id = $1', [userId]);
                if (user.rows.length === 0) {
                    throw new Error('Usuário não encontrado');
                }
                // Verificar se senha antiga está correta
                const isValid = yield bcrypt_1.default.compare(oldPassword, user.rows[0].password_hash);
                if (!isValid) {
                    throw new Error('Senha atual incorreta');
                }
                // Atualizar senha
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
                yield database_1.default.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, userId]);
                return true;
            }
            catch (error) {
                console.error('Erro ao alterar senha:', error);
                throw error;
            }
        });
    }
    // Excluir conta de usuário
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // O ON DELETE CASCADE nas relações do banco cuidará de remover todos os dados relacionados
                yield database_1.default.query('DELETE FROM users WHERE id = $1', [userId]);
                return true;
            }
            catch (error) {
                console.error('Erro ao excluir usuário:', error);
                throw error;
            }
        });
    }
    // Verificar se o email está disponível
    isEmailAvailable(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
                return result.rows.length === 0;
            }
            catch (error) {
                console.error('Erro ao verificar disponibilidade de email:', error);
                throw error;
            }
        });
    }
}
exports.default = new UserService();
