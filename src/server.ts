import app from './App';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});

// Tratamento de erros e encerramento adequado
process.on('unhandledRejection', (err: Error) => {
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