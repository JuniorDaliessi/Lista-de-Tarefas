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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../config/database"));
/**
 * Executa as migrações do banco de dados
 */
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Iniciando migrações do banco de dados...');
            const migrationsDir = path_1.default.join(__dirname, '../../migration');
            // Verificar se o diretório de migrações existe
            if (!fs_1.default.existsSync(migrationsDir)) {
                throw new Error(`Diretório de migrações não encontrado: ${migrationsDir}`);
            }
            // Obter todos os arquivos SQL na pasta de migrações e ordená-los
            // Ignorando o arquivo 00_run_all.sql que contém referências de caminho que causam erro
            const migrationFiles = fs_1.default.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.sql') && file !== '00_run_all.sql')
                .sort();
            if (migrationFiles.length === 0) {
                throw new Error('Nenhum arquivo de migração encontrado');
            }
            console.log(`Encontrados ${migrationFiles.length} arquivos de migração`);
            // Criar tabela de registro de migrações se não existir
            yield database_1.default.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
            // Obter migrações já aplicadas
            const result = yield database_1.default.query('SELECT name FROM migrations');
            const appliedMigrations = result.rows.map(row => row.name);
            // Iniciar uma transação
            const client = yield database_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Executar cada migração não aplicada
                for (const migrationFile of migrationFiles) {
                    if (appliedMigrations.includes(migrationFile)) {
                        console.log(`Migração ${migrationFile} já aplicada. Pulando...`);
                        continue;
                    }
                    console.log(`Aplicando migração: ${migrationFile}...`);
                    const filePath = path_1.default.join(migrationsDir, migrationFile);
                    const sql = fs_1.default.readFileSync(filePath, 'utf-8');
                    // Executar os comandos SQL
                    yield client.query(sql);
                    // Registrar a migração como aplicada
                    yield client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
                    console.log(`Migração ${migrationFile} aplicada com sucesso!`);
                }
                // Commit da transação
                yield client.query('COMMIT');
                console.log('Todas as migrações foram aplicadas com sucesso!');
            }
            catch (error) {
                // Rollback em caso de erro
                yield client.query('ROLLBACK');
                console.error('Erro ao aplicar migrações. Rollback executado.', error);
                throw error;
            }
            finally {
                // Liberar o cliente
                client.release();
            }
        }
        catch (error) {
            console.error('Erro ao executar migrações:', error);
            process.exit(1);
        }
    });
}
// Executar migrações diretamente se este arquivo for executado
if (require.main === module) {
    runMigrations()
        .then(() => {
        console.log('Processo de migração finalizado');
        process.exit(0);
    })
        .catch(error => {
        console.error('Erro fatal durante as migrações:', error);
        process.exit(1);
    });
}
exports.default = runMigrations;
