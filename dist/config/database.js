"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Configuração do pool de conexões baseada nas variáveis de ambiente
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todo_app',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    // Máximo de conexões no pool
    max: 20,
    // Tempo de inatividade em milissegundos antes de uma conexão ser encerrada
    idleTimeoutMillis: 30000,
    // Tempo máximo de espera por uma conexão livre em milissegundos
    connectionTimeoutMillis: 2000,
});
// Eventos para monitoramento do pool de conexões
pool.on('connect', () => {
    console.log('Conexão com banco de dados estabelecida');
});
pool.on('error', (err) => {
    console.error('Erro de conexão com banco de dados:', err.message);
});
exports.default = pool;
