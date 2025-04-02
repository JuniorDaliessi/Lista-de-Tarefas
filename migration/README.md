# Scripts de Migração para o Banco de Dados Todo-App

Este diretório contém scripts SQL para criação e configuração do banco de dados PostgreSQL para a aplicação todo-app.

## Estrutura dos Scripts

Os scripts estão organizados na seguinte ordem de execução:

1. `01_init_schema.sql` - Criação do esquema básico, extensões e tabelas iniciais (usuários e categorias)
2. `02_tasks_subtasks.sql` - Criação das tabelas de tarefas e subtarefas
3. `03_projects_kanban.sql` - Criação das tabelas de projetos e colunas kanban
4. `04_views.sql` - Criação de visualizações (views) para análise de dados
5. `05_functions.sql` - Funções e procedimentos armazenados
6. `06_indexes_constraints.sql` - Índices adicionais e restrições
7. `07_sample_data.sql` - Dados de exemplo para testes

Adicionalmente, o script `00_run_all.sql` executa todos os scripts acima em sequência, exceto os dados de exemplo que devem ser executados manualmente.

## Pré-requisitos

- PostgreSQL 14+ instalado
- Privilégios de superusuário ou permissão para criar extensões

## Como Executar

### Método 1: Usando o script executável

```bash
psql -U postgres -d todo_app -f 00_run_all.sql
```

Isso irá executar todos os scripts na ordem correta, exceto os dados de exemplo.

### Método 2: Executando scripts individualmente

```bash
psql -U postgres -d todo_app -f 01_init_schema.sql
psql -U postgres -d todo_app -f 02_tasks_subtasks.sql
# ... e assim por diante
```

## Dados de Exemplo

Para inserir dados de exemplo:

```bash
psql -U postgres -d todo_app -f 07_sample_data.sql
```

## Principais Funcionalidades Implementadas

O banco de dados suporta as seguintes funcionalidades:

1. **Gerenciamento de Usuários**
   - Registro e autenticação
   - Preferências de tema

2. **Gerenciamento de Tarefas**
   - Tarefas com título, descrição, data de vencimento e prioridade
   - Subtarefas
   - Categorização
   - Marcação de tarefas como concluídas

3. **Sistema Kanban**
   - Projetos com colunas personalizáveis
   - Movimentação de tarefas entre colunas
   - Limites de trabalho em progresso (WIP)
   - Métricas de lead time e cycle time

4. **Dashboard e Análises**
   - Estatísticas de tarefas por usuário
   - Métricas de tempo em cada coluna
   - Progressão de projetos

## Modelo de Dados

As principais entidades do banco de dados são:

- `users` - Usuários do sistema
- `tasks` - Tarefas
- `subtasks` - Subtarefas
- `categories` - Categorias para agrupar tarefas
- `projects` - Projetos para organizar tarefas em um quadro kanban
- `kanban_columns` - Colunas do quadro kanban
- `task_metrics` - Métricas de tempo para análise de fluxo

## Views para Análise

- `vw_tasks_details` - Detalhes completos das tarefas
- `vw_user_task_stats` - Estatísticas de tarefas por usuário
- `vw_task_time_metrics` - Métricas de tempo para cada tarefa
- `vw_project_progress` - Resumo do progresso de cada projeto

## Funções e Stored Procedures

O banco de dados possui diversas funções e procedimentos, incluindo:

- `register_user` - Registra um novo usuário
- `authenticate_user` - Autentica um usuário
- `create_default_project` - Cria um projeto padrão com colunas
- `calculate_task_time_metrics` - Calcula métricas de tempo para uma tarefa
- `move_task_to_column` - Move uma tarefa entre colunas

## Manutenção

Para atualizar o esquema do banco de dados, crie novos scripts de migração com a nomenclatura:

```
XX_nome_descritivo.sql
```

Onde XX é o número sequencial da migração. 