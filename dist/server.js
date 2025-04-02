"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Porta do servidor
const PORT = process.env.PORT || 5000;
// Iniciar o servidor
const server = App_1.default.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});
// Tratamento de erros e encerramento adequado
process.on('unhandledRejection', (err) => {
    console.error('ERRO NÃO TRATADO! 💥 Encerrando...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    console.log('SIGTERM recebido. Encerrando graciosamente 👋');
    server.close(() => {
        console.log('Processo encerrado!');
    });
});
