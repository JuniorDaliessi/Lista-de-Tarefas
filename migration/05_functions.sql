-- 05_functions.sql
-- Funções e stored procedures para operações comuns

-- Função para registrar um novo usuário
CREATE OR REPLACE FUNCTION register_user(
    p_email VARCHAR(255),
    p_password VARCHAR(255),
    p_name VARCHAR(100)
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Verificar se o email já existe
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        RAISE EXCEPTION 'Email já cadastrado';
    END IF;

    -- Inserir novo usuário
    INSERT INTO users (email, password_hash, name)
    VALUES (p_email, crypt(p_password, gen_salt('bf')), p_name)
    RETURNING id INTO v_user_id;
    
    -- Criar categorias padrão para o usuário
    INSERT INTO categories (user_id, name, color, icon)
    VALUES 
        (v_user_id, 'Trabalho', '#4285f4', 'briefcase'),
        (v_user_id, 'Pessoal', '#ea4335', 'user'),
        (v_user_id, 'Estudos', '#fbbc05', 'book'),
        (v_user_id, 'Saúde', '#34a853', 'heartbeat');
    
    -- Criar projeto padrão com colunas kanban
    PERFORM create_default_project(v_user_id);
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Função para autenticação de usuário
CREATE OR REPLACE FUNCTION authenticate_user(
    p_email VARCHAR(255),
    p_password VARCHAR(255)
)
RETURNS TABLE (
    user_id UUID,
    name VARCHAR(100),
    theme VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.name, u.theme
    FROM users u
    WHERE u.email = p_email
    AND u.password_hash = crypt(p_password, u.password_hash);
    
    -- Atualizar last_login se a autenticação for bem-sucedida
    IF FOUND THEN
        UPDATE users SET last_login = NOW() WHERE email = p_email;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para criar um projeto padrão com colunas kanban
CREATE OR REPLACE FUNCTION create_default_project(
    p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_project_id UUID;
BEGIN
    -- Criar projeto padrão
    INSERT INTO projects (user_id, name, description)
    VALUES (p_user_id, 'Meu Primeiro Projeto', 'Projeto padrão criado automaticamente')
    RETURNING id INTO v_project_id;
    
    -- Criar colunas padrão
    INSERT INTO kanban_columns (project_id, title, order_position, wip_limit)
    VALUES 
        (v_project_id, 'backlog', 0, NULL),
        (v_project_id, 'in-progress', 1, 5),
        (v_project_id, 'review', 2, 3),
        (v_project_id, 'done', 3, NULL);
    
    RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular métricas de tempo para uma tarefa
CREATE OR REPLACE FUNCTION calculate_task_time_metrics(
    p_task_id UUID
)
RETURNS TABLE (
    lead_time_hours NUMERIC,
    cycle_time_hours NUMERIC,
    column_times JSON
) AS $$
DECLARE
    v_lead_time NUMERIC;
    v_cycle_time NUMERIC;
    v_column_times JSON;
BEGIN
    -- Calcular lead time (tempo desde a criação até a conclusão)
    SELECT 
        CASE 
            WHEN t.completed_at IS NOT NULL THEN 
                EXTRACT(EPOCH FROM (t.completed_at - t.created_at))/3600
            ELSE 
                NULL
        END INTO v_lead_time
    FROM tasks t
    WHERE t.id = p_task_id;
    
    -- Calcular cycle time (tempo desde o início do trabalho até a conclusão)
    SELECT 
        CASE 
            WHEN t.completed_at IS NOT NULL AND t.started_at IS NOT NULL THEN 
                EXTRACT(EPOCH FROM (t.completed_at - t.started_at))/3600
            ELSE 
                NULL
        END INTO v_cycle_time
    FROM tasks t
    WHERE t.id = p_task_id;
    
    -- Calcular tempo em cada coluna
    SELECT json_object_agg(
        kc.title,
        CASE 
            WHEN tm.left_at IS NOT NULL THEN 
                ROUND(EXTRACT(EPOCH FROM (tm.left_at - tm.entered_at))/3600, 2)
            ELSE 
                ROUND(EXTRACT(EPOCH FROM (NOW() - tm.entered_at))/3600, 2)
        END
    ) INTO v_column_times
    FROM task_metrics tm
    JOIN kanban_columns kc ON tm.column_id = kc.id
    WHERE tm.task_id = p_task_id;
    
    RETURN QUERY SELECT v_lead_time, v_cycle_time, v_column_times;
END;
$$ LANGUAGE plpgsql;

-- Função para mover uma tarefa entre colunas do kanban
CREATE OR REPLACE PROCEDURE move_task_to_column(
    p_task_id UUID,
    p_column_id UUID,
    p_order INTEGER DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_project_id UUID;
    v_column_name VARCHAR(100);
    v_current_column VARCHAR(100);
    v_max_order INTEGER;
BEGIN
    -- Obter o projeto_id e nome da coluna
    SELECT kc.project_id, kc.title INTO v_project_id, v_column_name
    FROM kanban_columns kc
    WHERE kc.id = p_column_id;
    
    -- Obter a coluna atual
    SELECT t.column_id INTO v_current_column
    FROM tasks t
    WHERE t.id = p_task_id;
    
    -- Se nenhuma ordem foi especificada, colocar a tarefa no final da coluna
    IF p_order IS NULL THEN
        SELECT COALESCE(MAX(column_order), 0) + 1 INTO v_max_order
        FROM tasks
        WHERE project_id = v_project_id AND column_id = v_column_name;
    ELSE
        v_max_order := p_order;
        
        -- Reorganizar as outras tarefas na coluna
        UPDATE tasks
        SET column_order = column_order + 1
        WHERE project_id = v_project_id 
          AND column_id = v_column_name
          AND column_order >= v_max_order;
    END IF;
    
    -- Atualizar a tarefa para a nova coluna
    UPDATE tasks
    SET 
        column_id = v_column_name,
        project_id = v_project_id,
        column_order = v_max_order
    WHERE id = p_task_id;
END;
$$; 