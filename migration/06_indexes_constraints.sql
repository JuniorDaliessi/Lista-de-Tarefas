-- 06_indexes_constraints.sql
-- Índices adicionais, restrições e otimizações

-- Extensão necessária para índices de trigramas
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índices para pesquisa e filtragem de tarefas
CREATE INDEX idx_tasks_title_trigram ON tasks USING gin (title gin_trgm_ops);
CREATE INDEX idx_tasks_description_trigram ON tasks USING gin (description gin_trgm_ops);

-- Índices compostos para consultas comuns
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
CREATE INDEX idx_tasks_user_category ON tasks(user_id, category_id);
CREATE INDEX idx_tasks_user_due_date ON tasks(user_id, due_date);
CREATE INDEX idx_tasks_user_priority ON tasks(user_id, priority);
CREATE INDEX idx_tasks_project_column ON tasks(project_id, column_id);

-- Índice para busca de tarefas por termo de pesquisa (título e descrição)
CREATE INDEX idx_tasks_search ON tasks USING gin(
  to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- Melhorar performance de JOIN frequentes
CREATE INDEX idx_subtasks_task_completed ON subtasks(task_id, completed);

-- Restrições adicionais
ALTER TABLE tasks ADD CONSTRAINT chk_due_date_valid 
  CHECK (due_date IS NULL OR due_date > '2000-01-01'::timestamp with time zone);

ALTER TABLE tasks ADD CONSTRAINT chk_order_positive
  CHECK (column_order IS NULL OR column_order >= 0);

-- Função e trigger para manter a ordem das tarefas em uma coluna kanban consistente
CREATE OR REPLACE FUNCTION maintain_task_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Se uma tarefa for removida, reordenar as tarefas seguintes
    IF TG_OP = 'DELETE' THEN
        UPDATE tasks
        SET column_order = column_order - 1
        WHERE project_id = OLD.project_id
          AND column_id = OLD.column_id
          AND column_order > OLD.column_order;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_maintain_task_order
AFTER DELETE ON tasks
FOR EACH ROW
WHEN (OLD.column_id IS NOT NULL AND OLD.project_id IS NOT NULL)
EXECUTE FUNCTION maintain_task_order();

-- Função para notificar sobre tarefas atrasadas (demonstração de uso com notificações)
CREATE OR REPLACE FUNCTION check_overdue_tasks()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.due_date < CURRENT_DATE AND NEW.completed = FALSE THEN
        -- Aqui poderíamos integrar com um sistema de notificações
        -- Por enquanto, apenas registramos em uma tabela de log
        
        -- Esta tabela seria criada separadamente:
        -- CREATE TABLE task_notifications (
        --     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        --     task_id UUID NOT NULL REFERENCES tasks(id),
        --     user_id UUID NOT NULL REFERENCES users(id),
        --     type VARCHAR(50) NOT NULL,
        --     message TEXT NOT NULL,
        --     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        --     read BOOLEAN NOT NULL DEFAULT FALSE
        -- );
        
        -- INSERT INTO task_notifications (task_id, user_id, type, message)
        -- VALUES (
        --     NEW.id,
        --     NEW.user_id,
        --     'overdue',
        --     'A tarefa "' || NEW.title || '" está atrasada!'
        -- );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comentar este trigger por enquanto, já que depende de uma tabela não criada
-- CREATE TRIGGER trg_check_overdue_tasks
--     AFTER INSERT OR UPDATE OF due_date, completed ON tasks
--     FOR EACH ROW
--     EXECUTE FUNCTION check_overdue_tasks();

-- Definir uma otimização de particionamento (exemplo para um sistema de produção com muitas tarefas)
-- Esta é apenas uma demonstração, não executada por padrão

-- Para banco de dados muito grandes podemos particionar a tabela de tarefas por mês
-- CREATE TABLE tasks_partitioned (
--     id UUID NOT NULL,
--     user_id UUID NOT NULL,
--     title VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE NOT NULL,
--     -- ... outros campos
--     PRIMARY KEY (id, created_at)
-- ) PARTITION BY RANGE (created_at);
-- 
-- -- Criar uma partição para cada mês
-- CREATE TABLE tasks_y2023m01 PARTITION OF tasks_partitioned
--     FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');
-- 
-- CREATE TABLE tasks_y2023m02 PARTITION OF tasks_partitioned
--     FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');
-- 
-- -- ... e assim por diante

-- Comentário Final:
-- Este script inclui otimizações que podem ser aplicadas quando o banco de dados crescer.
-- Algumas são comentadas pois dependem de configurações específicas ou de outras tabelas.
-- Ajuste conforme a necessidade do seu ambiente de produção.