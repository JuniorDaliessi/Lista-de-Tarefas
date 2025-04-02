-- 07_sample_data.sql
-- Dados de exemplo para testar a aplicação

-- Inserir usuário de teste
INSERT INTO users (
    id, 
    email, 
    password_hash, 
    name, 
    theme
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'usuario@exemplo.com',
    crypt('senha123', gen_salt('bf')),
    'Usuário Teste',
    'light'
);

-- Inserir categorias para o usuário
INSERT INTO categories (
    id,
    user_id,
    name,
    color,
    icon
) VALUES 
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Trabalho', '#4285f4', 'briefcase'),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Pessoal', '#ea4335', 'user'),
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Estudos', '#fbbc05', 'book'),
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Saúde', '#34a853', 'heartbeat'),
    ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Projetos', '#9c27b0', 'project-diagram');

-- Inserir projeto de teste
INSERT INTO projects (
    id,
    user_id,
    name,
    description
) VALUES (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Aplicativo Todo',
    'Projeto para desenvolvimento do aplicativo de gerenciamento de tarefas'
);

-- Inserir colunas kanban para o projeto
INSERT INTO kanban_columns (
    id,
    project_id,
    title,
    order_position,
    wip_limit
) VALUES 
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'backlog', 0, NULL),
    ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'in-progress', 1, 5),
    ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'review', 2, 3),
    ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'done', 3, NULL);

-- Inserir tarefas de exemplo
INSERT INTO tasks (
    id,
    user_id,
    title,
    description,
    completed,
    due_date,
    priority,
    created_at,
    category_id,
    project_id,
    column_id,
    column_order
) VALUES 
    (
        '40000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        'Implementar banco de dados',
        'Criar esquema do banco de dados para a aplicação de tarefas',
        true,
        (CURRENT_DATE - INTERVAL '5 days'),
        'alta',
        (NOW() - INTERVAL '10 days'),
        '10000000-0000-0000-0000-000000000005',
        '20000000-0000-0000-0000-000000000001',
        'done',
        0
    ),
    (
        '40000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        'Criar API de tarefas',
        'Desenvolver endpoints REST para gerenciamento de tarefas',
        false,
        (CURRENT_DATE + INTERVAL '2 days'),
        'média',
        (NOW() - INTERVAL '5 days'),
        '10000000-0000-0000-0000-000000000005',
        '20000000-0000-0000-0000-000000000001',
        'in-progress',
        0
    ),
    (
        '40000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000001',
        'Implementar autenticação',
        'Criar sistema de login e registro de usuários',
        false,
        (CURRENT_DATE + INTERVAL '7 days'),
        'alta',
        (NOW() - INTERVAL '3 days'),
        '10000000-0000-0000-0000-000000000005',
        '20000000-0000-0000-0000-000000000001',
        'backlog',
        0
    ),
    (
        '40000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000001',
        'Revisar código do frontend',
        'Realizar code review dos componentes React',
        false,
        (CURRENT_DATE + INTERVAL '1 day'),
        'média',
        (NOW() - INTERVAL '2 days'),
        '10000000-0000-0000-0000-000000000005',
        '20000000-0000-0000-0000-000000000001',
        'review',
        0
    ),
    (
        '40000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000001',
        'Estudar PostgreSQL',
        'Aprender sobre índices e otimização de consultas',
        false,
        (CURRENT_DATE + INTERVAL '3 days'),
        'baixa',
        (NOW() - INTERVAL '6 days'),
        '10000000-0000-0000-0000-000000000003',
        NULL,
        NULL,
        NULL
    ),
    (
        '40000000-0000-0000-0000-000000000006',
        '00000000-0000-0000-0000-000000000001',
        'Ida ao médico',
        'Consulta de rotina',
        false,
        (CURRENT_DATE + INTERVAL '10 days'),
        'média',
        (NOW() - INTERVAL '1 day'),
        '10000000-0000-0000-0000-000000000004',
        NULL,
        NULL,
        NULL
    ),
    (
        '40000000-0000-0000-0000-000000000007',
        '00000000-0000-0000-0000-000000000001',
        'Reunião com o cliente',
        'Apresentar protótipo do aplicativo',
        false,
        (CURRENT_DATE - INTERVAL '1 day'),
        'alta',
        (NOW() - INTERVAL '4 days'),
        '10000000-0000-0000-0000-000000000001',
        NULL,
        NULL,
        NULL
    );

-- Inserir subtarefas
INSERT INTO subtasks (
    id,
    task_id,
    title,
    completed
) VALUES 
    (
        '50000000-0000-0000-0000-000000000001',
        '40000000-0000-0000-0000-000000000001',
        'Criar tabelas de usuários',
        true
    ),
    (
        '50000000-0000-0000-0000-000000000002',
        '40000000-0000-0000-0000-000000000001',
        'Criar tabelas de tarefas',
        true
    ),
    (
        '50000000-0000-0000-0000-000000000003',
        '40000000-0000-0000-0000-000000000001',
        'Criar índices',
        true
    ),
    (
        '50000000-0000-0000-0000-000000000004',
        '40000000-0000-0000-0000-000000000002',
        'Endpoint de listagem de tarefas',
        true
    ),
    (
        '50000000-0000-0000-0000-000000000005',
        '40000000-0000-0000-0000-000000000002',
        'Endpoint de criação de tarefas',
        false
    ),
    (
        '50000000-0000-0000-0000-000000000006',
        '40000000-0000-0000-0000-000000000003',
        'Criar página de login',
        false
    ),
    (
        '50000000-0000-0000-0000-000000000007',
        '40000000-0000-0000-0000-000000000003',
        'Implementar autenticação JWT',
        false
    );

-- Inserir métricas de tarefas para análise de fluxo kanban
INSERT INTO task_metrics (
    task_id,
    column_id,
    entered_at,
    left_at
) VALUES 
    (
        '40000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000001',
        (NOW() - INTERVAL '10 days'),
        (NOW() - INTERVAL '8 days')
    ),
    (
        '40000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000002',
        (NOW() - INTERVAL '8 days'),
        (NOW() - INTERVAL '6 days')
    ),
    (
        '40000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000003',
        (NOW() - INTERVAL '6 days'),
        (NOW() - INTERVAL '5 days')
    ),
    (
        '40000000-0000-0000-0000-000000000001',
        '30000000-0000-0000-0000-000000000004',
        (NOW() - INTERVAL '5 days'),
        NULL
    ),
    (
        '40000000-0000-0000-0000-000000000002',
        '30000000-0000-0000-0000-000000000001',
        (NOW() - INTERVAL '5 days'),
        (NOW() - INTERVAL '3 days')
    ),
    (
        '40000000-0000-0000-0000-000000000002',
        '30000000-0000-0000-0000-000000000002',
        (NOW() - INTERVAL '3 days'),
        NULL
    ),
    (
        '40000000-0000-0000-0000-000000000003',
        '30000000-0000-0000-0000-000000000001',
        (NOW() - INTERVAL '3 days'),
        NULL
    ),
    (
        '40000000-0000-0000-0000-000000000004',
        '30000000-0000-0000-0000-000000000001',
        (NOW() - INTERVAL '2 days'),
        (NOW() - INTERVAL '1 day')
    ),
    (
        '40000000-0000-0000-0000-000000000004',
        '30000000-0000-0000-0000-000000000002',
        (NOW() - INTERVAL '1 day'),
        (NOW() - INTERVAL '12 hours')
    ),
    (
        '40000000-0000-0000-0000-000000000004',
        '30000000-0000-0000-0000-000000000003',
        (NOW() - INTERVAL '12 hours'),
        NULL
    );

-- Atualizar campos de métricas nas tarefas
UPDATE tasks
SET 
    started_at = (NOW() - INTERVAL '8 days'),
    completed_at = (NOW() - INTERVAL '5 days')
WHERE id = '40000000-0000-0000-0000-000000000001';

UPDATE tasks
SET 
    started_at = (NOW() - INTERVAL '3 days')
WHERE id = '40000000-0000-0000-0000-000000000002';

UPDATE tasks
SET 
    started_at = (NOW() - INTERVAL '1 day')
WHERE id = '40000000-0000-0000-0000-000000000004'; 