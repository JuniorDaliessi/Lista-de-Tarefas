-- 03_projects_kanban.sql
-- Criação das tabelas de projetos e colunas kanban

-- Tabela de projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Cada usuário pode ter apenas um projeto com o mesmo nome
    UNIQUE (user_id, name)
);

-- Tabela de colunas Kanban
CREATE TABLE kanban_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    order_position INTEGER NOT NULL,
    wip_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Cada projeto pode ter apenas uma coluna com a mesma posição de ordem
    UNIQUE (project_id, order_position)
);

-- Tabela de métricas de tarefas para análise de fluxo no Kanban
CREATE TABLE task_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    column_id UUID NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
    entered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    
    -- Cada tarefa pode ter apenas uma entrada ativa (sem left_at) por coluna
    CONSTRAINT unique_active_column_entry UNIQUE (task_id, column_id)
);

-- Criar índices para melhorar performance de consultas
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_kanban_columns_project_id ON kanban_columns(project_id);
CREATE INDEX idx_task_metrics_task_id ON task_metrics(task_id);
CREATE INDEX idx_task_metrics_column_id ON task_metrics(column_id);

-- Criar triggers para atualizar o timestamp automaticamente
CREATE TRIGGER update_projects_modtime
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kanban_columns_modtime
    BEFORE UPDATE ON kanban_columns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar as métricas de tarefas quando uma tarefa muda de coluna
CREATE OR REPLACE FUNCTION update_task_metrics()
RETURNS TRIGGER AS $$
DECLARE
    previous_column_id UUID;
BEGIN
    -- Se a coluna foi alterada
    IF NEW.column_id IS DISTINCT FROM OLD.column_id THEN
        -- Fechar a entrada na coluna anterior (se existir)
        IF OLD.column_id IS NOT NULL THEN
            UPDATE task_metrics
            SET left_at = NOW()
            WHERE task_id = NEW.id 
              AND column_id = (
                SELECT id FROM kanban_columns 
                WHERE project_id = NEW.project_id 
                  AND title = OLD.column_id
              )
              AND left_at IS NULL;
        END IF;
        
        -- Criar uma nova entrada para a nova coluna
        IF NEW.column_id IS NOT NULL THEN
            INSERT INTO task_metrics (task_id, column_id, entered_at)
            VALUES (
                NEW.id, 
                (SELECT id FROM kanban_columns 
                 WHERE project_id = NEW.project_id 
                   AND title = NEW.column_id),
                NOW()
            );
            
            -- Se a tarefa foi movida para coluna de "em andamento", atualizar started_at
            IF NEW.column_id = 'in-progress' AND NEW.started_at IS NULL THEN
                NEW.started_at = NOW();
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar métricas quando uma tarefa muda de coluna
CREATE TRIGGER update_task_column_metrics
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    WHEN (NEW.column_id IS DISTINCT FROM OLD.column_id)
    EXECUTE FUNCTION update_task_metrics(); 