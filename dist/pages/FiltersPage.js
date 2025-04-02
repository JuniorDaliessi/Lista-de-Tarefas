"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const TodoContext_1 = require("../contexts/TodoContext");
const TodoItem_1 = __importDefault(require("../components/TodoItem"));
const fa_1 = require("react-icons/fa");
const SearchAutocomplete_1 = __importDefault(require("../components/SearchAutocomplete"));
const FiltersPageContainer = styled_components_1.default.div `
  max-width: 800px;
  margin: 0 auto;
`;
const PageHeader = styled_components_1.default.header `
  text-align: center;
  margin-bottom: 2rem;
`;
const PageTitle = styled_components_1.default.h1 `
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.8rem;
    color: var(--accent-color);
  }
`;
const PageSubtitle = styled_components_1.default.p `
  color: var(--text-secondary);
  font-size: 1.1rem;
`;
const FiltersContainer = styled_components_1.default.div `
  background-color: var(--background-primary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
const FilterGroup = styled_components_1.default.div `
  margin-bottom: 1.5rem;
`;
const FilterLabel = styled_components_1.default.h3 `
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--accent-color);
  }
`;
const FilterOptions = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;
const FilterOption = styled_components_1.default.div `
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.active ? 'var(--accent-color)' : 'var(--background-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--accent-dark)' : 'var(--hover-background)'};
  }
`;
const ResultsContainer = styled_components_1.default.div `
  margin-top: 2rem;
`;
const ResultsHeader = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;
const ResultsCount = styled_components_1.default.span `
  font-size: 0.9rem;
  color: var(--text-secondary);
`;
const EmptyResults = styled_components_1.default.div `
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  background-color: var(--background-secondary);
  border-radius: 8px;
  font-size: 1.1rem;
`;
// Estilizando nosso componente SearchAutocomplete para corresponder ao estilo da página
const StyledSearchAutocomplete = (0, styled_components_1.default)(SearchAutocomplete_1.default) `
  margin-bottom: 1.5rem;
`;
const FiltersPage = () => {
    const { todos, sortBy, setSortBy } = (0, TodoContext_1.useTodo)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('todas');
    const [priorityFilter, setPriorityFilter] = (0, react_1.useState)('todas');
    // Extrair títulos únicos para o autocomplete
    const todoTitles = (0, react_1.useMemo)(() => {
        const titles = todos.map(todo => todo.title);
        return Array.from(new Set(titles)); // Usar Array.from em vez de spread operator
    }, [todos]);
    // Mapear títulos para IDs para facilitar a navegação
    const titleToIdMap = (0, react_1.useMemo)(() => {
        const map = {};
        todos.forEach(todo => {
            map[todo.title] = todo.id;
        });
        return map;
    }, [todos]);
    // Navegação para a página de detalhes quando uma sugestão for selecionada
    const handleSuggestionSelect = (0, react_1.useCallback)((title) => {
        const todoId = titleToIdMap[title];
        if (todoId) {
            navigate(`/tarefa/${todoId}`);
        }
    }, [navigate, titleToIdMap]);
    // Aplicar filtros às tarefas
    const filteredTodos = todos.filter(todo => {
        // Filtro de texto (busca)
        const matchesSearchTerm = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchTerm.toLowerCase());
        // Filtro de status
        const matchesStatus = statusFilter === 'todas' ||
            (statusFilter === 'pendentes' && !todo.completed) ||
            (statusFilter === 'concluídas' && todo.completed);
        // Filtro de prioridade
        const matchesPriority = priorityFilter === 'todas' || todo.priority === priorityFilter;
        return matchesSearchTerm && matchesStatus && matchesPriority;
    });
    // Ordenar as tarefas com base no sortBy
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        switch (sortBy) {
            case 'data':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'prioridade':
                const priorityValues = { alta: 0, média: 1, baixa: 2 };
                return priorityValues[a.priority] - priorityValues[b.priority];
            case 'alfabética':
                return a.title.localeCompare(b.title);
            case 'criação':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            default:
                return 0;
        }
    });
    return ((0, jsx_runtime_1.jsxs)(FiltersPageContainer, { children: [(0, jsx_runtime_1.jsxs)(PageHeader, { children: [(0, jsx_runtime_1.jsxs)(PageTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaFilter, {}), "Filtros Avan\u00E7ados"] }), (0, jsx_runtime_1.jsx)(PageSubtitle, { children: "Encontre exatamente o que voc\u00EA est\u00E1 procurando" })] }), (0, jsx_runtime_1.jsxs)(FiltersContainer, { children: [(0, jsx_runtime_1.jsx)(StyledSearchAutocomplete, { placeholder: "Buscar tarefas por t\u00EDtulo ou descri\u00E7\u00E3o...", value: searchTerm, onChange: setSearchTerm, suggestions: todoTitles, onSuggestionSelect: handleSuggestionSelect }), (0, jsx_runtime_1.jsxs)(FilterGroup, { children: [(0, jsx_runtime_1.jsx)(FilterLabel, { children: "Status" }), (0, jsx_runtime_1.jsxs)(FilterOptions, { children: [(0, jsx_runtime_1.jsx)(FilterOption, { active: statusFilter === 'todas', onClick: () => setStatusFilter('todas'), children: "Todas" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: statusFilter === 'pendentes', onClick: () => setStatusFilter('pendentes'), children: "Pendentes" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: statusFilter === 'concluídas', onClick: () => setStatusFilter('concluídas'), children: "Conclu\u00EDdas" })] })] }), (0, jsx_runtime_1.jsxs)(FilterGroup, { children: [(0, jsx_runtime_1.jsx)(FilterLabel, { children: "Prioridade" }), (0, jsx_runtime_1.jsxs)(FilterOptions, { children: [(0, jsx_runtime_1.jsx)(FilterOption, { active: priorityFilter === 'todas', onClick: () => setPriorityFilter('todas'), children: "Todas" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: priorityFilter === 'baixa', onClick: () => setPriorityFilter('baixa'), children: "Baixa" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: priorityFilter === 'média', onClick: () => setPriorityFilter('média'), children: "M\u00E9dia" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: priorityFilter === 'alta', onClick: () => setPriorityFilter('alta'), children: "Alta" })] })] }), (0, jsx_runtime_1.jsxs)(FilterGroup, { children: [(0, jsx_runtime_1.jsxs)(FilterLabel, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaSort, {}), "Ordenar por"] }), (0, jsx_runtime_1.jsxs)(FilterOptions, { children: [(0, jsx_runtime_1.jsx)(FilterOption, { active: sortBy === 'data', onClick: () => setSortBy('data'), children: "Data" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: sortBy === 'prioridade', onClick: () => setSortBy('prioridade'), children: "Prioridade" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: sortBy === 'alfabética', onClick: () => setSortBy('alfabética'), children: "Alfab\u00E9tica" }), (0, jsx_runtime_1.jsx)(FilterOption, { active: sortBy === 'criação', onClick: () => setSortBy('criação'), children: "Data de cria\u00E7\u00E3o" })] })] })] }), (0, jsx_runtime_1.jsxs)(ResultsContainer, { children: [(0, jsx_runtime_1.jsxs)(ResultsHeader, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Resultados" }), (0, jsx_runtime_1.jsxs)(ResultsCount, { children: [sortedTodos.length, " tarefas encontradas"] })] }), sortedTodos.length > 0 ? (sortedTodos.map(todo => (0, jsx_runtime_1.jsx)(TodoItem_1.default, { todo: todo }, todo.id))) : ((0, jsx_runtime_1.jsx)(EmptyResults, { children: "Nenhuma tarefa encontrada com os filtros aplicados" }))] })] }));
};
exports.default = FiltersPage;
