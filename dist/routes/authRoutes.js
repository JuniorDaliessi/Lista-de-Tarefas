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
const express_1 = require("express");
const apiHandlers_1 = require("../utils/apiHandlers");
const userService_1 = __importDefault(require("../services/userService"));
const router = (0, express_1.Router)();
// Registro de usuário
router.post('/register', (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            status: 'error',
            message: 'Todos os campos são obrigatórios'
        });
    }
    const user = yield userService_1.default.register({ email, password, name });
    return res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: user.user_id,
                email: user.email,
                name: user.name
            }
        }
    });
})));
// Login de usuário
router.post('/login', (0, apiHandlers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Email e senha são obrigatórios'
        });
    }
    const { token, user } = yield userService_1.default.login({ email, password });
    return res.status(200).json({
        status: 'success',
        data: {
            token,
            user: {
                id: user.user_id,
                email: user.email,
                name: user.name
            }
        }
    });
})));
exports.default = router;
