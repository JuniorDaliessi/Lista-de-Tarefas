# Todo App com Quadros Kanban

Uma aplicação de gerenciamento de tarefas e projetos com funcionalidade de quadros Kanban para organização visual do fluxo de trabalho.

## Funcionalidades

- **Gerenciamento de Tarefas**: Criar, atualizar, completar e excluir tarefas
- **Subtarefas**: Dividir tarefas em passos menores
- **Categorização**: Organizar tarefas por categorias personalizáveis
- **Projetos**: Agrupar tarefas em projetos
- **Quadros Kanban**: Visualizar e gerenciar tarefas em colunas de progresso
- **Priorização**: Definir prioridades para suas tarefas
- **Datas de Vencimento**: Acompanhar prazos
- **Estatísticas**: Visualizar métricas de progresso e produtividade
- **API RESTful**: Backend completo para integração com aplicações frontend

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Segurança**: Bcrypt para hash de senhas, Helmet para proteção HTTP
- **Outros**: Validação com Zod, Logging com Morgan

## Configuração para Desenvolvimento

### Pré-requisitos

- Node.js (v14+)
- PostgreSQL (v13+)
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/todo-app.git
   cd todo-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações.

4. Configure o banco de dados:
   ```bash
   npm run db:migrate
   npm run db:seed # opcional, para dados de exemplo
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O servidor estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
src/
├── config/          # Configurações (banco de dados, etc.)
├── controllers/     # Controladores da API
├── middleware/      # Middleware (autenticação, etc.)
├── routes/          # Rotas da API
├── services/        # Lógica de negócios
├── utils/           # Utilitários
├── app.ts           # Configuração do Express
└── server.ts        # Ponto de entrada da aplicação
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `GET /api/tasks/:id` - Obter tarefa específica
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Excluir tarefa
- `PATCH /api/tasks/:id/toggle` - Alternar status de conclusão

### Subtarefas
- `GET /api/tasks/:taskId/subtasks` - Listar subtarefas
- `POST /api/tasks/:taskId/subtasks` - Criar subtarefa

### Projetos
- `GET /api/projects` - Listar projetos
- `GET /api/projects/:id/board` - Obter quadro Kanban

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria

### Estatísticas
- `GET /api/stats/dashboard` - Obter dados para dashboard
- `GET /api/stats/daily-progress` - Obter progresso diário

## Scripts Disponíveis

- `npm start` - Iniciar servidor em produção
- `npm run dev` - Iniciar servidor em desenvolvimento com hot-reload
- `npm run build` - Compilar TypeScript para JavaScript
- `npm run lint` - Executar linter
- `npm test` - Executar testes
- `npm run db:migrate` - Executar migrações do banco de dados
- `npm run db:seed` - Povoar banco de dados com dados iniciais

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
