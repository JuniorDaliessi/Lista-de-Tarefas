import fs from 'fs';
import path from 'path';
import pool from '../config/database';

/**
 * Executa as migrações do banco de dados
 */
async function runMigrations() {
  try {
    console.log('Iniciando migrações do banco de dados...');
    const migrationsDir = path.join(__dirname, '../../migration');
    
    // Verificar se o diretório de migrações existe
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Diretório de migrações não encontrado: ${migrationsDir}`);
    }

    // Obter todos os arquivos SQL na pasta de migrações e ordená-los
    // Ignorando o arquivo 00_run_all.sql que contém referências de caminho que causam erro
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && file !== '00_run_all.sql')
      .sort();
    
    if (migrationFiles.length === 0) {
      throw new Error('Nenhum arquivo de migração encontrado');
    }

    console.log(`Encontrados ${migrationFiles.length} arquivos de migração`);

    // Criar tabela de registro de migrações se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Obter migrações já aplicadas
    const result = await pool.query('SELECT name FROM migrations');
    const appliedMigrations = result.rows.map(row => row.name);

    // Iniciar uma transação
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Executar cada migração não aplicada
      for (const migrationFile of migrationFiles) {
        if (appliedMigrations.includes(migrationFile)) {
          console.log(`Migração ${migrationFile} já aplicada. Pulando...`);
          continue;
        }

        console.log(`Aplicando migração: ${migrationFile}...`);
        const filePath = path.join(migrationsDir, migrationFile);
        const sql = fs.readFileSync(filePath, 'utf-8');

        // Executar os comandos SQL
        await client.query(sql);

        // Registrar a migração como aplicada
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migrationFile]
        );

        console.log(`Migração ${migrationFile} aplicada com sucesso!`);
      }

      // Commit da transação
      await client.query('COMMIT');
      console.log('Todas as migrações foram aplicadas com sucesso!');
    } catch (error) {
      // Rollback em caso de erro
      await client.query('ROLLBACK');
      console.error('Erro ao aplicar migrações. Rollback executado.', error);
      throw error;
    } finally {
      // Liberar o cliente
      client.release();
    }
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
    process.exit(1);
  }
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

export default runMigrations; 