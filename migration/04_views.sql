-- 04_views.sql
-- Criação de visualizações (views) para facilitar a análise de dados

-- View para visualizar tarefas com informações de categoria e projeto
CREATE VIEW vw_tasks_details AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.completed,
    t.due_date,
    t.priority,
    t.created_at,
    t.updated_at,
    t.started_at,
    t.completed_at,
    c.id AS category_id,
    c.name AS category_name,
    c.color AS category_color,
    p.id AS project_id,
    p.name AS project_name,
    kc.id AS column_id,
    kc.title AS column_title,
    t.column_order,
    u.id AS user_id,
    u.name AS user_name,
    (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id) AS subtasks_count,
    (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id AND st.completed = true) AS completed_subtasks_count
FROM 
    tasks t
LEFT JOIN 
    categories c ON t.category_id = c.id
LEFT JOIN 
    projects p ON t.project_id = p.id
LEFT JOIN 
    kanban_columns kc ON CAST(t.column_id AS UUID) = kc.id
LEFT JOIN 
    users u ON t.user_id = u.id;

-- View para estatísticas de tarefas por usuário
CREATE VIEW vw_user_task_stats AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    COUNT(t.id) AS total_tasks,
    SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN t.completed = false THEN 1 ELSE 0 END) AS pending_tasks,
    SUM(CASE WHEN t.due_date < CURRENT_DATE AND t.completed = false THEN 1 ELSE 0 END) AS overdue_tasks,
    SUM(CASE WHEN t.priority = 'alta' THEN 1 ELSE 0 END) AS high_priority_tasks,
    SUM(CASE WHEN t.priority = 'média' THEN 1 ELSE 0 END) AS medium_priority_tasks,
    SUM(CASE WHEN t.priority = 'baixa' THEN 1 ELSE 0 END) AS low_priority_tasks,
    COUNT(DISTINCT t.category_id) AS categories_used,
    COUNT(DISTINCT t.project_id) AS projects_used
FROM 
    users u
LEFT JOIN 
    tasks t ON u.id = t.user_id
GROUP BY 
    u.id, u.name;

-- View para análise de tempo médio por coluna (lead time e cycle time)
CREATE VIEW vw_task_time_metrics AS
SELECT 
    tm.task_id,
    t.title AS task_title,
    t.priority,
    t.category_id,
    c.name AS category_name,
    kc.project_id,
    p.name AS project_name,
    kc.title AS column_title,
    tm.entered_at,
    tm.left_at,
    CASE 
        WHEN tm.left_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (tm.left_at - tm.entered_at))/3600 -- em horas
        ELSE 
            EXTRACT(EPOCH FROM (NOW() - tm.entered_at))/3600 -- em horas
    END AS time_in_column,
    t.completed,
    t.created_at AS task_created_at,
    t.completed_at,
    CASE 
        WHEN t.completed_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (t.completed_at - t.created_at))/3600 -- lead time em horas
        ELSE 
            NULL
    END AS lead_time,
    CASE 
        WHEN t.completed_at IS NOT NULL AND t.started_at IS NOT NULL THEN 
            EXTRACT(EPOCH FROM (t.completed_at - t.started_at))/3600 -- cycle time em horas
        ELSE 
            NULL
    END AS cycle_time
FROM 
    task_metrics tm
JOIN 
    tasks t ON tm.task_id = t.id
JOIN 
    kanban_columns kc ON tm.column_id = kc.id
JOIN 
    projects p ON kc.project_id = p.id
LEFT JOIN 
    categories c ON t.category_id = c.id;

-- View para dashboard com resumo do progresso por projeto
CREATE VIEW vw_project_progress AS
SELECT 
    p.id AS project_id,
    p.name AS project_name,
    p.description,
    p.user_id,
    u.name AS user_name,
    COUNT(t.id) AS total_tasks,
    SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END) AS completed_tasks,
    CASE 
        WHEN COUNT(t.id) > 0 THEN 
            ROUND((SUM(CASE WHEN t.completed = true THEN 1 ELSE 0 END)::numeric / COUNT(t.id)::numeric) * 100, 2)
        ELSE 
            0
    END AS completion_percentage,
    MIN(t.created_at) AS first_task_date,
    MAX(t.updated_at) AS last_activity_date,
    COUNT(DISTINCT kc.id) AS column_count
FROM 
    projects p
JOIN 
    users u ON p.user_id = u.id
LEFT JOIN 
    kanban_columns kc ON p.id = kc.project_id
LEFT JOIN 
    tasks t ON p.id = t.project_id
GROUP BY 
    p.id, p.name, p.description, p.user_id, u.name; 