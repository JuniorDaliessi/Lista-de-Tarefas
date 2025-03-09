# Aplicativo de Lista de Tarefas

Um aplicativo simples e intuitivo para gerenciamento de tarefas diárias, criado com React e TypeScript. Este projeto utiliza o armazenamento local do navegador (Local Storage) para persistência de dados.

## Funcionalidades

- Criação de tarefas com título, descrição, data e prioridade
- Edição de tarefas existentes
- Marcação de tarefas como concluídas
- Exclusão de tarefas
- Filtragem por status (todas, pendentes, concluídas)
- Ordenação por data, prioridade, alfabética ou data de criação
- Persistência de dados através do Local Storage

## Tecnologias Utilizadas

- React
- TypeScript
- Styled Components
- Local Storage API
- React Icons

## Estrutura do Projeto

- `/components` - Componentes React reutilizáveis
- `/contexts` - Contexto global para gerenciamento de estado
- `/services` - Serviços para interação com o Local Storage
- `/types` - Definições de tipos TypeScript
- `/hooks` - Hooks personalizados

## Como Executar o Projeto

1. Clone o repositório:
```
git clone [URL_DO_REPOSITORIO]
cd todo-app
```

2. Instale as dependências:
```
npm install
```

3. Execute o projeto:
```
npm start
```

4. Acesse o aplicativo em:
```
http://localhost:3000
```

## Desenvolvimento

Este projeto foi criado como uma solução prática para gerenciamento de tarefas sem a necessidade de um back-end. Utiliza o Local Storage para armazenar os dados das tarefas diretamente no navegador do usuário.

## Possíveis Melhorias Futuras

- Implementação de temas claro/escuro
- Categorização de tarefas
- Funcionalidade de busca
- Notificações para tarefas com data próxima
- Integração com um back-end real para sincronização entre dispositivos

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
