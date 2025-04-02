-- 02_create_tables.sql
-- Criação das tabelas para projetos, tarefas e subtarefas

-- Criação da tabela de projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Um projeto com o mesmo nome não pode ser repetido para o mesmo usuário
    UNIQUE (user_id, name)
);

-- Criação de índices para melhorar performance de consultas em projetos
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Criação da tabela de colunas Kanban
CREATE TABLE kanban_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Uma coluna com o mesmo nome não pode ser repetida no mesmo projeto
    UNIQUE (project_id, name)
);

-- Criação de índices para colunas kanban
CREATE INDEX idx_kanban_columns_project_id ON kanban_columns(project_id);

-- Criação da tabela de tarefas
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    date DATE,
    priority VARCHAR(20) DEFAULT 'normal', -- baixa, normal, alta, urgente
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    column_id UUID REFERENCES kanban_columns(id) ON DELETE SET NULL,
    column_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Criação de índices para tarefas
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Criação da tabela de subtarefas
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Criação de índices para subtarefas
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_completed ON subtasks(completed);

-- Criar triggers para atualizar o timestamp automaticamente
CREATE TRIGGER update_projects_modtime
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kanban_columns_modtime
    BEFORE UPDATE ON kanban_columns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_modtime
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtasks_modtime
    BEFORE UPDATE ON subtasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar completed_at quando uma tarefa for marcada como concluída
CREATE OR REPLACE FUNCTION update_completed_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = true AND OLD.completed = false THEN
        NEW.completed_at = NOW();
    ELSIF NEW.completed = false AND OLD.completed = true THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_completed_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    WHEN (NEW.completed IS DISTINCT FROM OLD.completed)
    EXECUTE FUNCTION update_completed_at_column();

CREATE TRIGGER update_subtasks_completed_at
    BEFORE UPDATE ON subtasks
    FOR EACH ROW
    WHEN (NEW.completed IS DISTINCT FROM OLD.completed)
    EXECUTE FUNCTION update_completed_at_column(); 