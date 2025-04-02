-- 00_run_all.sql
-- Script principal para executar todas as migrações em ordem

-- Começar uma transação para garantir atomicidade
BEGIN;

-- Registrar início da execução
DO $$
BEGIN
    RAISE NOTICE 'Iniciando migração do banco de dados para todo-app...';
END $$;

-- 1. Inicialização do esquema
DO $$
BEGIN
    RAISE NOTICE 'Executando 01_init_schema.sql...';
END $$;

\i 01_init_schema.sql

-- 2. Criação de tabelas de tarefas e subtarefas
DO $$
BEGIN
    RAISE NOTICE 'Executando 02_tasks_subtasks.sql...';
END $$;

\i 02_tasks_subtasks.sql

-- 3. Criação de tabelas de projetos e kanban
DO $$
BEGIN
    RAISE NOTICE 'Executando 03_projects_kanban.sql...';
END $$;

\i 03_projects_kanban.sql

-- 4. Criação de views
DO $$
BEGIN
    RAISE NOTICE 'Executando 04_views.sql...';
END $$;

\i 04_views.sql

-- 5. Criação de funções e procedimentos
DO $$
BEGIN
    RAISE NOTICE 'Executando 05_functions.sql...';
END $$;

\i 05_functions.sql

-- 6. Otimizações e índices adicionais
DO $$
BEGIN
    RAISE NOTICE 'Executando 06_indexes_constraints.sql...';
END $$;

\i 06_indexes_constraints.sql

-- Commit da transação principal
COMMIT;

-- Notificação de conclusão
DO $$
BEGIN
    RAISE NOTICE 'Migração concluída com sucesso!';
END $$;

-- Perguntar se deseja inserir dados de exemplo
DO $$
BEGIN
    RAISE NOTICE 'Deseja inserir dados de exemplo? (Execute manualmente 07_sample_data.sql para inserir dados de teste)';
END $$;

-- Comentário sobre como executar os dados de exemplo separadamente:
/*
  Para inserir dados de exemplo, execute:
  \i 07_sample_data.sql
*/

-- Exibir instruções pós-migração
DO $$
BEGIN
    RAISE NOTICE 'Instruções de uso:';
    RAISE NOTICE '1. Conecte-se à aplicação usando e-mail: usuario@exemplo.com e senha: senha123 (após inserir dados de exemplo)';
    RAISE NOTICE '2. Para visualizar todas as tarefas: SELECT * FROM vw_tasks_details;';
    RAISE NOTICE '3. Para verificar estatísticas: SELECT * FROM vw_user_task_stats;';
    RAISE NOTICE '4. Para visualizar métricas de tempo: SELECT * FROM vw_task_time_metrics;';
END $$; 