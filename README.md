# Todo App Kanban

Um aplicativo para gerenciamento de tarefas e projetos com visualização Kanban.

## Funcionalidades

- Gerenciamento de tarefas com prioridade, categorias e datas
- Visualização Kanban de projetos
- Interface responsiva
- Tema claro/escuro
- Armazenamento local dos dados

## Deploy na Vercel

### Método 1: Deploy com GitHub

1. Faça fork deste repositório para sua conta GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "New Project"
4. Importe o repositório do GitHub
5. Mantenha as configurações padrão (Framework Preset: Create React App)
6. Clique em "Deploy"

### Método 2: Deploy com CLI Vercel

1. Instale a CLI da Vercel:
```bash
npm install -g vercel
```

2. Faça login na sua conta Vercel:
```bash
vercel login
```

3. Na pasta do projeto, execute:
```bash
vercel
```

4. Siga as instruções para completar o deploy

### Método 3: Deploy manual

1. Construa o projeto:
```bash
npm run build
```

2. Instale a CLI da Vercel:
```bash
npm install -g vercel
```

3. Faça login:
```bash
vercel login
```

4. Faça o deploy da pasta build:
```bash
vercel ./build
```

## Desenvolvimento Local

### Pré-requisitos

- Node.js (versão 14 ou superior)
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
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

4. Acesse http://localhost:3000 no navegador

## Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejeta a configuração do Create React App

## Tecnologias

- React
- TypeScript
- React Router
- Styled Components
- localStorage para persistência de dados

## Licença

MIT

## Publicação no GitHub

1. Adicione o repositório remoto:
```
git remote add origin https://github.com/JuniorDaliessi/todo-app.git
```

2. Renomeie a branch atual para 'main':
```
git branch -M main
```

3. Envie as alterações para o repositório remoto:
```
git push -u origin main
```
