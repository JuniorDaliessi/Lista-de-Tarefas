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
const fa_1 = require("react-icons/fa");
const TodoForm_1 = __importDefault(require("../components/TodoForm"));
const TodoContext_1 = require("../contexts/TodoContext");
const SearchAutocomplete_1 = __importDefault(require("../components/SearchAutocomplete"));
const HomeContainer = styled_components_1.default.div `
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
  animation: fadeIn var(--transition-normal);
  
  @media (max-width: 920px) {
    width: 100%;
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;
const HomeHeader = styled_components_1.default.header `
  text-align: center;
  margin-bottom: 2.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;
const HomeTitle = styled_components_1.default.h1 `
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: var(--accent-color);
    margin-right: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;
const HomeSubtitle = styled_components_1.default.p `
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
const StyledSearchAutocomplete = (0, styled_components_1.default)(SearchAutocomplete_1.default) `
  max-width: 600px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;
const StatsBar = styled_components_1.default.div `
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
`;
const StatItem = styled_components_1.default.div `
  background-color: var(--card-background);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: translateY(-3px);
  }
`;
const StatLabel = styled_components_1.default.div `
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;
const StatValue = styled_components_1.default.div `
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
`;
const HomePage = () => {
    const { searchQuery, setSearchQuery, todos } = (0, TodoContext_1.useTodo)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Calcular estatísticas
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
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
    return ((0, jsx_runtime_1.jsxs)(HomeContainer, { children: [(0, jsx_runtime_1.jsxs)(HomeHeader, { children: [(0, jsx_runtime_1.jsxs)(HomeTitle, { children: [(0, jsx_runtime_1.jsx)(fa_1.FaTasks, {}), "Lista de Tarefas"] }), (0, jsx_runtime_1.jsx)(HomeSubtitle, { children: "Gerencie suas tarefas de forma simples e eficiente. Organize, priorize e acompanhe seu progresso." })] }), (0, jsx_runtime_1.jsx)(StyledSearchAutocomplete, { placeholder: "Buscar tarefas...", value: searchQuery, onChange: setSearchQuery, suggestions: todoTitles, onSuggestionSelect: handleSuggestionSelect }), (0, jsx_runtime_1.jsxs)(StatsBar, { children: [(0, jsx_runtime_1.jsxs)(StatItem, { children: [(0, jsx_runtime_1.jsx)(StatLabel, { children: "Total de Tarefas" }), (0, jsx_runtime_1.jsx)(StatValue, { children: totalTasks })] }), (0, jsx_runtime_1.jsxs)(StatItem, { children: [(0, jsx_runtime_1.jsx)(StatLabel, { children: "Pendentes" }), (0, jsx_runtime_1.jsx)(StatValue, { children: pendingTasks })] }), (0, jsx_runtime_1.jsxs)(StatItem, { children: [(0, jsx_runtime_1.jsx)(StatLabel, { children: "Conclu\u00EDdas" }), (0, jsx_runtime_1.jsx)(StatValue, { children: completedTasks })] }), (0, jsx_runtime_1.jsxs)(StatItem, { children: [(0, jsx_runtime_1.jsx)(StatLabel, { children: "Taxa de Conclus\u00E3o" }), (0, jsx_runtime_1.jsxs)(StatValue, { children: [completionRate, "%"] })] })] }), (0, jsx_runtime_1.jsx)("main", { children: (0, jsx_runtime_1.jsx)(TodoForm_1.default, {}) })] }));
};
exports.default = HomePage;
